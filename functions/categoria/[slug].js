import { loadData, categoryPage, notFound } from '../_lib/seo.js';
export async function onRequestGet({ request, params }){
  const origin = new URL(request.url).origin;
  try { return categoryPage({ origin, data: await loadData(), slug: String(params.slug).toLowerCase() }); }
  catch { return notFound({ origin, data: null, path: new URL(request.url).pathname }); }
}
