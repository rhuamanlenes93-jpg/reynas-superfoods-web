/* Reyna's Superfoods · portada.js
   Slider de la portada con capas en paralaje, pestañas y barra fija con mega menú. */
const IMG = {"maca_main": {"src": "/assets/hero/maca_main.webp", "w": 1200, "h": 571}, "maca_amar": {"src": "/assets/hero/maca_amar.webp", "w": 337, "h": 340}, "maca_negra_r": {"src": "/assets/hero/maca_negra_r.webp", "w": 340, "h": 335}, "maca_roja_h": {"src": "/assets/hero/maca_roja_h.webp", "w": 326, "h": 340}, "lucuma_main": {"src": "/assets/hero/lucuma_main.webp", "w": 1200, "h": 531}, "lucuma_half": {"src": "/assets/hero/lucuma_half.webp", "w": 340, "h": 217}, "lucuma_whole": {"src": "/assets/hero/lucuma_whole.webp", "w": 275, "h": 340}, "maiz_main": {"src": "/assets/hero/maiz_main.webp", "w": 1200, "h": 547}, "maiz_cob": {"src": "/assets/hero/maiz_cob.webp", "w": 340, "h": 251}, "camu_main": {"src": "/assets/hero/camu_main.webp", "w": 1200, "h": 533}, "camu_ber": {"src": "/assets/hero/camu_ber.webp", "w": 340, "h": 291}, "camu_x_ber": {"src": "/assets/hero/camu_x_ber.webp", "w": 340, "h": 274}, "leaf": {"src": "/assets/hero/leaf.webp", "w": 370, "h": 210}};
Object.values(IMG).forEach(o => { o.src = withV(o.src); });
/* =========================================================
   PORTADA (sin cambios respecto de la v6)
   ========================================================= */
const SLIDES = [
  { word:'Maca', bg:'#F7BD8C', search:'maca', tag:['“El ginseng de los Andes”','Energía y vitalidad natural'], main:'maca_main',
    pieces:[['maca_amar',290,72,155,0,0,'fruit'],['maca_negra_r',1105,72,158,-4,0,'fruit'],['maca_amar',1300,366,210,8,1,'fruit'],['maca_roja_h',60,408,295,-4,0,'fruit'],['maca_roja_h',1195,563,245,6,1,'fruit']]},
  { word:'Lúcuma', bg:'#F5C46E', search:'lúcuma', tag:['“El oro de los Incas”','Rica en antioxidantes'], main:'lucuma_main',
    pieces:[['lucuma_whole',305,72,116,-12,0,'fruit'],['lucuma_half',1100,72,165,10,0,'fruit'],['lucuma_whole',1310,348,175,14,1,'fruit'],['lucuma_whole',60,433,215,-6,0,'fruit'],['lucuma_half',1180,598,240,-14,1,'fruit']]},
  { word:'Maíz morado', bg:'#C3A2EC', search:'maíz morado', tag:['“El color del Perú”','Rico en antocianinas'], main:'maiz_main',
    pieces:[['maiz_cob',290,72,155,-8,0,'fruit'],['maiz_cob',1100,72,165,14,0,'fruit'],['maiz_cob',1295,368,215,-20,1,'fruit'],['maiz_cob',40,463,260,22,1,'fruit'],['maiz_cob',1180,598,245,-6,0,'fruit']]},
  { word:'Camu camu', bg:'#F6A3B8', search:'camu camu', tag:['“El tesoro de la Amazonía”','Fuente natural de vitamina C'], main:'camu_main',
    pieces:[['camu_x_ber',300,72,130,-10,0,'fruit'],['camu_ber',1100,72,162,8,0,'fruit'],['camu_x_ber',1310,363,190,15,1,'fruit'],['camu_ber',50,433,250,-6,0,'fruit'],['camu_x_ber',1190,588,230,-14,1,'fruit']]},
];
// hojas verdes detrás del montículo (iguales en todas las diapositivas)
const LEAVES = [['leaf',-40,560,190,4,0,'leaf'],['leaf',300,482,100,-28,1,'leaf',1],['leaf',875,414,125,-38,0,'leaf',1],['leaf',1165,490,160,12,1,'leaf'],['leaf',1225,560,125,34,0,'leaf']];
SLIDES.forEach(s => { s.pieces = LEAVES.concat(s.pieces); });
const MAIN_W = 840, MAIN_BOTTOM = 762, MAIN_W_M = 570, MAIN_BOTTOM_M = 800;
const SHADOWS = [[200,722,240,26],[720,754,640,38],[1320,815,220,22],[1090,766,260,26]];
const LAYERS = ['word','shadow','leaf','bottle','fruit','corner'];
const FACT = {word:.40, shadow:.30, leaf:.2, bottle:.15, fruit:.55, corner:.75};

const hero = $('#inicio'), stage = $('#stage'), tabsEl = $('#tabs'), bar = $('#bar');
const U = v => `calc(${v} * var(--u))`;
const rand = (a,b) => a + Math.random()*(b-a);
let lastTouch = 0;
const touch = () => { lastTouch = Date.now(); };

const pieceEls = [], mainEls = [];
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
  const main = document.createElement('div'); main.className = 'mainimg'; main._m = IMG[s.main];
  main.setAttribute('role','img'); main.setAttribute('aria-label', 'Harina de ' + s.word.toLowerCase());
  main.dataset.bg = main._m.src; mainEls.push(main);
  L.bottle.appendChild(main);
  s.pieces.forEach(([k,x,y,pw,r,mir,layer,hm]) => {
    const a = IMG[k], ph = pw * a.h / a.w;
    const o = document.createElement('div'); o.className = 'piece' + (mir ? ' m' : '');
    o._g = {x, y, pw, ph, layer, hm}; pieceEls.push(o);
    const inner = document.createElement('i');
    inner.dataset.bg = a.src;
    inner.style.setProperty('--r', r + 'deg');
    inner.style.setProperty('--d', rand(3.2,5).toFixed(2) + 's');
    inner.style.setProperty('--dl', (-rand(0,4)).toFixed(2) + 's');
    o.appendChild(inner); L[layer].appendChild(o);
  });
  sec.appendChild(frame); stage.appendChild(sec);
  const b = document.createElement('button'); b.type = 'button'; b.textContent = s.word;
  b.addEventListener('click', () => { touch(); if (i !== cur) go(i, i > cur ? 1 : -1); });
  // la barra superior ahora es el menú del sitio; los productos de la portada se cambian con las flechas o deslizando
  return { sec, L, word:w, tab:b, data:s, idx:i };
});

let u = 1, mobile = false;
const g0 = o => o._g.layer;
const ctx = document.createElement('canvas').getContext('2d');
function inkAt100(t){ ctx.font = '700 100px Poppins'; const m = ctx.measureText(t); return (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || m.width; }
function layout(){
  const W = hero.clientWidth, H = hero.clientHeight;
  mobile = W <= 820 || H > W;
  u = mobile ? Math.min(W/640, (H-200)/620) : Math.min(W/1440, H/900);
  hero.style.setProperty('--u', u + 'px');
  hero.style.setProperty('--fy', mobile ? -Math.round(H * 0.05) + 'px' : '0px');
  const visible = Math.min(1440, W/u) * 0.92;
  pieceEls.forEach(o => {
    const sm = mobile && g0(o) !== 'corner', g = o._g, k = sm ? (g.layer === 'leaf' ? 0.6 : g.y < 100 ? 0.9 : 0.62) : 1, pull = sm ? 0.5 : 1;
    const w = g.pw * k, h = g.ph * k, cx = 720 + (g.x + g.pw/2 - 720) * pull, cy = g.y + g.ph/2;
    Object.assign(o.style,{left:U(cx - w/2),top:U(cy - h/2),width:U(w),height:U(h),display:mobile && g.hm ? 'none' : ''});
  });
  const MW = mobile ? MAIN_W_M : MAIN_W, MB = mobile ? MAIN_BOTTOM_M : MAIN_BOTTOM;
  mainEls.forEach(el => { const mh = MW * el._m.h / el._m.w;
    Object.assign(el.style,{left:U(720-MW/2),top:U(MB-mh),width:U(MW),height:U(mh)}); });
  slides.forEach(s => {
    const ink = inkAt100(s.data.word);
    if (!mobile){ // escritorio: palabra grande de borde a borde, como la referencia
      const F = Math.min(415, Math.min(W/u, 1760) * 0.78 * 100 / ink), ls = -0.01;
      Object.assign(s.word.style,{fontSize:U(F),letterSpacing:ls+'em',top:U(432 - 0.85*F)});
      return;
    }
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
  hero.style.backgroundColor = slides[cur].data.bg;
  setTag(instant);
}
// descripción breve de cada superalimento (debajo de la imagen, encima de "Comprar ahora")
const tagEl = $('#htag');
function setTag(instant){
  if (!tagEl) return;
  const [a, b] = slides[cur].data.tag;
  const put = () => { tagEl.innerHTML = `<b>${a}</b><span>${b}</span>`; };
  if (instant || RM.matches){ put(); return; }
  tagEl.classList.add('out');
  setTimeout(() => { put(); tagEl.classList.remove('out'); }, 380);
}

// las imágenes de cada diapositiva se cargan solo cuando hacen falta (la primera al inicio)
function loadSlide(i){
  const s = slides[i]; if (!s || s.loaded) return; s.loaded = true;
  s.sec.querySelectorAll('[data-bg]').forEach(el => {
    if (el.closest('.L-corner') && document.documentElement.classList.contains('lite')) return;
    el.style.backgroundImage = `url(${el.dataset.bg})`;
  });
}
loadSlide(0);
addEventListener('load', () => setTimeout(() => loadSlide(1), 2500));

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
  loadSlide(to);
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
  if (!show && typeof setMega === "function") setMega(false);
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
}, 5200);
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
/* si se muestra la bienvenida, la portada entra justo cuando se levanta la cortina */
const SPLASH_MS = (!document.documentElement.classList.contains('seen') && !RM.matches) ? 2100 : 0;
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(reveal, SPLASH_MS));
