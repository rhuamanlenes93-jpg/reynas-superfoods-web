/* Páginas legales: Libro de Reclamaciones, Política de privacidad y Términos.
   Los datos de la empresa (RUC, dirección, correo, enlace del libro…) se llenan desde el panel → Inicio → Datos de tu empresa. */
import { esc, layout } from './seo.js';

const WA_TXT = 'WhatsApp +51 918 515 262';
const WA_URL = 'https://wa.me/51918515262';
const UPD = '24 de noviembre de 2026';

function emp(e = {}){
  return {
    rs: e.razon_social || "Reyna's Superfoods S.A.C.",
    ruc: e.ruc || '',
    dir: e.direccion || 'Lima, Perú',
    correo: e.correo || '',
    horario: e.horario || '',
    zona: e.zona || 'Lima y provincias',
    libro: /^https:\/\//.test(e.libro_url || '') ? e.libro_url : '',
    cambios: e.dias_cambio || '7'
  };
}
const contacto = d => d.correo ? `al correo <a href="mailto:${esc(d.correo)}">${esc(d.correo)}</a> o por <a href="${WA_URL}" rel="noopener">${WA_TXT}</a>` : `por <a href="${WA_URL}" rel="noopener">${WA_TXT}</a>`;
const ficha = d => `<div class="pg-card-legal"><p><b>${esc(d.rs)}</b></p>${d.ruc ? `<p>RUC ${esc(d.ruc)}</p>` : ''}<p>Domicilio: ${esc(d.dir)}</p><p>Contacto: ${contacto(d)}</p>${d.horario ? `<p>Horario de atención: ${esc(d.horario)}</p>` : ''}</div>`;

export function libroPage({ origin, data }){
  const d = emp(data.empresa);
  const body = `<article class="pg-doc">
<h1>Libro de Reclamaciones</h1>
<p class="pg-upd">Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, contamos con un Libro de Reclamaciones virtual a tu disposición.</p>
<div class="pg-libro-box">
  <h2>Registra tu reclamo o queja</h2>
  ${d.libro
    ? `<p>Se abre el Libro de Reclamaciones virtual de ${esc(d.rs)}. Al terminar recibirás una copia de tu hoja de reclamación.</p><p style="margin-top:16px"><a class="pg-btn pri" href="${esc(d.libro)}" rel="noopener" target="_blank">Abrir el Libro de Reclamaciones</a></p>`
    : `<p>Escríbenos ${contacto(d)} con tu nombre, tu DNI, el producto, el monto y lo que pasó. Te enviamos una copia de tu reclamo y una respuesta por escrito.</p><p style="margin-top:16px"><a class="pg-btn pri" href="${WA_URL}?text=${encodeURIComponent('Hola, quiero registrar un reclamo en el Libro de Reclamaciones.')}" rel="noopener">Registrar mi reclamo por WhatsApp</a></p>`}
</div>
<h2>Datos del proveedor</h2>
${ficha(d)}
<h2>¿Reclamo o queja?</h2>
<ul>
  <li><b>Reclamo:</b> no estás conforme con el producto que compraste (llegó dañado, no es el que pediste, faltó algo).</li>
  <li><b>Queja:</b> no estás conforme con la atención, aunque no tenga que ver directamente con el producto.</li>
</ul>
<h2>¿Cuándo te respondemos?</h2>
<p>Respondemos por escrito en un plazo máximo de 15 días hábiles desde que registras tu reclamo o queja.</p>
<p>Presentar un reclamo en este libro no impide que acudas a otras vías de solución de controversias ni es requisito previo para presentar una denuncia ante el Indecopi.</p>
</article>`;
  return layout({ origin, path: '/libro-de-reclamaciones', title: "Libro de Reclamaciones | Reyna's Superfoods", description: `Libro de Reclamaciones virtual de ${d.rs}. Registra tu reclamo o queja y te respondemos en un máximo de 15 días hábiles.`, body, empresa: data.empresa });
}

export function privacidadPage({ origin, data }){
  const d = emp(data.empresa);
  const body = `<article class="pg-doc">
<h1>Política de privacidad</h1>
<p class="pg-upd">Última actualización: ${UPD}</p>
<p>En ${esc(d.rs)} cuidamos tus datos personales. Esta política explica qué datos recogemos en esta página, para qué los usamos y cómo puedes ejercer tus derechos, de acuerdo con la Ley N.° 29733, Ley de Protección de Datos Personales, y su reglamento.</p>
<h2>1. Quién es responsable de tus datos</h2>
${ficha(d)}
<h2>2. Qué datos recogemos</h2>
<ul>
  <li><b>Cuando armas un pedido:</b> tu nombre, tu distrito o provincia, la nota que escribas y los productos que eliges. Se guarda una copia del pedido para poder atenderlo.</li>
  <li><b>Cuando nos escribes por WhatsApp:</b> tu número de teléfono y lo que nos escribas, para coordinar el pago y el envío.</li>
  <li><b>Si pides boleta o factura:</b> tu DNI o RUC, nombre o razón social y dirección, porque los exige SUNAT.</li>
  <li><b>Estadísticas anónimas:</b> qué productos se agregan al carrito, sin ningún dato que te identifique.</li>
</ul>
<h2>3. Para qué los usamos</h2>
<ul>
  <li>Atender tu pedido, coordinar el pago, la entrega y la atención posventa.</li>
  <li>Emitir tu boleta o factura electrónica.</li>
  <li>Responder tus consultas, reclamos y quejas.</li>
  <li>Saber qué productos interesan más, para mejorar la tienda.</li>
</ul>
<p>No vendemos ni alquilamos tus datos. Solo te enviaremos promociones si nos das tu permiso aparte, y puedes retirarlo cuando quieras.</p>
<h2>4. Con quién se comparten</h2>
<p>Para que la tienda funcione usamos proveedores que guardan o procesan los datos por encargo nuestro: Supabase (base de datos), Cloudflare (alojamiento de la página), WhatsApp de Meta (mensajería) y el proveedor de facturación electrónica autorizado por SUNAT. Algunos de estos servicios tienen servidores fuera del Perú, por lo que puede haber transferencia internacional de datos, siempre con medidas de seguridad. También entregaremos datos a autoridades cuando la ley lo exija.</p>
<h2>5. Cuánto tiempo los guardamos</h2>
<p>Los datos de pedidos se guardan mientras sean necesarios para atenderte y por el tiempo que exigen las normas tributarias y de protección al consumidor. Puedes pedir que borremos tu pedido del historial cuando ya no sea necesario.</p>
<h2>6. Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, cancelación u oposición al uso de tus datos (derechos ARCO), y revocar tu consentimiento. Escríbenos ${contacto(d)} indicando tu nombre y lo que necesitas; te respondemos dentro de los plazos de ley. Si no estás conforme con la respuesta, puedes acudir a la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.</p>
<h2>7. Cookies y almacenamiento</h2>
<p>No usamos cookies de publicidad ni de rastreo. La página guarda en tu propio navegador los productos de tu carrito para que no se pierdan al recargar; puedes borrarlos desde la configuración de tu navegador.</p>
<h2>8. Consentimiento</h2>
<p>Al marcar la casilla “Acepto la política de privacidad” antes de enviar tu pedido, autorizas el uso de tus datos para los fines de esta política.</p>
</article>`;
  return layout({ origin, path: '/privacidad', title: "Política de privacidad | Reyna's Superfoods", description: `Cómo ${d.rs} usa y protege tus datos personales según la Ley 29733.`, body, empresa: data.empresa });
}

export function terminosPage({ origin, data }){
  const d = emp(data.empresa);
  const body = `<article class="pg-doc">
<h1>Términos, envíos y devoluciones</h1>
<p class="pg-upd">Última actualización: ${UPD}</p>
<h2>1. Quiénes somos</h2>
${ficha(d)}
<h2>2. Cómo se compra</h2>
<p>En esta página eliges los productos y envías tu pedido por WhatsApp. El pedido se confirma cuando te respondemos con el total (productos más envío) y realizas el pago. Enviar el mensaje no te obliga a comprar.</p>
<h2>3. Precios y pagos</h2>
<ul>
  <li>Los precios están en soles (S/). Cuando un producto no muestra precio, te lo indicamos por WhatsApp antes de que pagues.</li>
  <li>El costo de envío se suma al total y te lo decimos antes del pago.</li>
  <li>Los medios de pago disponibles (transferencia, Yape, Plin u otros) se coordinan por WhatsApp.</li>
  <li>Emitimos boleta o factura electrónica por cada venta.</li>
</ul>
<h2>4. Envíos</h2>
<p>Enviamos a ${esc(d.zona)}. El plazo y el costo dependen del destino y de la cantidad, y te los confirmamos antes de pagar. Al recibir, revisa que el paquete esté cerrado y completo.</p>
<h2>5. Cambios y devoluciones</h2>
<ul>
  <li>Si el producto llegó dañado, abierto, vencido o no es el que pediste, avísanos dentro de los ${esc(d.cambios)} días calendario siguientes a la entrega, con una foto del producto y del empaque.</li>
  <li>Te lo cambiamos por el producto correcto o te devolvemos el dinero, a tu elección, sin costo para ti.</li>
  <li>Por tratarse de alimentos, no aceptamos devoluciones de productos abiertos o usados que estaban en buen estado.</li>
</ul>
<h2>6. Información de los productos</h2>
<p>Los valores nutricionales que mostramos son referenciales, por 100 g, tomados de tablas oficiales de composición de alimentos. Nuestros productos son alimentos: no son medicamentos ni reemplazan una consulta médica. Si estás embarazada, das de lactar, tienes alguna enfermedad o tomas medicamentos, consulta a tu médico antes de consumir hierbas o superalimentos. Las fotos son referenciales.</p>
<h2>7. Reclamos</h2>
<p>Si algo salió mal, escríbenos ${contacto(d)} o usa nuestro <a href="/libro-de-reclamaciones">Libro de Reclamaciones</a>.</p>
<h2>8. Ley aplicable</h2>
<p>Estos términos se rigen por las leyes del Perú, en particular el Código de Protección y Defensa del Consumidor.</p>
</article>`;
  return layout({ origin, path: '/terminos', title: "Términos, envíos y devoluciones | Reyna's Superfoods", description: `Cómo comprar en ${d.rs}: precios, pagos, envíos a ${d.zona}, cambios y devoluciones.`, body, empresa: data.empresa });
}
