// Keep-alive de Supabase para Reyna's Superfoods.
// Va en un Worker de Cloudflare aparte (no en Pages), con un Cron Trigger diario.
// Hace una lectura pequeña a la API para que el plan gratis de Supabase
// no pause el proyecto por 7 días sin actividad.
// Solo usa la clave publicable (la misma de config.js). Nunca pongas aquí la service_role.

const SUPABASE_URL = 'https://cauphvgvqtcvmcsvbyry.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gpHao0azXWKB31UoQrRt-w_pFBnE3bY';

async function ping() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id&limit=1`, {
    headers: { apikey: SUPABASE_KEY },
  });
  const text = `Supabase respondió ${res.status} a las ${new Date().toISOString()}`;
  console.log(text);
  return text;
}

export default {
  // Lo ejecuta el Cron Trigger
  async scheduled(event, env, ctx) {
    ctx.waitUntil(ping());
  },
  // Abrir la URL del Worker en el navegador sirve para probarlo a mano
  async fetch() {
    return new Response(await ping(), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
  },
};
