import { loadEmpresa } from './_lib/seo.js';
import { terminosPage } from './_lib/legal.js';
export async function onRequestGet({ request }){
  return terminosPage({ origin: new URL(request.url).origin, data: await loadEmpresa() });
}
