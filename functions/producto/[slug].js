import { loadData, productPage, notFound } from '../_lib/seo.js';
export async function onRequestGet({ request, params }){
  const origin = new URL(request.url).origin;
  try { return productPage({ origin, data: await loadData(), slug: String(params.slug).toLowerCase().slice(0, 120) }); }
  catch { return notFound({ origin, data: null, path: new URL(request.url).pathname }); }
}
