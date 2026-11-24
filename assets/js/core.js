/* Reyna's Superfoods · core.js
   Utilidades compartidas y conexión con Supabase (REST, Auth y Storage). Se carga primero. */
const WA = window.REYNAS.whatsapp;
const V = window.REYNAS.version || '1';
const withV = url => `${url}?v=${V}`;
const photoUrl = key => withV(`/assets/products/${key}.webp`);
const $ = s => document.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const FINE = matchMedia('(hover: hover) and (pointer: fine)');
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

/* =========================================================
   SUPABASE (sin librerías: REST + Auth + Storage)
   ========================================================= */
const SB = window.REYNAS;
let session = null;
try { session = JSON.parse(sessionStorage.getItem('reynas.session')); } catch {}
function keepSession(s){
  session = { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600) };
  try { sessionStorage.setItem('reynas.session', JSON.stringify(session)); } catch {}
}
function dropSession(){ session = null; try { sessionStorage.removeItem('reynas.session'); } catch {} }
async function refreshSession(){
  if (!session || Date.now() / 1000 < session.expires_at - 60) return;
  const r = await fetch(SB.supabaseUrl + '/auth/v1/token?grant_type=refresh_token', { method:'POST', headers:{ apikey: SB.supabaseKey, 'Content-Type':'application/json' }, body: JSON.stringify({ refresh_token: session.refresh_token }) });
  if (!r.ok){ dropSession(); return; }
  try { keepSession(await r.json()); } catch { dropSession(); }
}
async function sb(path, o = {}){
  if (o.auth) await refreshSession();
  const h = { apikey: SB.supabaseKey, ...(o.headers || {}) };
  if (o.auth && session) h.Authorization = 'Bearer ' + session.access_token;
  if (o.body !== undefined && !o.raw) h['Content-Type'] = 'application/json';
  if (o.prefer) h.Prefer = o.prefer;
  const res = await fetch(SB.supabaseUrl + path, { method: o.method || 'GET', headers: h, body: o.body === undefined ? undefined : (o.raw ? o.body : JSON.stringify(o.body)), keepalive: !!o.keepalive });
  if (!res.ok){ let m = 'Error ' + res.status; try { const j = await res.json(); m = j.message || j.msg || j.error_description || j.error || m; } catch {} throw new Error(m); }
  const t = await res.text(); if (!t) return null;
  try { return JSON.parse(t); } catch { throw new Error('Respuesta no válida del servidor'); }
}
