/* Reyna's Superfoods · portada.js
   Slider de la portada con capas en paralaje, pestañas y barra fija con mega menú. */
const IMG = {"maca_main": {"src": "/assets/hero/maca_main.webp", "w": 716, "h": 345}, "maca_amar": {"src": "/assets/hero/maca_amar.webp", "w": 415, "h": 420}, "maca_negra_r": {"src": "/assets/hero/maca_negra_r.webp", "w": 420, "h": 415}, "maca_roja_h": {"src": "/assets/hero/maca_roja_h.webp", "w": 402, "h": 420}, "lucuma_main": {"src": "/assets/hero/lucuma_main.webp", "w": 723, "h": 322}, "lucuma_half": {"src": "/assets/hero/lucuma_half.webp", "w": 402, "h": 257}, "lucuma_whole": {"src": "/assets/hero/lucuma_whole.webp", "w": 318, "h": 391}, "maiz_main": {"src": "/assets/hero/maiz_main.webp", "w": 758, "h": 346}, "maiz_cob": {"src": "/assets/hero/maiz_cob.webp", "w": 420, "h": 310}, "camu_main": {"src": "/assets/hero/camu_main.webp", "w": 716, "h": 320}, "camu_ber": {"src": "/assets/hero/camu_ber.webp", "w": 420, "h": 360}, "camu_x_ber": {"src": "/assets/hero/camu_x_ber.webp", "w": 271, "h": 219}};
Object.values(IMG).forEach(o => { o.src = withV(o.src); });
/* =========================================================
   PORTADA (sin cambios respecto de la v6)
   ========================================================= */
const SLIDES = [
  { word:'Maca', bg:'#D39F78', search:'maca', main:'maca_main',
    pieces:[['maca_amar',355,150,160,0,0,'fruit'],['maca_negra_r',1035,220,170,-8,0,'fruit'],['maca_roja_h',245,470,185,-8,0,'fruit'],['maca_amar',1215,440,165,14,1,'fruit'],['maca_roja_h',1040,605,165,20,1,'fruit'],['maca_amar',-30,600,300,0,0,'corner'],['maca_negra_r',1250,25,245,0,0,'corner']]},
  { word:'Lúcuma', bg:'#EDC27A', search:'lúcuma', main:'lucuma_main',
    pieces:[['lucuma_whole',360,140,150,-12,0,'fruit'],['lucuma_half',1035,215,170,10,0,'fruit'],['lucuma_whole',230,480,200,0,0,'fruit'],['lucuma_half',1215,430,170,-20,1,'fruit'],['lucuma_whole',1050,600,150,16,1,'fruit'],['lucuma_half',-20,590,290,0,0,'corner'],['lucuma_whole',1260,20,230,20,0,'corner']]},
  { word:'Maíz morado', bg:'#B79DD4', search:'maíz morado', main:'maiz_main',
    pieces:[['maiz_cob',350,150,170,0,0,'fruit'],['maiz_cob',1030,225,190,-12,0,'fruit'],['maiz_cob',220,480,210,18,1,'fruit'],['maiz_cob',1215,440,175,0,1,'fruit'],['maiz_cob',1045,610,180,-6,0,'fruit'],['maiz_cob',-30,595,300,0,0,'corner'],['maiz_cob',1240,30,260,25,0,'corner']]},
  { word:'Camu camu', bg:'#EDA0B2', search:'camu camu', main:'camu_main',
    pieces:[['camu_x_ber',370,135,130,-10,0,'fruit'],['camu_ber',1035,215,170,8,0,'fruit'],['camu_x_ber',220,480,200,-6,0,'fruit'],['camu_x_ber',1225,425,145,15,1,'fruit'],['camu_ber',1045,605,165,-14,1,'fruit'],['camu_ber',-30,590,300,0,0,'corner'],['camu_x_ber',1270,15,210,20,0,'corner']]},
];
const MAIN_W = 700, MAIN_BOTTOM = 760;
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
