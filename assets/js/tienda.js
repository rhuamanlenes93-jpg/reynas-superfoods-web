/* Reyna's Superfoods · tienda.js
   Catálogo desde Supabase, animaciones, textos editables, mega menú, tienda y packs. */
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
  hierbas:'Hierbas e infusiones', extractos:'Extractos en polvo', doypacks:'Doypacks', packs:'Packs y combos'
};
const HARINA_GROUPS = [G.andinos, G.granos, G.raices, G.hierbas];
const BASE_GROUPS = [G.andinos, G.granos, G.raices, G.hierbas, G.extractos, G.doypacks, G.packs];
const COLORS = { [G.andinos]:'#D39F78', [G.granos]:'#EBC46F', [G.raices]:'#EDA0B2', [G.hierbas]:'#9CC98A', [G.extractos]:'#B79DD4', [G.doypacks]:'#E3B65E', [G.packs]:'#8FC9C2' };
const EXTRA = ['#E8B48C','#A9CFE0','#D8C27A','#C9A6D8'];
const colorOf = g => COLORS[g] || EXTRA[[...g].reduce((s,c) => s + c.charCodeAt(0), 0) % EXTRA.length];
const USES = {
  [G.andinos]:'Ideal para batidos, recetas, yogures y panadería.',
  [G.granos]:'Ideal para panes, galletas, papillas, batidos y recetas caseras.',
  [G.raices]:'Ideal para sopas, cremas, masas, postres y batidos.',
  [G.hierbas]:'Ideal para infusiones, aderezos y mezclas naturales.',
  [G.doypacks]:'Doypack con cierre zip de 250 g, 500 g o 1 kg, listo para tu despensa o para vender en tu tienda.',
  [G.extractos]:'Ideal para jugos, smoothies, helados y repostería.'
};
let products = [], catalogLoaded = false;
let cart = load(KEY_C) || {};
const saveC = () => save(KEY_C, cart);
// fila de Supabase -> producto de la tienda (si tiene precio, se muestra; si no, no se muestra nada)
function fromRow(r, adminView){
  return { id: r.id, name: r.name, group: r.category, img: r.image_url || '', size: r.unit || '',
    price: r.price != null ? String(Number(r.price)) : '',
    desc: r.description || '', hidden: !r.active, example: !!r.is_example };
}
async function loadCatalog(){
  const rows = await sb('/rest/v1/products?select=*&active=is.true&order=sort.asc,name.asc');
  products = rows.map(r => fromRow(r));
  catalogLoaded = true;
  Object.keys(cart).forEach(id => { if (!products.some(p => p.id === id)) delete cart[id]; });
  saveC();
}
const groups = () => [...new Set([...BASE_GROUPS, ...products.map(p => p.group)])];
const lc = n => n.charAt(0).toLowerCase() + n.slice(1);
// dirección propia de cada producto para Google: /producto/harina-de-maca-negra
const urlSlug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function fullName(p){
  if (HARINA_GROUPS.includes(p.group)) return 'Harina de ' + lc(p.name);
  if (p.group === G.extractos) return 'Extracto en polvo de ' + lc(p.name);
  if (p.group === G.doypacks) return p.name + ' en doypack';
  return p.name;
}
const money = v => v === '' || v == null ? '' : 'S/ ' + Number(v).toFixed(2);
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#F4EFE2"/><text x="200" y="160" font-family="Poppins,sans-serif" font-size="22" fill="#9A9F94" text-anchor="middle">Foto por subir</text></svg>');
const imgCard = p => /^[a-z0-9_]+$/.test(p.img || '') ? `src="${withV(`/assets/products/sm/${p.img}.webp`)}" srcset="${withV(`/assets/products/sm/${p.img}.webp`)} 360w, ${photoUrl(p.img)} 640w" sizes="(max-width: 700px) 46vw, 300px"` : `src="${imgSrc(p)}"`;
const imgSrc = p => !p.img ? PLACEHOLDER : /^(data:|https?:|\/)/.test(p.img) ? p.img : (/^[a-z0-9_]+$/.test(p.img) ? photoUrl(p.img) : PLACEHOLDER);
// índice por id (se rehace solo cuando cambia la lista de productos)
let prodMap = new Map(), prodMapSrc = null;
const byId = id => { if (prodMapSrc !== products || prodMap.size !== products.length){ prodMap = new Map(products.map(p => [p.id, p])); prodMapSrc = products; } return prodMap.get(id); };
const visible = () => products.filter(p => !p.hidden);
const priceHTML = p => `<span class="pr">${money(p.price)}</span>`;

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
const TXT_GROUPS = { hero:'Portada', cinta1:'Cinta de arriba', tienda:'Tienda', packs:'Packs y combos', dest:'Producto destacado', val:'Valores', mv:'Misión y visión', pres:'Presentaciones por mayor', may:'Venta por mayor', pasos:'Cómo comprar', pedido:'Mi pedido', faq:'Preguntas frecuentes', cinta2:'Cinta de abajo', pie:'Pie de página' };
const TXT_NAMES = { boton:'Botón', etiqueta:'Texto pequeño sobre el título', titulo:'Título', texto:'Texto', extra:'Frase', palabra:'Palabra grande de fondo', nota:'Nota debajo del botón', ideal_t:'“Ideal para” (título)', ideal:'“Ideal para” (texto)', mision_t:'Título de la misión', mision:'Misión', vision_t:'Título de la visión', vision:'Visión', lugar:'Ubicación', deslizar:'Aviso “Desliza hacia abajo” (celular)', horario:'Horario de atención', derechos:'Derechos' };
const TXT_ITEM = { val:'Valor', pasos:'Paso', dest:'Beneficio', pres:'Presentación', faq:'Pregunta' };
function txtLabel(key){
  const [g, s] = key.split('.');
  if (TXT_NAMES[s]) return TXT_NAMES[s];
  let m = s.match(/^(\d+)_tag$/); if (m) return `${TXT_ITEM[g] || 'Elemento'} ${m[1]}: etiqueta (peso)`;
  m = s.match(/^b?(\d+)_t$/); if (m) return `${TXT_ITEM[g] || 'Elemento'} ${m[1]}: título`;
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
  faqLd();
}
// preguntas frecuentes en formato que Google puede mostrar en los resultados
function faqLd(){
  const items = [...document.querySelectorAll('#faqList details')].map(d => ({ q: d.querySelector('summary').textContent.trim(), a: d.querySelector('p').textContent.trim() })).filter(x => x.q && x.a);
  let s = document.getElementById('faqLd');
  if (!s){ s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'faqLd'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({ '@context':'https://schema.org', '@type':'FAQPage', mainEntity: items.map(x => ({ '@type':'Question', name: x.q, acceptedAnswer: { '@type':'Answer', text: x.a } })) });
}
// datos de la empresa (panel → Inicio → Datos de tu empresa): pie de página
async function loadEmpresa(){
  try {
    const r = await sb('/rest/v1/settings?select=value&key=eq.empresa'); const e = (r[0] || {}).value || {};
    const line = e.ruc || '';
    const el = document.getElementById('empLine'); if (el) el.textContent = line;
    const fb = document.getElementById('fbLi');
    if (fb && /^https:\/\//.test(e.facebook_url || '')) fb.href = e.facebook_url;
  } catch {}
}
loadEmpresa();
faqLd();
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
const LITE = document.documentElement.classList.contains('lite');
let mqRunning = false;
const mqIO = new IntersectionObserver(es => {
  es.forEach(e => { const o = marquees.find(x => x.m === e.target); if (o) o.on = e.isIntersecting; });
  if (!mqRunning && marquees.some(o => o.on)){ mqRunning = true; requestAnimationFrame(mqLoop); }
}, {rootMargin:'50px 0px'});
if (!LITE && !RM.matches) marquees.forEach(o => mqIO.observe(o.m));
function mqLoop(){
  if (!marquees.some(o => o.on)){ mqRunning = false; return; }
  {
    vel *= .92;
    marquees.forEach(o => {
      if (!o.on) return;
      if (!o.half) o.half = o.t.scrollWidth / 2;
      const half = o.half;
      o.x -= (o.base + Math.sign(o.base) * vel * .5) * dirSign;
      if (o.x <= -half) o.x += half; if (o.x > 0) o.x -= half;
      o.t.style.transform = `translate3d(${o.x}px,0,0)`;
    });
  }
  requestAnimationFrame(mqLoop);
}
addEventListener('resize', () => marquees.forEach(o => { o.half = 0; }), {passive:true});
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
      <ul>${list.slice(0,6).map(p => `<li><button type="button" data-open="${p.id}"><img src="${/^[a-z0-9_]+$/.test(p.img || '') ? withV(`/assets/products/sm/${p.img}.webp`) : imgSrc(p)}" alt="" loading="lazy" decoding="async">${esc(p.name)}</button></li>`).join('')}</ul>
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
    <button class="ph" type="button" data-open="${p.id}" aria-label="Ver ${esc(fullName(p))}"><img ${imgCard(p)} alt="${esc(fullName(p))}" loading="lazy" decoding="async"><span class="qv" aria-hidden="true">Ver producto<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button>
    <div class="bd">
      <span class="chip">${esc(p.group)}</span>
      <h3><a href="/producto/${urlSlug(fullName(p))}" data-open="${p.id}">${esc(fullName(p))}</a></h3>
      ${p.size ? `<span class="mt">${esc(p.size)}</span>` : ''}
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
        <button class="ph" type="button" data-open="${p.id}" aria-label="Ver ${esc(p.name)}"><img ${imgCard(p)} alt="" loading="lazy" decoding="async">${p.example ? '<span class="ptag">Ejemplo</span>' : ''}<span class="qv" aria-hidden="true">Ver pack<svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></button>
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
