import { loadEmpresa } from './_lib/seo.js';
import { libroPage } from './_lib/legal.js';
export async function onRequestGet({ request }){
  return libroPage({ origin: new URL(request.url).origin, data: await loadEmpresa() });
}
