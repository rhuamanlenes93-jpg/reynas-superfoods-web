const IMG = {"maca_main": {"src": "/assets/hero/maca_main.webp", "w": 484, "h": 396}, "maca_amar": {"src": "/assets/hero/maca_amar.webp", "w": 299, "h": 350}, "maca_negra_r": {"src": "/assets/hero/maca_negra_r.webp", "w": 278, "h": 248}, "maca_roja_h": {"src": "/assets/hero/maca_roja_h.webp", "w": 309, "h": 235}, "lucuma_main": {"src": "/assets/hero/lucuma_main.webp", "w": 519, "h": 387}, "lucuma_half": {"src": "/assets/hero/lucuma_half.webp", "w": 232, "h": 234}, "lucuma_whole": {"src": "/assets/hero/lucuma_whole.webp", "w": 211, "h": 248}, "lucuma_pow": {"src": "/assets/hero/lucuma_pow.webp", "w": 292, "h": 216}, "maiz_main": {"src": "/assets/hero/maiz_main.webp", "w": 514, "h": 349}, "maiz_cob": {"src": "/assets/hero/maiz_cob.webp", "w": 381, "h": 215}, "maiz_pow": {"src": "/assets/hero/maiz_pow.webp", "w": 326, "h": 266}, "camu_main": {"src": "/assets/hero/camu_main.webp", "w": 547, "h": 365}, "camu_ber": {"src": "/assets/hero/camu_ber.webp", "w": 244, "h": 237}, "camu_bowl": {"src": "/assets/hero/camu_bowl.webp", "w": 382, "h": 293}, "camu_x_ber": {"src": "/assets/hero/camu_x_ber.webp", "w": 152, "h": 212}};
const PHOTOS = {"feat_maca": "/assets/products/feat_maca.webp", "h_7_semillas": "/assets/products/h_7_semillas.webp", "h_acelga": "/assets/products/h_acelga.webp", "h_achiote": "/assets/products/h_achiote.webp", "h_aguaje": "/assets/products/h_aguaje.webp", "h_ajos": "/assets/products/h_ajos.webp", "h_alcachofa": "/assets/products/h_alcachofa.webp", "h_alfalfa": "/assets/products/h_alfalfa.webp", "h_algarrobo": "/assets/products/h_algarrobo.webp", "h_algas": "/assets/products/h_algas.webp", "h_almendras": "/assets/products/h_almendras.webp", "h_arracacha": "/assets/products/h_arracacha.webp", "h_arroz": "/assets/products/h_arroz.webp", "h_arveja": "/assets/products/h_arveja.webp", "h_avena": "/assets/products/h_avena.webp", "h_beterraga": "/assets/products/h_beterraga.webp", "h_cacao": "/assets/products/h_cacao.webp", "h_camote": "/assets/products/h_camote.webp", "h_camu_camu": "/assets/products/h_camu_camu.webp", "h_canihua": "/assets/products/h_canihua.webp", "h_cebada": "/assets/products/h_cebada.webp", "h_cebolla": "/assets/products/h_cebolla.webp", "h_cedron": "/assets/products/h_cedron.webp", "h_chancapiedra": "/assets/products/h_chancapiedra.webp", "h_chia": "/assets/products/h_chia.webp", "h_clavo_de_olor": "/assets/products/h_clavo_de_olor.webp", "h_curcuma": "/assets/products/h_curcuma.webp", "h_espirulina": "/assets/products/h_espirulina.webp", "h_eucalipto": "/assets/products/h_eucalipto.webp", "h_fenogreco": "/assets/products/h_fenogreco.webp", "h_garbanzo": "/assets/products/h_garbanzo.webp", "h_habas": "/assets/products/h_habas.webp", "h_habas_tostadas": "/assets/products/h_habas_tostadas.webp", "h_higo": "/assets/products/h_higo.webp", "h_huanarpo": "/assets/products/h_huanarpo.webp", "h_kion": "/assets/products/h_kion.webp", "h_kiwicha": "/assets/products/h_kiwicha.webp", "h_linaza": "/assets/products/h_linaza.webp", "h_lucuma": "/assets/products/h_lucuma.webp", "h_maca_amarilla": "/assets/products/h_maca_amarilla.webp", "h_maca_comercial": "/assets/products/h_maca_comercial.webp", "h_maca_negra": "/assets/products/h_maca_negra.webp", "h_maca_roja": "/assets/products/h_maca_roja.webp", "h_maiz_amarillo": "/assets/products/h_maiz_amarillo.webp", "h_maiz_morado": "/assets/products/h_maiz_morado.webp", "h_mango": "/assets/products/h_mango.webp", "h_mani_granulado": "/assets/products/h_mani_granulado.webp", "h_mashua_amarilla": "/assets/products/h_mashua_amarilla.webp", "h_muna": "/assets/products/h_muna.webp", "h_noni": "/assets/products/h_noni.webp", "h_nopal": "/assets/products/h_nopal.webp", "h_oregano": "/assets/products/h_oregano.webp", "h_paico": "/assets/products/h_paico.webp", "h_pasuchaca": "/assets/products/h_pasuchaca.webp", "h_platano": "/assets/products/h_platano.webp", "h_quinua": "/assets/products/h_quinua.webp", "h_quinua_negra": "/assets/products/h_quinua_negra.webp", "h_romero": "/assets/products/h_romero.webp", "h_sauco": "/assets/products/h_sauco.webp", "h_sen": "/assets/products/h_sen.webp", "h_soja": "/assets/products/h_soja.webp", "h_stevia": "/assets/products/h_stevia.webp", "h_tarwi_desamargado": "/assets/products/h_tarwi_desamargado.webp", "h_te_negro": "/assets/products/h_te_negro.webp", "h_te_rojo": "/assets/products/h_te_rojo.webp", "h_te_verde": "/assets/products/h_te_verde.webp", "h_tomillo": "/assets/products/h_tomillo.webp", "h_toronjil": "/assets/products/h_toronjil.webp", "h_yuca": "/assets/products/h_yuca.webp", "h_zanahoria": "/assets/products/h_zanahoria.webp", "p_antioxidante": "/assets/products/p_antioxidante.webp", "p_desayuno": "/assets/products/p_desayuno.webp", "p_energia": "/assets/products/p_energia.webp", "p_reposteria": "/assets/products/p_reposteria.webp", "x_acai": "/assets/products/x_acai.webp", "x_arandano_azul": "/assets/products/x_arandano_azul.webp", "x_arandano_rojo": "/assets/products/x_arandano_rojo.webp", "x_camu_camu": "/assets/products/x_camu_camu.webp", "x_fresa": "/assets/products/x_fresa.webp", "x_granada": "/assets/products/x_granada.webp", "x_maracuya": "/assets/products/x_maracuya.webp", "x_pitahaya": "/assets/products/x_pitahaya.webp", "x_uva": "/assets/products/x_uva.webp"};
const WA = window.REYNAS.whatsapp;
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
  if (r.ok) keepSession(await r.json()); else dropSession();
}
async function sb(path, o = {}){
  if (o.auth) await refreshSession();
  const h = { apikey: SB.supabaseKey, ...(o.headers || {}) };
  if (o.auth && session) h.Authorization = 'Bearer ' + session.access_token;
  if (o.body !== undefined && !o.raw) h['Content-Type'] = 'application/json';
  if (o.prefer) h.Prefer = o.prefer;
  const res = await fetch(SB.supabaseUrl + path, { method: o.method || 'GET', headers: h, body: o.body === undefined ? undefined : (o.raw ? o.body : JSON.stringify(o.body)), keepalive: !!o.keepalive });
  if (!res.ok){ let m = 'Error ' + res.status; try { const j = await res.json(); m = j.message || j.msg || j.error_description || j.error || m; } catch {} throw new Error(m); }
  const t = await res.text(); return t ? JSON.parse(t) : null;
}

/* =========================================================
   PORTADA (sin cambios respecto de la v6)
   ========================================================= */
const SLIDES = [
  { word:'Maca', bg:'#D39F78', search:'maca', main:'maca_main',
    pieces:[['maca_amar',355,150,160,0,0,'fruit'],['maca_negra_r',1035,220,170,-8,0,'fruit'],['maca_roja_h',245,470,185,-8,0,'fruit'],['maca_amar',1215,440,165,14,1,'fruit'],['maca_roja_h',1040,605,165,20,1,'fruit'],['maca_amar',-30,600,300,0,0,'corner'],['maca_negra_r',1250,25,245,0,0,'corner']]},
  { word:'Lúcuma', bg:'#EDC27A', search:'lúcuma', main:'lucuma_main',
    pieces:[['lucuma_whole',360,140,150,-12,0,'fruit'],['lucuma_half',1035,215,170,10,0,'fruit'],['lucuma_pow',230,480,200,0,0,'fruit'],['lucuma_half',1215,430,170,-20,1,'fruit'],['lucuma_whole',1050,600,150,16,1,'fruit'],['lucuma_half',-20,590,290,0,0,'corner'],['lucuma_whole',1260,20,230,20,0,'corner']]},
  { word:'Maíz morado', bg:'#B79DD4', search:'maíz morado', main:'maiz_main',
    pieces:[['maiz_pow',350,150,170,0,0,'fruit'],['maiz_cob',1030,225,190,-12,0,'fruit'],['maiz_cob',220,480,210,18,1,'fruit'],['maiz_pow',1215,440,175,0,1,'fruit'],['maiz_cob',1045,610,180,-6,0,'fruit'],['maiz_pow',-30,595,300,0,0,'corner'],['maiz_cob',1240,30,260,25,0,'corner']]},
  { word:'Camu camu', bg:'#EDA0B2', search:'camu camu', main:'camu_main',
    pieces:[['camu_x_ber',370,135,130,-10,0,'fruit'],['camu_ber',1035,215,170,8,0,'fruit'],['camu_bowl',220,480,200,-6,0,'fruit'],['camu_x_ber',1225,425,145,15,1,'fruit'],['camu_ber',1045,605,165,-14,1,'fruit'],['camu_ber',-30,590,300,0,0,'corner'],['camu_x_ber',1270,15,210,20,0,'corner']]},
];
const MAIN_W = 520, MAIN_BOTTOM = 768;
const SHADOWS = [[340,662,190,26],[720,758,430,38],[1300,632,170,24],[1120,780,160,22]];
const LAYERS = ['word','shadow','bottle','fruit','corner'];
const FACT = {word:.40, shadow:.30, bottle:.15, fruit:.55, corner:.75};

const hero = $('#inicio'), stage = $('#stage'), tabsEl = $('#tabs'), bar = $('#bar');
const U = v => `calc(${v} * var(--u))`;
const rand = (a,b) => a + Math.random()*(b-a);
let lastTouch = 0;
const touch = () => { lastTouch = Date.now(); };

const pieceEls = [];
const slides = SLIDES.map((s,i) => {
  const sec = document.createElement('div');
  sec.className = 'slide'; sec.style.background = s.bg;
  sec.setAttribute('role','group'); sec.setAttribute('aria-label', s.word);
  const frame = document.createElement('div'); frame.className = 'frame';
  const L = {};
  LAYERS.forEach(n => { const d = document.createElement('div'); d.className = 'layer L-' + n; frame.appendChild(d); L[n] = d; });
  const w = document.createElement('div'); w.className = 'word'; w.textContent = s.word; L.word.appendChild(w);
  SHADOWS.forEach(([cx,cy,sw,sh]) => { const d = document.createElement('div'); d.className = 'fshadow';
    Object.assign(d.style,{left:U(cx-sw/2),top:U(cy-sh/2),width:U(sw),height:U(sh)}); L.shadow.appendChild(d); });
  const m = IMG[s.main], mh = MAIN_W * m.h / m.w;
  const main = document.createElement('div'); main.className = 'mainimg';
  main.setAttribute('role','img'); main.setAttribute('aria-label', 'Harina de ' + s.word.toLowerCase());
  Object.assign(main.style,{left:U(720-MAIN_W/2),top:U(MAIN_BOTTOM-mh),width:U(MAIN_W),height:U(mh),backgroundImage:`url(${m.src})`});
  L.bottle.appendChild(main);
  s.pieces.forEach(([k,x,y,pw,r,mir,layer]) => {
    const a = IMG[k], ph = pw * a.h / a.w;
    const o = document.createElement('div'); o.className = 'piece' + (mir ? ' m' : '');
    o._g = {x, y, pw, ph, layer}; pieceEls.push(o);
    const inner = document.createElement('i');
    inner.style.backgroundImage = `url(${a.src})`;
    inner.style.setProperty('--r', r + 'deg');
    inner.style.setProperty('--d', rand(3.2,5).toFixed(2) + 's');
    inner.style.setProperty('--dl', (-rand(0,4)).toFixed(2) + 's');
    o.appendChild(inner); L[layer].appendChild(o);
  });
  sec.appendChild(frame); stage.appendChild(sec);
  const b = document.createElement('button'); b.type = 'button'; b.textContent = s.word;
  b.addEventListener('click', () => { touch(); if (i !== cur) go(i, i > cur ? 1 : -1); });
  tabsEl.appendChild(b);
  return { sec, L, word:w, tab:b, data:s, idx:i };
});

let u = 1, mobile = false;
const ctx = document.createElement('canvas').getContext('2d');
function inkAt100(t){ ctx.font = '700 100px Poppins'; const m = ctx.measureText(t); return (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || m.width; }
function layout(){
  const W = hero.clientWidth, H = hero.clientHeight;
  mobile = W <= 820 || H > W;
  u = mobile ? Math.min(W/640, (H-200)/620) : Math.min(W/1440, H/900);
  hero.style.setProperty('--u', u + 'px');
  hero.style.setProperty('--fy', mobile ? '8px' : '0px');
  const visible = Math.min(1440, W/u) * 0.92;
  pieceEls.forEach(o => {
    const g = o._g, k = mobile && g.layer === 'fruit' ? 0.82 : 1, pull = mobile && g.layer === 'fruit' ? 0.6 : 1;
    const w = g.pw * k, h = g.ph * k, cx = 720 + (g.x + g.pw/2 - 720) * pull, cy = g.y + g.ph/2;
    Object.assign(o.style,{left:U(cx - w/2),top:U(cy - h/2),width:U(w),height:U(h)});
  });
  slides.forEach(s => {
    const ink = inkAt100(s.data.word);
    let F = 445, ls = 0.005;
    const limit = mobile ? visible : 1330, fit = mobile ? visible : 1400;
    if (ink * 4.45 > limit){ ls = -0.035; F = Math.min(445, fit * 100 / ink); }
    const base = 403.5 + 0.698 * F / 2;
    Object.assign(s.word.style,{fontSize:U(F),letterSpacing:ls+'em',top:U(base - 0.85*F)});
  });
  moveBar(true);
}
addEventListener('resize', layout);

function moveBar(instant){
  const t = slides[cur].tab;
  if (instant) bar.style.transition = 'none';
  bar.style.width = t.offsetWidth + 'px';
  bar.style.transform = `translateX(${t.offsetLeft}px)`;
  if (instant){ bar.offsetWidth; bar.style.transition = ''; }
  slides.forEach((s,i) => s.tab.setAttribute('aria-current', i === cur ? 'true' : 'false'));
  hero.style.backgroundColor = slides[cur].data.bg;
}

const CT = [0,.031,.134,.206,.278,.34,.412,.485,.546,.583,.62,.69,.79,.85,.93,1];
const CC = [0,.006,.012,.023,.047,.07,.105,.158,.246,.55,.825,.9,.94,.956,.975,1];
function cover(t){
  if (t <= 0) return 0; if (t >= 1) return 1;
  let i = 1; while (CT[i] < t) i++;
  const k = (t - CT[i-1]) / (CT[i] - CT[i-1]), s = 3*k*k - 2*k*k*k;
  return CC[i-1] + (CC[i] - CC[i-1]) * s;
}
let cur = 0, busy = false;
function setX(s, name, px){ s.L[name].style.transform = px ? `translate3d(${px}px,0,0)` : ''; }
function finish(a, b){
  [a,b].forEach(s => { s.sec.style.clipPath = ''; LAYERS.forEach(n => setX(s,n,0)); });
  slides.forEach((s,i) => { s.sec.classList.toggle('is-current', i === b.idx); s.sec.style.visibility = ''; s.sec.style.zIndex = ''; });
  busy = false;
}
function go(to, dir){
  if (busy || to === cur) return;
  const A = slides[cur], B = slides[to];
  cur = to; moveBar(false);
  if (RM.matches){ finish(A,B); return; }
  busy = true;
  B.sec.style.visibility = 'visible'; B.sec.style.zIndex = 1;
  A.sec.style.zIndex = 2;
  const FW = 1440 * u, t0 = performance.now();
  LAYERS.forEach(n => setX(B, n, dir * FACT[n] * FW));
  let done = false;
  const guard = setTimeout(() => { if (!done){ done = true; finish(A, B); } }, 1400);
  (function step(now){
    const t = (now - t0) / 970;
    const c = cover(t);
    A.sec.style.clipPath = dir > 0 ? `inset(0 ${c*100}% 0 0)` : `inset(0 0 0 ${c*100}%)`;
    LAYERS.forEach(n => setX(A, n, -dir * c * 0.14 * FW));
    let k = Math.min(1, Math.max(0, (t - .5) / .42)); k = 1 - (1-k)*(1-k);
    LAYERS.forEach(n => setX(B, n, dir * (1-k) * FACT[n] * FW));
    if (done) return;
    if (t < 1 || k < 1) requestAnimationFrame(step); else { done = true; clearTimeout(guard); finish(A, B); }
  })(t0);
}
const next = () => go((cur + 1) % slides.length, 1);
const prev = () => go((cur - 1 + slides.length) % slides.length, -1);

$('.hnext').addEventListener('click', () => { touch(); next(); });
$('.hprev').addEventListener('click', () => { touch(); prev(); });
let heroVisible = true;
new IntersectionObserver(([e]) => {
  heroVisible = e.intersectionRatio > 0.35;
  const show = e.intersectionRatio < 0.15;
  $('#topbar').classList.toggle('show', show);
  if (!show) setMega(false);
}, {threshold:[0, .15, .35, .6, 1]}).observe(hero);
const typing = () => /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
const overlayOpen = () => pdpId !== null || drawerOpen || isAdminOpen();
addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')){ e.preventDefault(); isAdminOpen() ? closeAdmin() : openAdmin(); return; }
  if (isAdminOpen()){ if (e.key === 'Escape'){ if (!aForm.hidden) aForm.hidden = true; else closeAdmin(); } return; }
  if (e.key === 'Escape'){
    if (drawerOpen) return closeDrawer();
    if (megaOpen) return setMega(false, true);
    if (pdpId !== null) return closePDP();
  }
  if (overlayOpen() || !heroVisible || typing()) return;
  if (e.key === 'ArrowRight'){ touch(); next(); }
  if (e.key === 'ArrowLeft'){ touch(); prev(); }
});
let px = null, py = 0;
stage.addEventListener('pointerdown', e => { px = e.clientX; py = e.clientY; });
addEventListener('pointerup', e => {
  if (px === null) return;
  const dx = e.clientX - px, dy = e.clientY - py; px = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){ touch(); dx < 0 ? next() : prev(); }
});
setInterval(() => {
  if (document.visibilityState === 'visible' && heroVisible && Date.now() - lastTouch > 6000 && !overlayOpen()) next();
}, 2600);
$('#cta').addEventListener('click', () => { q.value = slides[cur].data.search; activeCat = 'Todos'; shown = PAGE; renderShop(); });

function reveal(){
  layout();
  const ui = [...document.querySelectorAll('.rise')];
  const order = ['.hlogo','.htabs','.hacct','.hprev','.hcta','.hnext'].map(s => document.querySelector(s));
  if (RM.matches){ document.body.classList.remove('pre'); return; }
  const FW = 1440 * u, s0 = slides[0];
  LAYERS.forEach(n => s0.L[n].animate([{transform:`translateX(${FACT[n]*FW}px)`},{transform:'translateX(0)'}],{duration:900,easing:'cubic-bezier(0.22,0.8,0.3,1)'}));
  order.forEach((el,i) => {
    const an = el.animate([{opacity:0,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:1000,delay:250+i*80,easing:'cubic-bezier(0.22,0.8,0.3,1)',fill:'backwards'});
    an.onfinish = () => el.classList.remove('rise');
  });
  requestAnimationFrame(() => document.body.classList.remove('pre'));
  setTimeout(() => { document.body.classList.remove('pre'); ui.forEach(el => el.classList.remove('rise')); }, 3000);
}
slides[0].sec.classList.add('is-current');
layout();
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(reveal);

/* =========================================================
   DATOS  (demo: localStorage · producción: Supabase)
   ========================================================= */
const KEY_C = 'reynas.cart.v2';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
function load(k){ try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
function save(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
const G = {
  andinos:'Superalimentos andinos', granos:'Granos, semillas y menestras', raices:'Raíces, frutas y verduras',
  hierbas:'Hierbas e infusiones', extractos:'Extractos en polvo', packs:'Packs y combos'
};
const HARINA_GROUPS = [G.andinos, G.granos, G.raices, G.hierbas];
const BASE_GROUPS = [G.andinos, G.granos, G.raices, G.hierbas, G.extractos, G.packs];
const COLORS = { [G.andinos]:'#D39F78', [G.granos]:'#EBC46F', [G.raices]:'#EDA0B2', [G.hierbas]:'#9CC98A', [G.extractos]:'#B79DD4', [G.packs]:'#8FC9C2' };
const EXTRA = ['#E8B48C','#A9CFE0','#D8C27A','#C9A6D8'];
const colorOf = g => COLORS[g] || EXTRA[[...g].reduce((s,c) => s + c.charCodeAt(0), 0) % EXTRA.length];
const USES = {
  [G.andinos]:'Ideal para batidos, recetas, yogures y panadería.',
  [G.granos]:'Ideal para panes, galletas, papillas, batidos y recetas caseras.',
  [G.raices]:'Ideal para sopas, cremas, masas, postres y batidos.',
  [G.hierbas]:'Ideal para infusiones, aderezos y mezclas naturales.',
  [G.extractos]:'Ideal para jugos, smoothies, helados y repostería.'
};
let products = [], showPrices = false, catalogLoaded = false;
let cart = load(KEY_C) || {};
const saveC = () => save(KEY_C, cart);
// fila de Supabase -> producto de la tienda (el precio solo se muestra si está activado en el panel)
function fromRow(r, adminView){
  return { id: r.id, name: r.name, group: r.category, img: r.image_url || '', size: r.unit || '',
    price: (adminView || (showPrices && r.show_price !== false)) && r.price != null ? String(Number(r.price)) : '',
    showPrice: r.show_price !== false,
    desc: r.description || '', hidden: !r.active, example: !!r.is_example };
}
async function loadCatalog(){
  const [rows, st] = await Promise.all([
    sb('/rest/v1/products?select=*&active=is.true&order=sort.asc,name.asc'),
    sb('/rest/v1/settings?select=key,value')
  ]);
  showPrices = !!(st.find(s => s.key === 'show_prices') || {}).value;
  products = rows.map(r => fromRow(r));
  catalogLoaded = true;
  Object.keys(cart).forEach(id => { if (!products.some(p => p.id === id)) delete cart[id]; });
  saveC();
}
const groups = () => [...new Set([...BASE_GROUPS, ...products.map(p => p.group)])];
const lc = n => n.charAt(0).toLowerCase() + n.slice(1);
function fullName(p){
  if (HARINA_GROUPS.includes(p.group)) return 'Harina de ' + lc(p.name);
  if (p.group === G.extractos) return 'Extracto en polvo de ' + lc(p.name);
  return p.name;
}
const money = v => v === '' || v == null ? '' : 'S/ ' + Number(v).toFixed(2);
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F4EFE2"/><text x="200" y="160" font-family="Poppins,sans-serif" font-size="22" fill="#9A9F94" text-anchor="middle">Foto por subir</text></svg>');
const imgSrc = p => !p.img ? PLACEHOLDER : /^(data:|https?:|\/)/.test(p.img) ? p.img : (PHOTOS[p.img] || PLACEHOLDER);
const byId = id => products.find(p => p.id === id);
const visible = () => products.filter(p => !p.hidden);
const priceHTML = p => `<span class="pr${p.price === '' ? ' tbd' : ''}">${p.price === '' ? 'Precio por confirmar' : money(p.price)}</span>`;

/* =========================================================
   ANIMACIONES 3D
   ========================================================= */
/* =========================================================
   TEXTOS EDITABLES desde el panel (tabla site_texts)
   Cada elemento con data-edit="clave" guarda su texto original
   y se reemplaza por el que la dueña escriba en el panel.
   ========================================================= */
document.querySelectorAll('[data-edit]').forEach(el => { el.dataset.def = el.textContent.trim(); });
let siteTexts = {};
const TXT_GROUPS = { hero:'Portada', cinta1:'Cinta de arriba', tienda:'Tienda', packs:'Packs y combos', dest:'Producto destacado', val:'Valores', mv:'Misión y visión', may:'Venta por mayor', pasos:'Cómo comprar', pedido:'Mi pedido', cinta2:'Cinta de abajo', pie:'Pie de página' };
const TXT_NAMES = { boton:'Botón', etiqueta:'Texto pequeño sobre el título', titulo:'Título', texto:'Texto', extra:'Frase', palabra:'Palabra grande de fondo', nota:'Nota debajo del botón', ideal_t:'“Ideal para” (título)', ideal:'“Ideal para” (texto)', mision_t:'Título de la misión', mision:'Misión', vision_t:'Título de la visión', vision:'Visión', lugar:'Ubicación', derechos:'Derechos' };
const TXT_ITEM = { val:'Valor', pasos:'Paso', dest:'Beneficio' };
function txtLabel(key){
  const [g, s] = key.split('.');
  if (TXT_NAMES[s]) return TXT_NAMES[s];
  let m = s.match(/^b?(\d+)_t$/); if (m) return `${TXT_ITEM[g] || 'Elemento'} ${m[1]}: título`;
  m = s.match(/^b?(\d+)$/); if (m) return g.startsWith('cinta') ? `Frase ${m[1]}` : `${TXT_ITEM[g] || 'Elemento'} ${m[1]}: texto`;
  return s;
}
function setTxt(el, value){
  if (el.classList.contains('h2')) splitH2(el, value); else el.textContent = value;
}
function applyTexts(){
  document.querySelectorAll('[data-edit]').forEach(el => {
    const v = siteTexts[el.dataset.edit] ?? el.dataset.def;
    const cur = el.classList.contains('h2') ? el.getAttribute('aria-label') : el.textContent.trim();
    if (v !== cur) setTxt(el, v);
  });
}
async function loadTexts(){
  try { (await sb('/rest/v1/site_texts?select=key,value')).forEach(r => { siteTexts[r.key] = r.value; }); applyTexts(); }
  catch { /* si falla se quedan los textos originales */ }
}

// títulos: cada letra sube girando; la última palabra se subraya
function splitH2(h, text){
  text = text.trim(); const words = text.split(/\s+/);
  h.setAttribute('aria-label', text);
  let k = 0;
  h.innerHTML = words.map((w, wi) => {
    const chars = [...w].map(c => `<span class="ch" style="--k:${k++}">${esc(c)}</span>`).join('');
    return `<span class="w${wi === words.length - 1 ? ' mk' : ''}" style="--n:${k}" aria-hidden="true">${chars}</span>`;
  }).join(' ');
}
document.querySelectorAll('.h2').forEach(h => splitH2(h, h.textContent));
loadTexts();

// cintas de texto: se mueven solas y aceleran (y cambian de sentido) con el scroll
const marquees = [...document.querySelectorAll('.marquee')].map(m => {
  const t = m.querySelector('.mq-track'); t.innerHTML += t.innerHTML;
  return { m, t, x: 0, base: Number(m.dataset.speed) || .5 };
});
let lastY = scrollY, vel = 0, dirSign = 1;
addEventListener('scroll', () => { const d = scrollY - lastY; lastY = scrollY; if (d) dirSign = d > 0 ? 1 : -1; vel = Math.min(18, vel + Math.abs(d) * .08); }, {passive:true});
(function mqLoop(){
  if (!RM.matches){
    vel *= .92;
    marquees.forEach(o => {
      const r = o.m.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const half = o.t.scrollWidth / 2;
      o.x -= (o.base + Math.sign(o.base) * vel * .5) * dirSign;
      if (o.x <= -half) o.x += half; if (o.x > 0) o.x -= half;
      o.t.style.transform = `translate3d(${o.x}px,0,0)`;
    });
  }
  requestAnimationFrame(mqLoop);
})();
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -6% 0px'});
const hotIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('hot', e.isIntersecting && !FINE.matches)), {rootMargin:'-38% 0px -38% 0px'});
const watch = root => {
  root.querySelectorAll('.rv,.h2,.card:not(.in)').forEach(el => io.observe(el));
  root.querySelectorAll('#grid .card,#pgrid .card,#relGrid .card').forEach(el => hotIO.observe(el));
};
watch(document);

// tarjetas que se inclinan siguiendo el puntero
let tiltEl = null, tiltRaf = 0;
function setTilt(el, x, y){ el.style.setProperty('--px', x.toFixed(3)); el.style.setProperty('--py', y.toFixed(3)); }
document.addEventListener('pointermove', e => {
  if (!FINE.matches || RM.matches) return;
  const el = e.target.closest('.card');
  if (tiltEl && tiltEl !== el){ tiltEl.classList.remove('tilting'); setTilt(tiltEl, 0, 0); tiltEl = null; }
  if (!el) return;
  tiltEl = el; el.classList.add('tilting');
  cancelAnimationFrame(tiltRaf);
  tiltRaf = requestAnimationFrame(() => {
    const r = el.getBoundingClientRect();
    setTilt(el, ((e.clientX - r.left) / r.width - .5) * 2, ((e.clientY - r.top) / r.height - .5) * 2);
  });
}, {passive:true});
document.addEventListener('pointerleave', () => { if (tiltEl){ tiltEl.classList.remove('tilting'); setTilt(tiltEl,0,0); tiltEl = null; } });

// escenas que giran con el mouse (destacado y ficha)
function scene3d(area, target){
  area.addEventListener('pointermove', e => {
    if (!FINE.matches || RM.matches) return;
    const r = area.getBoundingClientRect();
    (target || area).style.setProperty('--fx', (((e.clientX - r.left) / r.width - .5) * 2).toFixed(3));
    (target || area).style.setProperty('--fy', (((e.clientY - r.top) / r.height - .5) * 2).toFixed(3));
    (target || area).style.setProperty('--px', (((e.clientX - r.left) / r.width - .5) * 2).toFixed(3));
    (target || area).style.setProperty('--py', (((e.clientY - r.top) / r.height - .5) * 2).toFixed(3));
  });
  area.addEventListener('pointerleave', () => ['--fx','--fy','--px','--py'].forEach(v => (target || area).style.setProperty(v, 0)));
}
scene3d($('#destacado'));
scene3d($('#pdpVis'));

// la foto vuela en arco hasta el carrito
function cartTarget(){
  if (pdpId !== null) return $('#pdpCart');
  if ($('#topbar').classList.contains('show')) return $('#topbar .cartpill');
  return $('.hacct [data-cart]');
}
function fly(fromImg){
  const to = cartTarget();
  if (RM.matches || !fromImg || !to) { to && bumpCart(to); return; }
  const a = fromImg.getBoundingClientRect(), b = to.getBoundingClientRect();
  if (!a.width) return bumpCart(to);
  const f = document.createElement('img'); f.className = 'flyer'; f.src = fromImg.src; f.alt = '';
  const w = Math.min(a.width, 160), h = w * .75;
  Object.assign(f.style, { left: (a.left + a.width/2 - w/2) + 'px', top: (a.top + a.height/2 - h/2) + 'px', width: w + 'px', height: h + 'px' });
  document.body.appendChild(f);
  const dx = (b.left + b.width/2) - (a.left + a.width/2), dy = (b.top + b.height/2) - (a.top + a.height/2);
  f.animate([
    { transform:'perspective(600px) translate(0,0) rotateY(0) scale(1)', opacity:1 },
    { transform:`perspective(600px) translate(${dx*.45}px,${dy*.45 - 140}px) rotateY(200deg) rotateZ(-12deg) scale(.7)`, opacity:1, offset:.55 },
    { transform:`perspective(600px) translate(${dx}px,${dy}px) rotateY(360deg) scale(.15)`, opacity:.3 }
  ], { duration: 850, easing: 'cubic-bezier(.45,0,.2,1)' }).onfinish = () => { f.remove(); bumpCart(to); };
}
function bumpCart(el){ el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

/* =========================================================
   MEGA MENÚ
   ========================================================= */
const mega = $('#mega'), megaBtn = $('#megaBtn'), burger = $('#burger');
let megaOpen = false, megaT;
function renderMega(){
  const vis = visible();
  const cols = groups().filter(g => g !== G.packs && vis.some(p => p.group === g)).map((g,i) => {
    const list = vis.filter(p => p.group === g);
    return `<div class="mcol" style="--c:${colorOf(g)};--i:${i}">
      <h3><button type="button" data-mcat="${esc(g)}">${esc(g)}</button></h3>
      <ul>${list.slice(0,6).map(p => `<li><button type="button" data-open="${p.id}"><img src="${imgSrc(p)}" alt="">${esc(p.name)}</button></li>`).join('')}</ul>
      <button class="all" type="button" data-mcat="${esc(g)}">Ver los ${list.length}</button></div>`;
  }).join('');
  const pk = vis.find(p => p.group === G.packs);
  const feat = pk ? `<button class="mfeat mcol" id="mPrev" style="--i:6;text-align:left" type="button" data-mpacks><img id="mpImg" src="${imgSrc(pk)}" alt=""><div><span class="mp-k" id="mpK">Packs y combos</span><b id="mpName">${esc(pk.name)}</b><span id="mpSub">y más combinaciones listas.</span></div></button>` : '';
  $('#megaIn').innerHTML = cols + feat;
}
function setMega(open, focusBtn){
  if (open === megaOpen) return;
  megaOpen = open; mega.classList.toggle('open', open);
  megaBtn.setAttribute('aria-expanded', open); burger.setAttribute('aria-expanded', open);
  if (open){ mpId = null; renderMega(); }
  if (!open && focusBtn) (getComputedStyle(burger).display !== 'none' ? burger : megaBtn).focus();
}
megaBtn.addEventListener('click', () => setMega(FINE.matches ? true : !megaOpen));
burger.addEventListener('click', () => setMega(!megaOpen));
[megaBtn, mega].forEach(el => {
  el.addEventListener('mouseenter', () => { if (!FINE.matches) return; clearTimeout(megaT); megaT = setTimeout(() => setMega(true), 90); });
  el.addEventListener('mouseleave', () => { if (!FINE.matches) return; clearTimeout(megaT); megaT = setTimeout(() => setMega(false), 220); });
});
mega.addEventListener('click', e => {
  const c = e.target.closest('[data-mcat]'), pk = e.target.closest('[data-mpacks]');
  if (c){ activeCat = c.dataset.mcat; q.value = ''; shown = PAGE; renderShop(); setMega(false); $('#tienda').scrollIntoView(); }
  if (pk){ setMega(false); $('#packs').scrollIntoView(); }
  if (e.target.closest('[data-open]')) setMega(false);
});
document.addEventListener('click', e => { if (megaOpen && !e.target.closest('#mega,#megaBtn,#burger')) setMega(false); });
// al pasar el puntero por un producto del menú, se muestra su foto grande a la derecha
let mpId = null;
function megaPreview(btn){
  const id = btn.dataset.open, p = byId(id), prevBox = $('#mPrev');
  if (!p || !prevBox || id === mpId) return;
  mpId = id;
  mega.querySelectorAll('li button.on').forEach(b => b.classList.remove('on')); btn.classList.add('on');
  const img = $('#mpImg');
  img.src = imgSrc(p);
  $('#mpK').textContent = p.group; $('#mpName').textContent = fullName(p);
  $('#mpSub').textContent = p.price !== '' ? money(p.price) : 'Toca para ver el producto';
  prevBox.dataset.open = id; prevBox.removeAttribute('data-mpacks');
  prevBox.style.background = `color-mix(in srgb, ${colorOf(p.group)} 45%, #fff)`;
  if (!RM.matches) img.animate([{opacity:0, transform:'perspective(700px) rotateY(-28deg) scale(.94)'},{opacity:1, transform:'none'}], {duration:420, easing:'cubic-bezier(.22,.8,.3,1)'});
}
mega.addEventListener('pointerover', e => { const b = e.target.closest('.mcol li [data-open]'); if (b) megaPreview(b); });
mega.addEventListener('focusin', e => { const b = e.target.closest('.mcol li [data-open]'); if (b) megaPreview(b); });

/* =========================================================
   TIENDA + BREADCRUMBS
   ========================================================= */
const grid = $('#grid'), cats = $('#cats'), q = $('#q'), moreBtn = $('#more');
const PAGE = 16;
let activeCat = 'Todos', shown = PAGE;

function controlFor(p){
  const n = cart[p.id] || 0;
  if (!n) return `<button class="add" type="button" data-add="${p.id}">Agregar</button>`;
  return `<span class="step" role="group" aria-label="Cantidad de ${esc(fullName(p))}"><button type="button" data-dec="${p.id}" aria-label="Quitar uno">−</button><output>${n}</output><button type="button" data-inc="${p.id}" aria-label="Agregar uno">+</button></span>`;
}
function cardHTML(p, i){
  return `<article class="card" style="--c:${colorOf(p.group)};--i:${i % 8}">
    <button class="ph" type="button" data-open="${p.id}" aria-label="Ver ${esc(fullName(p))}"><img src="${imgSrc(p)}" alt="" loading="lazy" decoding="async"><span class="qv" aria-hidden="true">Ver producto<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button>
    <div class="bd">
      <span class="chip">${esc(p.group)}</span>
      <h3><button type="button" data-open="${p.id}">${esc(fullName(p))}</button></h3>
      <span class="mt">${p.size ? esc(p.size) : 'Presentación por confirmar'}</span>
      <div class="ft">${priceHTML(p)}<span data-ctl="${p.id}">${controlFor(p)}</span></div>
    </div></article>`;
}
function crumbsHTML(items){
  return '<ol>' + items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(it.label)}</span></li>`
    : `<li>${it.href ? `<a href="${it.href}">${esc(it.label)}</a>` : `<button type="button" data-crumb="${esc(it.cat || '')}">${esc(it.label)}</button>`}</li>`).join('') + '</ol>';
}
function renderShopCrumbs(){
  const term = q.value.trim(), items = [{label:'Inicio', href:'#inicio'}, {label:'Tienda', cat:'Todos'}];
  if (activeCat !== 'Todos') items.push({label: activeCat, cat: activeCat});
  if (term) items.push({label: `Búsqueda: “${term}”`});
  $('#shopCrumbs').innerHTML = crumbsHTML(items.length === 2 ? [items[0], {label:'Tienda'}] : items);
}
function renderCats(){
  const vis = visible().filter(p => p.group !== G.packs);
  const list = ['Todos', ...groups().filter(g => g !== G.packs && vis.some(p => p.group === g))];
  if (!list.includes(activeCat)) activeCat = 'Todos';
  cats.innerHTML = list.map(g => {
    const c = g === 'Todos' ? vis.length : vis.filter(p => p.group === g).length;
    return `<button class="cat" type="button" style="--c:${g === 'Todos' ? 'var(--green)' : colorOf(g)}" data-cat="${esc(g)}" aria-pressed="${g === activeCat}">${esc(g)}<small>${c}</small></button>`;
  }).join('');
}
function renderShop(){
  renderCats(); renderShopCrumbs();
  const term = norm(q.value.trim());
  const list = visible().filter(p => p.group !== G.packs && (activeCat === 'Todos' || p.group === activeCat) && (!term || norm(fullName(p) + ' ' + p.desc).includes(term)));
  grid.innerHTML = list.slice(0, shown).map(cardHTML).join('');
  watch(grid);
  $('#none').hidden = !!list.length || !catalogLoaded;
  $('#askLink').href = waLink(`Hola Reyna's Superfoods, ¿tienen ${q.value.trim() || 'este producto'}?`);
  moreBtn.parentElement.hidden = list.length <= shown;
  moreBtn.textContent = `Ver más productos (${list.length - shown})`;
}
cats.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; activeCat = b.dataset.cat; shown = PAGE; renderShop(); });
$('#shopCrumbs').addEventListener('click', e => { const b = e.target.closest('[data-crumb]'); if (!b) return; activeCat = b.dataset.crumb || 'Todos'; if (activeCat === 'Todos') q.value = ''; shown = PAGE; renderShop(); });
q.addEventListener('input', () => { shown = PAGE; renderShop(); });
moreBtn.addEventListener('click', () => {
  const from = shown; shown += PAGE; renderShop();
  grid.querySelectorAll('.card').forEach((c, i) => { if (i < from) c.classList.add('in'); });
});

function renderPacks(){
  const list = visible().filter(p => p.group === G.packs);
  $('#packs').hidden = !list.length;
  $('#pgrid').innerHTML = list.map((p, i) => `
    <article class="card pack" style="--c:${colorOf(G.packs)};--i:${i}">
      <div class="inner">
        <button class="ph" type="button" data-open="${p.id}" aria-label="Ver ${esc(p.name)}"><img src="${imgSrc(p)}" alt="" loading="lazy" decoding="async">${p.example ? '<span class="ptag">Ejemplo</span>' : ''}<span class="qv" aria-hidden="true">Ver pack<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button>
        <div class="bd">
          <h3><button type="button" data-open="${p.id}">${esc(p.name)}</button></h3>
          <p>${esc(p.desc)}</p>
          ${p.size ? `<p>${esc(p.size)}</p>` : ''}
          <div class="ft">${priceHTML(p)}<span data-ctl="${p.id}">${controlFor(p)}</span></div>
        </div>
      </div>
    </article>`).join('');
  watch($('#pgrid'));
}

/* =========================================================
   CARRITO (cantidades, aviso, drawer)
   ========================================================= */
let toastT;
function toast(msg){
  $('#toastT').textContent = msg; $('#toast').classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => $('#toast').classList.remove('show'), 2600);
}
function setQty(id, n, opts = {}){
  const p = byId(id); if (!p) return;
  const before = cart[id] || 0;
  if (n <= 0) delete cart[id]; else cart[id] = Math.min(n, 999);
  saveC();
  document.querySelectorAll(`[data-ctl="${id}"]`).forEach(el => el.innerHTML = controlFor(p));
  renderOrder();
  if (n > before){
    fly(opts.img);
    if (!opts.silent) toast((before ? 'Sumaste otro: ' : 'Agregado: ') + fullName(p));
  }
}
const imgNear = el => el.closest('.card,.line,.pdp,.satc')?.querySelector('.ph img,.plate img,img');
document.addEventListener('click', e => {
  const a = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm]'); if (!a) return;
  const id = a.dataset.add || a.dataset.inc || a.dataset.dec || a.dataset.rm;
  const inDrawer = !!a.closest('.drawer,#lines');
  if (a.dataset.add) setQty(id, 1, { img: imgNear(a) });
  if (a.dataset.inc) setQty(id, (cart[id] || 0) + 1, { img: inDrawer ? null : imgNear(a), silent: inDrawer });
  if (a.dataset.dec) setQty(id, (cart[id] || 0) - 1);
  if (a.dataset.rm) setQty(id, 0);
});

const drawer = $('#drawer');
let drawerOpen = false, drawerFrom = null;
function lock(){ document.documentElement.classList.toggle('lock', drawerOpen || pdpId !== null); }
function openDrawer(){
  if (drawerOpen) return;
  drawerOpen = true; drawerFrom = document.activeElement; touch(); setMega(false);
  renderDrawer(true);
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); lock();
  setTimeout(() => drawer.querySelector('.x').focus({preventScroll:true}), 80);
}
function closeDrawer(){
  if (!drawerOpen) return;
  drawerOpen = false; drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); lock(); touch();
  drawerFrom && drawerFrom.focus && drawerFrom.focus({preventScroll:true});
}
document.addEventListener('click', e => { if (e.target.closest('[data-cart]')){ e.preventDefault(); openDrawer(); } });
drawer.querySelectorAll('[data-dclose]').forEach(b => b.addEventListener('click', closeDrawer));
$('#dgo').addEventListener('click', () => { closeDrawer(); if (pdpId !== null) closePDP(); setTimeout(() => $('#pedido').scrollIntoView(), 60); });

/* =========================================================
   FICHA DE PRODUCTO + STICKY ADD TO CART
   ========================================================= */
const pdp = $('#pdp'), satc = $('#satc');
let pdpId = null, pdpQty = 1, pdpPushed = false, pdpFrom = null;
function setPdpQty(n){ pdpQty = Math.max(1, Math.min(999, n)); $('#pdpQty').value = $('#satcQty').value = pdpQty; $('#pdpQty').textContent = $('#satcQty').textContent = pdpQty; }
function openPDP(id){
  const p = byId(id); if (!p || p.hidden) return;
  const first = pdpId === null;
  if (first) pdpFrom = document.activeElement;
  pdpId = id; setPdpQty(1); setMega(false);
  // si el producto sale en la portada, la ficha usa el mismo color de su slide
  const slideCol = SLIDES.find(sl => norm(p.name).startsWith(norm(sl.word)));
  const col = slideCol ? slideCol.bg : colorOf(p.group), name = fullName(p);
  pdp.style.setProperty('--c', col);
  $('#pdpVis').style.setProperty('--c', col);
  $('#pdpImg').src = $('#satcImg').src = imgSrc(p);
  $('#pdpImg').alt = name;
  $('#pdpWord').textContent = p.name.split(' ')[0];
  $('#pdpChip').textContent = p.group; $('#pdpChip').style.setProperty('--c', col);
  $('#pdpName').textContent = name; $('#satcName').textContent = name;
  $('#pdpPrice').innerHTML = priceHTML(p);
  $('#satcPrice').textContent = p.price === '' ? 'Precio por confirmar' : money(p.price);
  $('#pdpDesc').textContent = p.desc || `Producto de Reyna's Superfoods, listo para usar. ${USES[p.group] || ''}`.trim();
  $('#pdpFacts').innerHTML = [['Presentación', p.size || 'Por confirmar'], ['Precio', p.price === '' ? 'Por confirmar' : money(p.price)], ['Venta', 'Por mayor y menor'], ['Envíos', 'Lima y provincias']]
    .map(([k,v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('');
  const crumbs = [{label:'Inicio', href:'#inicio'}, {label:'Tienda', cat:'Todos'}];
  if (p.group !== G.packs) crumbs.push({label:p.group, cat:p.group}); else crumbs.push({label:'Packs y combos', href:'#packs'});
  crumbs.push({label:name});
  $('#pdpCrumbs').innerHTML = crumbsHTML(crumbs);
  const rel = visible().filter(x => x.group === p.group && x.id !== p.id).slice(0, 4);
  $('#related').hidden = !rel.length;
  $('#relGrid').innerHTML = rel.map(cardHTML).join('');
  watch($('#relGrid'));
  pdp.scrollTop = 0;
  satc.classList.remove('show');
  pdp.classList.add('open'); pdp.setAttribute('aria-hidden','false'); lock();
  if (first) setTimeout(() => $('#pdpBack').focus({preventScroll:true}), 80);
}
function closePDPUI(){
  if (pdpId === null) return;
  pdpId = null; pdp.classList.remove('open'); pdp.setAttribute('aria-hidden','true'); satc.classList.remove('show'); lock();
  pdpFrom && pdpFrom.focus && document.contains(pdpFrom) && pdpFrom.focus({preventScroll:true});
}
function closePDP(){
  if (pdpPushed && location.hash.startsWith('#producto/')){ pdpPushed = false; history.back(); return; }
  if (location.hash.startsWith('#producto/')) history.replaceState(null, '', location.pathname + location.search);
  closePDPUI();
}
function route(){
  const m = location.hash.match(/^#producto\/(.+)$/);
  if (m) openPDP(decodeURIComponent(m[1]));
  else if (pdpId !== null){
    closePDPUI();
    const t = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (t) t.scrollIntoView();
  }
}
addEventListener('hashchange', route);
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (!o) return;
  e.preventDefault(); pdpPushed = true; location.hash = 'producto/' + encodeURIComponent(o.dataset.open);
});
$('#pdpBack').addEventListener('click', closePDP);
$('#pdpCrumbs').addEventListener('click', e => {
  const b = e.target.closest('[data-crumb]'); if (!b) return;
  activeCat = b.dataset.crumb || 'Todos'; q.value = ''; shown = PAGE; renderShop();
  closePDP(); setTimeout(() => $('#tienda').scrollIntoView(), 60);
});
document.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => setPdpQty(pdpQty + Number(b.dataset.q))));
function pdpAdd(fromImg){
  if (pdpId === null) return;
  const n = (cart[pdpId] || 0) + pdpQty;
  setQty(pdpId, n, { img: fromImg, silent: true });
  toast(`Agregaste ${pdpQty} × ${fullName(byId(pdpId))}`);
  setTimeout(openDrawer, RM.matches ? 0 : 900);
}
$('#pdpAdd').addEventListener('click', () => pdpAdd($('#pdpImg')));
$('#satcAdd').addEventListener('click', () => pdpAdd($('#satcImg')));
// la barra aparece cuando el botón principal sale de la vista
new IntersectionObserver(([e]) => {
  const show = pdpId !== null && !e.isIntersecting && e.boundingClientRect.top < 0;
  satc.classList.toggle('show', show); satc.setAttribute('aria-hidden', !show);
}, { root: pdp, threshold: 0 }).observe($('#pdpAdd'));
$('#featSee').addEventListener('click', () => { const p = products.find(x => x.img === 'feat_maca' && !x.hidden); if (p){ pdpPushed = true; location.hash = 'producto/' + p.id; } });

/* =========================================================
   PEDIDO
   ========================================================= */
const fName = $('#fName'), fDist = $('#fDist'), fNote = $('#fNote');
const cartItems = () => Object.entries(cart).map(([id, n]) => ({ p: byId(id), n })).filter(x => x.p && !x.p.hidden);
function buildMsg(items){
  const nm = fName.value.trim(), ds = fDist.value.trim(), nt = fNote.value.trim();
  let m = "Hola Reyna's Superfoods, quiero hacer un pedido:\n";
  m += items.length ? items.map(({p, n}) => `• ${n} × ${fullName(p)}${p.size ? ` (${p.size})` : ''}${p.price !== '' ? ` – ${money(p.price * n)}` : ''}`).join('\n') : '• (elige productos en la tienda)';
  if (nm) m += `\n\nNombre: ${nm}`;
  if (ds) m += `${nm ? '\n' : '\n\n'}Envío a: ${ds}`;
  if (nt) m += `\nNota: ${nt}`;
  m += items.some(({p}) => p.price === '') ? '\n\n¿Me indican precios, presentaciones y el costo de envío?' : '\n\n¿Me confirman el total con el envío?';
  return m;
}
const lineHTML = ({p, n}, i) => `
  <div class="line" style="--i:${i}">
    <img src="${imgSrc(p)}" alt="">
    <div><div class="nm">${esc(fullName(p))}</div>
      <div class="sb">${p.size ? esc(p.size) + ' · ' : ''}${p.price !== '' ? money(p.price) + ' c/u' : 'Precio por confirmar'}</div>
      <button class="rm" type="button" data-rm="${p.id}">Quitar</button></div>
    <span data-ctl="${p.id}">${controlFor(p)}</span>
  </div>`;
function totals(items){
  const allPriced = items.length && items.every(({p}) => p.price !== '');
  return allPriced ? money(items.reduce((s, {p, n}) => s + p.price * n, 0)) : null;
}
function renderDrawer(animate){
  const items = cartItems(), n = items.reduce((s, x) => s + x.n, 0);
  $('#dTitle').textContent = n ? `Tu pedido (${n})` : 'Tu pedido';
  const list = $('#dlist');
  list.innerHTML = items.length ? items.map(lineHTML).join('') : '<p class="empty">Todavía no agregas productos. Explora la tienda y toca “Agregar”.</p>';
  if (!animate) list.querySelectorAll('.line').forEach(l => l.style.animation = 'none');
  const t = totals(items); $('#dtot').hidden = !t; if (t) $('#dtotV').textContent = t;
  $('#dgo').disabled = !items.length;
}
function renderOrder(){
  const items = cartItems();
  const totalN = items.reduce((s, x) => s + x.n, 0);
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = totalN; if (el.classList.contains('hcount')) el.hidden = !totalN; });
  $('#lines').innerHTML = items.length ? items.map(lineHTML).join('') : '<p class="empty">Tu pedido está vacío. <a class="ulink" href="#tienda">Ve a la tienda</a> y agrega productos o packs.</p>';
  const t = totals(items); $('#tot').hidden = !t; if (t) $('#totV').textContent = t;
  $('#preview').textContent = buildMsg(items);
  $('#send').disabled = !items.length;
  $('#send').textContent = items.length ? `Enviar pedido por WhatsApp (${totalN})` : 'Agrega productos para enviar';
  if (drawerOpen) renderDrawer(false);
}
[fName, fDist, fNote].forEach(el => el.addEventListener('input', renderOrder));
$('#oform').addEventListener('submit', e => {
  e.preventDefault();
  const items = cartItems(); if (!items.length) return;
  const msg = buildMsg(items);
  sb('/rest/v1/orders', { method:'POST', prefer:'return=minimal', keepalive:true, body:{
    customer_name: fName.value.trim() || null, customer_city: fDist.value.trim() || null, customer_note: fNote.value.trim() || null,
    items: items.map(({p, n}) => ({ name: fullName(p), size: p.size, price: p.price, qty: n })) } }).catch(() => {});
  window.open(waLink(msg), '_blank', 'noopener');
  cart = {}; saveC(); renderAll();
  toast('Pedido enviado. Te responderemos por WhatsApp.');
});
$('#customLink').href = waLink("Hola Reyna's Superfoods, quiero armar un pack con estos productos: ");
$('#wholeLink').href = waLink("Hola Reyna's Superfoods, quiero cotizar productos por mayor. Necesito: ");
$('#featImg').src = IMG.maca_main.src;
$('#featAdd').addEventListener('click', () => {
  const p = products.find(x => x.img === 'feat_maca' && !x.hidden) || products.find(x => norm(x.name) === 'maca negra' && !x.hidden);
  if (p) setQty(p.id, (cart[p.id] || 0) + 1, { img: $('#featImg') });
});

function renderAll(){ renderShop(); renderPacks(); renderOrder(); if (megaOpen) renderMega(); }
renderOrder();
loadCatalog().then(() => { renderAll(); route(); }).catch(() => {
  $('#grid').innerHTML = '<p class="none" style="grid-column:1/-1">No pudimos cargar el catálogo. Revisa tu conexión o <a class="ulink" href="' + waLink("Hola Reyna's Superfoods, quiero hacer un pedido") + '" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.</p>';
});

/* =========================================================
   PANEL DE ADMINISTRACIÓN (oculto)
   Pestañas: Productos (incluye packs y combos), Textos de la página y Pedidos.
   Acceso oculto: mantener presionado el logo "Reyna's" 5 segundos o tocarlo
   5 veces seguidas (arriba, en la ficha o en el pie). También Ctrl + Shift + A o #admin.
   Usuario de Supabase Auth que figure en la tabla admins.
   ========================================================= */
const admin = $('#admin'), aLogin = $('#aLogin'), aApp = $('#aApp');
const aList = $('#aList'), aQ = $('#aQ'), aG = $('#aG'), aForm = $('#aForm');
let editing = null, formImg = '', aProducts = [], aOrders = [];
const isAdminOpen = () => !admin.hidden;
const aById = id => aProducts.find(p => p.id === id);
const aMsg = t => { $('#aMsg').textContent = t || ''; };
async function isAdminUser(){ try { return (await sb('/rest/v1/admins?select=user_id', { auth:true })).length > 0; } catch { return false; } }

async function openAdmin(){
  touch(); admin.hidden = false; document.body.style.overflow = 'hidden';
  const ok = !!session && await isAdminUser();
  aLogin.hidden = ok; aApp.hidden = !ok;
  if (ok) renderAdmin(); else { $('#aPass').value = ''; $('#aErr').textContent = ''; setTimeout(() => $('#aEmail').focus(), 30); }
}
function closeAdmin(){
  admin.hidden = true; document.body.style.overflow = ''; touch();
  if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
  loadCatalog().then(renderAll).catch(() => {});
}
$('#aLoginForm').addEventListener('submit', async e => {
  e.preventDefault(); $('#aErr').textContent = 'Entrando…';
  try {
    const r = await fetch(SB.supabaseUrl + '/auth/v1/token?grant_type=password', { method:'POST', headers:{ apikey: SB.supabaseKey, 'Content-Type':'application/json' }, body: JSON.stringify({ email: $('#aEmail').value.trim(), password: $('#aPass').value }) });
    if (!r.ok) throw new Error('auth');
    keepSession(await r.json());
    if (!(await isAdminUser())){ dropSession(); $('#aErr').textContent = 'Esta cuenta no tiene permiso para administrar la tienda.'; return; }
    $('#aErr').textContent = ''; $('#aPass').value = '';
    aLogin.hidden = true; aApp.hidden = false; renderAdmin(); $('#aAdd').focus();
  } catch { $('#aErr').textContent = 'Correo o contraseña incorrectos.'; $('#aPass').select(); }
});
$('#aOut').addEventListener('click', () => {
  if (session) fetch(SB.supabaseUrl + '/auth/v1/logout', { method:'POST', headers:{ apikey: SB.supabaseKey, Authorization: 'Bearer ' + session.access_token } }).catch(() => {});
  dropSession(); closeAdmin();
});
admin.querySelectorAll('[data-aclose]').forEach(b => b.addEventListener('click', closeAdmin));
// Acceso oculto desde el logo: 5 s presionado o 5 toques seguidos
(() => {
  const SEL = '.hlogo, .tb-logo, .f-logo';
  let taps = 0, lastTap = 0, holdT = null, held = false, x0 = 0, y0 = 0;
  const cancel = () => { clearTimeout(holdT); holdT = null; };
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest(SEL)) return;
    held = false; x0 = e.clientX; y0 = e.clientY; cancel();
    holdT = setTimeout(() => { held = true; holdT = null; navigator.vibrate?.(40); openAdmin(); }, 5000);
  });
  document.addEventListener('pointermove', e => { if (holdT && Math.hypot(e.clientX - x0, e.clientY - y0) > 12) cancel(); });
  document.addEventListener('pointerup', cancel);
  document.addEventListener('pointercancel', cancel);
  document.addEventListener('contextmenu', e => { if (e.target.closest(SEL)) e.preventDefault(); });
  document.addEventListener('click', e => {
    if (!e.target.closest(SEL)) return;
    if (held){ held = false; e.preventDefault(); e.stopPropagation(); return; }
    const now = Date.now();
    taps = now - lastTap < 700 ? taps + 1 : 1; lastTap = now;
    if (taps >= 5){ taps = 0; e.preventDefault(); e.stopPropagation(); openAdmin(); }
  }, true);
})();
addEventListener('hashchange', () => { if (location.hash === '#admin') openAdmin(); });
if (location.hash === '#admin') openAdmin();

admin.querySelectorAll('[data-view]').forEach(t => t.addEventListener('click', () => {
  admin.querySelectorAll('[data-view]').forEach(x => x.setAttribute('aria-selected', x === t));
  $('#vProd').hidden = t.dataset.view !== 'prod';
  $('#vOrd').hidden = t.dataset.view !== 'ord';
  $('#vTxt').hidden = t.dataset.view !== 'txt';
  if (t.dataset.view === 'txt') renderTexts();
}));

const aGroups = () => [...new Set([...BASE_GROUPS, ...aProducts.map(p => p.group)])];
function fillGroupSelects(){
  const gs = aGroups(), cur = aG.value;
  aG.innerHTML = '<option value="">Todas las categorías</option>' + gs.map(g => `<option>${esc(g)}</option>`).join('');
  aG.value = gs.includes(cur) ? cur : '';
  $('#pGroup').innerHTML = gs.map(g => `<option>${esc(g)}</option>`).join('') + '<option value="__new">Nueva categoría…</option>';
}
async function renderAdmin(){
  aMsg('Cargando…');
  try {
    const [rows, os, st] = await Promise.all([
      sb('/rest/v1/products?select=*&order=sort.asc,name.asc', { auth:true }),
      sb('/rest/v1/orders?select=*&order=created_at.desc&limit=300', { auth:true }),
      sb('/rest/v1/settings?select=key,value')
    ]);
    aProducts = rows.map(r => fromRow(r, true)); aOrders = os;
    $('#aPrices').checked = !!(st.find(s => s.key === 'show_prices') || {}).value;
    aMsg('');
  } catch (err) { aMsg('No se pudo cargar el panel: ' + err.message); }
  fillGroupSelects();
  $('#tProd').textContent = `Productos (${aProducts.length})`;
  $('#tOrd').textContent = `Pedidos (${aOrders.length})`;
  renderProducts(); renderOrders();
}
$('#aPrices').addEventListener('change', async e => {
  try { await sb('/rest/v1/settings?key=eq.show_prices', { method:'PATCH', auth:true, body:{ value: e.target.checked } }); aMsg(e.target.checked ? 'Listo: los precios se ven en la tienda.' : 'Listo: los precios quedaron ocultos en la tienda.'); }
  catch (err) { e.target.checked = !e.target.checked; aMsg('No se pudo guardar: ' + err.message); }
});
function renderProducts(){
  const term = norm(aQ.value.trim()), g = aG.value;
  const rows = aProducts.filter(p => (!g || p.group === g) && norm(p.name).includes(term));
  if (!rows.length){ aList.innerHTML = '<p class="a-empty">No hay productos con ese filtro.</p>'; return; }
  aList.innerHTML = '<div class="a-row a-head"><span>Producto</span><span>Categoría</span><span>Presentación</span><span>Precio</span><span></span></div>' +
    rows.map(p => `<div class="a-row${p.hidden ? ' off' : ''}" data-id="${p.id}">
      <div class="a-pn"><img class="a-thumb" src="${imgSrc(p)}" alt="" loading="lazy"><div><div class="a-name">${esc(p.name)}</div>${p.desc ? `<div class="a-sub">${esc(p.desc)}</div>` : ''}</div></div>
      <span class="c-cat">${esc(p.group)}</span>
      <span class="c-size">${p.size ? esc(p.size) : '<span class="a-muted">Sin definir</span>'}</span>
      <span class="c-price">${p.price !== '' ? money(p.price) + (p.showPrice ? '' : ' <span class="a-muted">(oculto)</span>') : '<span class="a-muted">Por confirmar</span>'}</span>
      <div class="a-actions">
        <button class="btn sec sm" type="button" data-act="edit">Editar</button>
        <button class="btn sec sm" type="button" data-act="hide">${p.hidden ? 'Mostrar' : 'Ocultar'}</button>
        <button class="btn dan sm" type="button" data-act="del" aria-label="Eliminar ${esc(p.name)}">Eliminar</button>
      </div></div>`).join('');
}
aList.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const p = aById(b.closest('[data-id]').dataset.id); if (!p) return;
  if (b.dataset.act === 'edit') return openForm(p);
  try {
    if (b.dataset.act === 'hide'){
      await sb(`/rest/v1/products?id=eq.${p.id}`, { method:'PATCH', auth:true, body:{ active: p.hidden } });
      p.hidden = !p.hidden; renderProducts(); aMsg(p.hidden ? `“${p.name}” quedó oculto en la tienda.` : `“${p.name}” ya se ve en la tienda.`);
    }
    if (b.dataset.act === 'del' && confirm(`¿Eliminar "${p.name}" del catálogo? No se puede deshacer. Si solo quieres esconderlo, usa “Ocultar”.`)){
      await sb(`/rest/v1/products?id=eq.${p.id}`, { method:'DELETE', auth:true });
      delete cart[p.id]; saveC(); renderAdmin(); aMsg(`“${p.name}” se eliminó.`);
    }
  } catch (err) { aMsg('No se pudo guardar: ' + err.message); }
});
aQ.addEventListener('input', renderProducts);
aG.addEventListener('change', renderProducts);

function setFormImg(v){ formImg = v; $('#pImgPrev').src = v ? imgSrc({img:v}) : PLACEHOLDER; }
function openForm(p){
  editing = p || null;
  fillGroupSelects();
  $('#aFormT').textContent = p ? 'Editar producto' : 'Nuevo producto';
  $('#pName').value = p ? p.name : '';
  $('#pGroup').value = p ? p.group : (aG.value || G.andinos);
  $('#pSize').value = p ? p.size : '';
  $('#pPrice').value = p ? p.price : '';
  $('#pDesc').value = p ? p.desc : '';
  $('#pVis').checked = p ? !p.hidden : true;
  $('#pShowPrice').checked = p ? p.showPrice : true;
  $('#pImg').value = ''; setFormImg(p ? p.img : '');
  $('#pNew').value = ''; $('#pNewWrap').hidden = true; $('#pErr').textContent = '';
  aForm.hidden = false; aForm.scrollIntoView({block:'nearest'}); $('#pName').focus();
}
// la foto se reduce a 600×450 antes de subirla
$('#pImg').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => {
    const c = document.createElement('canvas'); c.width = 600; c.height = 450;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 600, 450);
    const s = Math.min(600 / im.width, 450 / im.height), w = im.width * s, h = im.height * s;
    x.drawImage(im, (600 - w) / 2, (450 - h) / 2, w, h);
    let d = c.toDataURL('image/webp', 0.8); if (!d.startsWith('data:image/webp')) d = c.toDataURL('image/jpeg', 0.82);
    setFormImg(d); URL.revokeObjectURL(url);
  };
  im.onerror = () => { $('#pErr').textContent = 'No se pudo leer esa imagen.'; URL.revokeObjectURL(url); };
  im.src = url;
});
$('#pImgClear').addEventListener('click', () => { $('#pImg').value = ''; setFormImg(''); });
$('#pGroup').addEventListener('change', e => { $('#pNewWrap').hidden = e.target.value !== '__new'; if (e.target.value === '__new') $('#pNew').focus(); });
$('#aAdd').addEventListener('click', () => openForm(null));
$('#aCancel').addEventListener('click', () => { aForm.hidden = true; editing = null; });
aForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('#pName').value.trim();
  let group = $('#pGroup').value; if (group === '__new') group = $('#pNew').value.trim();
  const priceRaw = $('#pPrice').value.trim().replace(',', '.');
  if (!name){ $('#pErr').textContent = 'Escribe el nombre del producto.'; $('#pName').focus(); return; }
  if (!group){ $('#pErr').textContent = 'Escribe el nombre de la nueva categoría.'; $('#pNew').focus(); return; }
  if (priceRaw !== '' && !(Number(priceRaw) >= 0)){ $('#pErr').textContent = 'El precio debe ser un número, por ejemplo 18.50.'; $('#pPrice').focus(); return; }
  const btn = aForm.querySelector('[type="submit"]'); btn.disabled = true; $('#pErr').textContent = 'Guardando…';
  try {
    let img = formImg;
    if (img.startsWith('data:')){
      const blob = await (await fetch(img)).blob();
      const path = `${uid()}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`;
      await sb(`/storage/v1/object/productos/${path}`, { method:'POST', auth:true, raw:true, body: blob, headers:{ 'Content-Type': blob.type, 'x-upsert':'true' } });
      img = `${SB.supabaseUrl}/storage/v1/object/public/productos/${path}`;
    }
    const row = { name, category: group, image_url: img || null, unit: $('#pSize').value.trim() || null, price: priceRaw === '' ? null : Number(priceRaw), description: $('#pDesc').value.trim() || null, active: $('#pVis').checked, show_price: $('#pShowPrice').checked };
    if (editing) await sb(`/rest/v1/products?id=eq.${editing.id}`, { method:'PATCH', auth:true, body: row });
    else await sb('/rest/v1/products', { method:'POST', auth:true, prefer:'return=minimal', body: { ...row, sort: 999 } });
    $('#pErr').textContent = ''; aForm.hidden = true; editing = null; await renderAdmin(); aMsg(`“${name}” se guardó.`);
  } catch (err) { $('#pErr').textContent = 'No se pudo guardar: ' + err.message; }
  finally { btn.disabled = false; }
});

/* ---------- Textos de la página ---------- */
const tList = $('#tList'), tDraft = {};
const tKeys = () => [...new Set([...document.querySelectorAll('main [data-edit], body > [data-edit], .hero [data-edit], .marquee [data-edit], .foot [data-edit]')].map(el => el.dataset.edit))];
const tDef = k => document.querySelector(`[data-edit="${k}"]`).dataset.def;
const tCur = k => k in tDraft ? tDraft[k] : (siteTexts[k] ?? tDef(k));
const tMsg = s => { $('#tMsg').textContent = s; };
function renderTexts(){
  const q = norm($('#tQ').value.trim()); const byG = {};
  tKeys().forEach(k => {
    const g = k.split('.')[0], lab = txtLabel(k), v = tCur(k);
    if (q && !norm(lab + ' ' + v + ' ' + (TXT_GROUPS[g] || '')).includes(q)) return;
    (byG[g] = byG[g] || []).push(k);
  });
  const gs = Object.keys(TXT_GROUPS).filter(g => byG[g]);
  tList.innerHTML = gs.length ? gs.map(g => `<fieldset class="t-group"><legend>${esc(TXT_GROUPS[g])}</legend>${byG[g].map(k => {
    const v = tCur(k), long = tDef(k).length > 60, changed = (siteTexts[k] ?? tDef(k)) !== tDef(k) || k in tDraft;
    return `<label class="t-row" data-k="${k}"><span class="t-lab">${esc(txtLabel(k))}${changed ? ' <span class="a-muted">(editado)</span>' : ''}</span>
      ${long ? `<textarea class="a-in" rows="3" maxlength="2000">${esc(v)}</textarea>` : `<input class="a-in" maxlength="300" value="${esc(v)}">`}
      ${(siteTexts[k] != null || k in tDraft) ? '<button class="btn sec sm" type="button" data-trestore>Restaurar</button>' : ''}</label>`;
  }).join('')}</fieldset>`).join('') : '<p class="a-empty">No hay textos con esa búsqueda.</p>';
}
tList.addEventListener('input', e => {
  const row = e.target.closest('[data-k]'); if (!row) return;
  tDraft[row.dataset.k] = e.target.value; $('#tSave').disabled = false; tMsg('Tienes cambios sin guardar.');
});
tList.addEventListener('click', e => {
  if (!e.target.closest('[data-trestore]')) return;
  e.preventDefault(); const k = e.target.closest('[data-k]').dataset.k;
  tDraft[k] = tDef(k); $('#tSave').disabled = false; renderTexts(); tMsg('Tienes cambios sin guardar.');
});
$('#tQ').addEventListener('input', renderTexts);
$('#tSave').addEventListener('click', async () => {
  const keys = Object.keys(tDraft); if (!keys.length) return;
  const up = [], del = [];
  for (const k of keys){
    const v = tDraft[k].trim();
    if (!v || v === tDef(k)) del.push(k); else up.push({ key: k, value: v });
  }
  $('#tSave').disabled = true; tMsg('Guardando…');
  try {
    if (up.length) await sb('/rest/v1/site_texts?on_conflict=key', { method:'POST', auth:true, prefer:'resolution=merge-duplicates,return=minimal', body: up });
    if (del.length) await sb(`/rest/v1/site_texts?key=in.${encodeURIComponent('(' + del.map(k => `"${k}"`).join(',') + ')')}`, { method:'DELETE', auth:true });
    up.forEach(r => { siteTexts[r.key] = r.value; }); del.forEach(k => { delete siteTexts[k]; });
    keys.forEach(k => delete tDraft[k]);
    applyTexts(); renderTexts(); tMsg(`Listo: ${keys.length === 1 ? 'se guardó 1 texto' : `se guardaron ${keys.length} textos`}. Ya se ve en la tienda.`);
  } catch (err) { $('#tSave').disabled = false; tMsg('No se pudo guardar: ' + err.message); }
});

const ST = { nuevo:'Por cobrar', pagado:'Pagado', facturado:'Facturado', anulado:'Anulado' };
function renderOrders(){
  const box = $('#oList');
  if (!aOrders.length){ box.innerHTML = '<div class="a-list"><p class="a-empty">Todavía no hay pedidos. Aparecen aquí cuando un cliente envía su pedido por WhatsApp desde la tienda.</p></div>'; return; }
  const fmt = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  box.innerHTML = aOrders.map(o => {
    const items = (o.items || []), paid = o.status === 'pagado' || o.status === 'facturado';
    const total = items.length && items.every(i => i.price !== '' && i.price != null) ? items.reduce((s, i) => s + Number(i.price) * (i.qty || 1), 0) : null;
    return `<article class="order" data-id="${o.id}">
      <header><b>${o.customer_name ? esc(o.customer_name) : 'Cliente sin nombre'}</b><span class="a-sub">N.º ${o.id} · ${fmt.format(new Date(o.created_at))}${o.customer_city ? ' · ' + esc(o.customer_city) : ''}</span>
        <span class="tag${paid ? ' ok' : ''}">${ST[o.status] || o.status}</span></header>
      <ul>${items.map(i => `<li>${i.qty || 1} × ${esc(i.name)}${i.size ? ` (${esc(i.size)})` : ''}${i.price !== '' && i.price != null ? ` – ${money(i.price * (i.qty || 1))}` : ''}</li>`).join('')}</ul>
      ${o.customer_note ? `<div class="a-sub">Nota: ${esc(o.customer_note)}</div>` : ''}
      ${total !== null ? `<div class="a-sub">Total de productos: <b>${money(total)}</b> (sin envío)</div>` : '<div class="a-sub">Algunos productos aún no tienen precio: se confirma por WhatsApp.</div>'}
      <div class="a-actions">
        ${o.status === 'facturado' ? '' : `<button class="btn sec sm" type="button" data-oact="paid">${paid ? 'Marcar por cobrar' : 'Marcar pagado'}</button>`}
        <button class="btn pri sm" type="button" disabled title="Se activa cuando el facturador entregue el acceso a su API">Emitir boleta</button>
        <button class="btn dan sm" type="button" data-oact="del">Eliminar</button>
      </div></article>`;
  }).join('');
}
$('#oList').addEventListener('click', async e => {
  const b = e.target.closest('[data-oact]'); if (!b) return;
  const o = aOrders.find(x => String(x.id) === b.closest('[data-id]').dataset.id); if (!o) return;
  try {
    if (b.dataset.oact === 'paid'){
      const next = o.status === 'pagado' ? 'nuevo' : 'pagado';
      await sb(`/rest/v1/orders?id=eq.${o.id}`, { method:'PATCH', auth:true, body:{ status: next } });
      o.status = next; renderOrders();
    }
    if (b.dataset.oact === 'del' && confirm('¿Eliminar este pedido del registro?')){
      await sb(`/rest/v1/orders?id=eq.${o.id}`, { method:'DELETE', auth:true });
      aOrders = aOrders.filter(x => x !== o); renderOrders(); $('#tOrd').textContent = `Pedidos (${aOrders.length})`;
    }
  } catch (err) { aMsg('No se pudo guardar: ' + err.message); }
});
