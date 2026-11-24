// Reyna's Superfoods · Edge Function "emitir-comprobante"
// Emite una boleta o factura electrónica con Factus (PSE Complexless).
//
// Secretos que se configuran en Supabase (Edge Functions → Secrets), NUNCA en el código:
//   FACTUS_TOKEN   token que entrega el proveedor (Carlos / Phuyusoft)
//   FACTUS_URL     URL del endpoint para emitir (la da el proveedor con la documentación)
// Mientras FACTUS_TOKEN no exista, la función responde { ok:false, code:'sin_api' }
// y el comprobante queda "pendiente" para emitirse después desde el panel.
//
// Solo la usan administradores: se revisa el usuario en la tabla public.admins.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Solo la página de la tienda puede llamar a esta función desde el navegador.
// Cuando tengan dominio propio, agrégalo en el secreto SITE_ORIGINS (separado por comas), p. ej. https://reynassuperfoods.pe
const allowed = (origin: string) =>
  /^https:\/\/([a-z0-9-]+\.)?reynasuperfoods\.pages\.dev$/.test(origin) ||
  (Deno.env.get('SITE_ORIGINS') || '').split(',').map((s) => s.trim()).filter(Boolean).includes(origin);
let cors: Record<string, string> = {};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json', 'X-Content-Type-Options': 'nosniff' } });

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin') || '';
  cors = {
    'Access-Control-Allow-Origin': allowed(origin) ? origin : 'https://reynasuperfoods.pages.dev',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (origin && !allowed(origin)) return json({ ok: false, message: 'Origen no permitido' }, 403);
  if (req.method !== 'POST') return json({ ok: false, message: 'Método no permitido' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const db = createClient(url, service, { auth: { persistSession: false } });

  // 1) ¿Quién llama? Debe ser un administrador.
  const jwt = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const { data: userData } = await db.auth.getUser(jwt);
  const user = userData?.user;
  if (!user) return json({ ok: false, message: 'Sesión no válida' }, 401);
  const { data: adm } = await db.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (!adm) return json({ ok: false, message: 'Sin permiso' }, 403);

  // 2) Comprobante a emitir (o solo consultar si la API ya está conectada)
  // deno-lint-ignore no-explicit-any
  let body: any = {};
  try { body = await req.json(); } catch { /* sin cuerpo */ }
  if (body.action === 'estado') {
    return json({ ok: true, configurado: !!(Deno.env.get('FACTUS_TOKEN') && Deno.env.get('FACTUS_URL')) });
  }
  const invoiceId = Number(body.invoice_id);
  if (!invoiceId) return json({ ok: false, message: 'Falta invoice_id' }, 400);
  const { data: inv } = await db.from('invoices').select('*').eq('id', invoiceId).maybeSingle();
  if (!inv) return json({ ok: false, message: 'Comprobante no encontrado' }, 404);
  if (inv.status === 'aceptado') return json({ ok: true, invoice: inv });

  const { data: st } = await db.from('settings').select('value').eq('key', 'billing').maybeSingle();
  const billing = st?.value || {};

  // 3) ¿Ya hay acceso a la API?
  const token = Deno.env.get('FACTUS_TOKEN');
  const endpoint = Deno.env.get('FACTUS_URL');
  if (!token || !endpoint) {
    await db.from('invoices').update({ message: 'Esperando el acceso a la API de facturación.' }).eq('id', inv.id);
    return json({ ok: false, code: 'sin_api', message: 'La facturación se activará cuando el proveedor entregue el acceso a la API.' });
  }

  // 4) Enviar a Factus
  try {
    const payload = buildFactusPayload(inv, billing);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    const r = readFactusResponse(body);
    if (!res.ok || !r.ok) {
      await db.from('invoices').update({ status: 'rechazado', message: r.message || `Error ${res.status}`, pse_response: body }).eq('id', inv.id);
      return json({ ok: false, code: 'rechazado', message: r.message || `El facturador respondió con error ${res.status}` });
    }
    const upd = {
      status: 'aceptado', series: r.series, number: r.number, pdf_url: r.pdf, xml_url: r.xml,
      message: r.message || 'Aceptado', pse_response: body, issued_at: new Date().toISOString(),
    };
    const { data: saved } = await db.from('invoices').update(upd).eq('id', inv.id).select().single();
    if (inv.order_id) {
      await db.from('orders').update({
        status: 'facturado', invoice_series: r.series, invoice_number: r.number,
        invoice_pdf_url: r.pdf, invoiced_at: upd.issued_at,
      }).eq('id', inv.order_id);
    }
    return json({ ok: true, invoice: saved });
  } catch (err) {
    await db.from('invoices').update({ status: 'error', message: String(err) }).eq('id', inv.id);
    return json({ ok: false, code: 'error', message: 'No se pudo conectar con el facturador.' }, 502);
  }
});

// ---------------------------------------------------------------------------
// Adaptador de Factus. Cuando llegue la documentación de la API, solo se ajustan
// los nombres de los campos de estas dos funciones; el resto ya está listo.
// ---------------------------------------------------------------------------
// deno-lint-ignore no-explicit-any
function buildFactusPayload(inv: any, billing: any) {
  const serie = inv.doc_type === 'factura' ? billing.serie_factura || 'F002' : billing.serie_boleta || 'B002';
  const docCode = { dni: '1', ruc: '6', ce: '4', ninguno: '0' }[inv.customer_doc_type as string] || '0';
  return {
    tipo_comprobante: inv.doc_type === 'factura' ? '01' : '03', // SUNAT: 01 factura, 03 boleta
    serie,
    moneda: 'PEN',
    fecha_emision: new Date().toISOString().slice(0, 10),
    emisor: { ruc: billing.ruc, razon_social: billing.razon_social, direccion: billing.direccion },
    cliente: {
      tipo_documento: docCode,
      numero_documento: inv.customer_doc || '-',
      nombre: inv.customer_name || 'CLIENTES VARIOS',
      direccion: inv.customer_address || '',
    },
    // deno-lint-ignore no-explicit-any
    items: (inv.items || []).map((i: any) => ({
      descripcion: i.name,
      cantidad: Number(i.qty),
      unidad: 'NIU',
      precio_unitario: Number(i.price), // incluye IGV si el afecto es "gravado"
      afectacion_igv: inv.igv_type === 'exonerado' ? '20' : '10', // SUNAT: 10 gravado, 20 exonerado
    })),
    total_gravado: inv.igv_type === 'gravado' ? Number(inv.subtotal) : 0,
    total_exonerado: inv.igv_type === 'exonerado' ? Number(inv.total) : 0,
    total_igv: Number(inv.igv),
    total: Number(inv.total),
    ambiente: billing.ambiente === 'produccion' ? 'produccion' : 'pruebas',
  };
}

// deno-lint-ignore no-explicit-any
function readFactusResponse(b: any) {
  return {
    ok: b?.success === true || b?.aceptado === true || b?.estado === 'ACEPTADO',
    series: b?.serie ?? b?.data?.serie ?? null,
    number: b?.numero != null ? String(b.numero) : (b?.data?.numero != null ? String(b.data.numero) : null),
    pdf: b?.enlace_pdf ?? b?.pdf ?? b?.data?.pdf ?? null,
    xml: b?.enlace_xml ?? b?.xml ?? b?.data?.xml ?? null,
    message: b?.mensaje ?? b?.message ?? b?.sunat_description ?? '',
  };
}
