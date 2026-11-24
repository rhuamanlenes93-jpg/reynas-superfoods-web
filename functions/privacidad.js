import { loadEmpresa } from './_lib/seo.js';
import { privacidadPage } from './_lib/legal.js';
export async function onRequestGet({ request }){
  return privacidadPage({ origin: new URL(request.url).origin, data: await loadEmpresa() });
}
