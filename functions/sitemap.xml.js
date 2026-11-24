import { loadData, sitemap } from './_lib/seo.js';
// sitemap.xml con todas las páginas: se arma solo con los productos activos del panel
export async function onRequestGet({ request }){
  const origin = new URL(request.url).origin;
  try { return sitemap({ origin, data: await loadData() }); }
  catch { return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }); }
}
