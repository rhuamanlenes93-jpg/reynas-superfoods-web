/* Reyna's Superfoods · pedido.js
   Carrito, ficha de producto, pedido por WhatsApp y arranque de la tienda. */
/* =========================================================
   CARRITO (cantidades, aviso, drawer)
   ========================================================= */
let toastT;
function toast(msg){
  $('#toastT').textContent = msg; $('#toast').classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => $('#toast').classList.remove('show'), 2600);
}
// estadística anónima para el panel: qué productos se agregan al carrito (sin datos del cliente)
function trackCart(p, q){
  if (session) return; // no contar las pruebas del administrador
  sb('/rest/v1/cart_events', { method:'POST', prefer:'return=minimal', keepalive:true,
    body:{ product_id: String(p.id).slice(0, 80), product_name: fullName(p).slice(0, 160), qty: Math.min(Math.max(1, q), 50) } }).catch(() => {});
}
function setQty(id, n, opts = {}){
  const p = byId(id); if (!p) return;
  const before = cart[id] || 0;
  if (n <= 0) delete cart[id]; else cart[id] = Math.min(n, 999);
  saveC();
  document.querySelectorAll(`[data-ctl="${id}"]`).forEach(el => el.innerHTML = controlFor(p));
  renderOrder();
  if (n > before){
    trackCart(p, n - before);
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
  $('#satcPrice').textContent = money(p.price);
  $('#pdpDesc').textContent = p.desc || `Producto de Reyna's Superfoods, listo para usar. ${USES[p.group] || ''}`.trim();
  $('#pdpFacts').innerHTML = [['Presentación', p.size], ['Precio', money(p.price)], ['Venta', 'Por mayor y menor'], ['Envíos', 'Lima y provincias']].filter(([, v]) => v)
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
  if (location.hash === '#pedido'){ history.replaceState(null, '', location.pathname + location.search); openDrawer(); return; }
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
const fName = $('#fName'), fDist = $('#fDist');
const cartItems = () => Object.entries(cart).map(([id, n]) => ({ p: byId(id), n })).filter(x => x.p && !x.p.hidden);
// código corto del pedido: va en el mensaje de WhatsApp y en el historial del panel
const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function orderCode(){
  let c = null; try { c = sessionStorage.getItem('reynas.code'); } catch {}
  if (!c || !/^R-[A-Z0-9]{4}$/.test(c)){
    c = 'R-' + Array.from(crypto.getRandomValues(new Uint8Array(4)), b => CODE_ABC[b % CODE_ABC.length]).join('');
    try { sessionStorage.setItem('reynas.code', c); } catch {}
  }
  return c;
}
function buildMsg(items){
  const nm = fName.value.trim(), ds = fDist.value.trim();
  let m = `Hola Reyna's Superfoods, quiero hacer un pedido (${orderCode()}):\n`;
  m += items.length ? items.map(({p, n}) => `• ${n} × ${fullName(p)}${p.size ? ` (${p.size})` : ''}${p.price !== '' ? ` – ${money(p.price * n)}` : ''}`).join('\n') : '• (elige productos en la tienda)';
  if (nm) m += `\n\nNombre: ${nm}`;
  if (ds) m += `${nm ? '\n' : '\n\n'}Envío a: ${ds}`;
  m += items.some(({p}) => p.price === '') ? '\n\n¿Me indican el total y el costo de envío?' : '\n\n¿Me confirman el total con el envío?';
  return m;
}
const lineHTML = ({p, n}, i) => `
  <div class="line" style="--i:${i}">
    <img src="${/^[a-z0-9_]+$/.test(p.img || '') ? withV(`/assets/products/sm/${p.img}.webp`) : imgSrc(p)}" alt="" loading="lazy" decoding="async">
    <div><div class="nm">${esc(fullName(p))}</div>
      <div class="sb">${[p.size ? esc(p.size) : '', p.price !== '' ? money(p.price) + ' c/u' : ''].filter(Boolean).join(' · ')}</div>
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
  list.classList.toggle('static', !animate); // al quitar o cambiar cantidades, sin animación de entrada
  const t = totals(items); $('#dtot').hidden = !t; if (t) $('#dtotV').textContent = t;
  $('#send').disabled = !items.length;
  $('#send').textContent = items.length ? 'Enviar pedido por WhatsApp' : 'Agrega productos para enviar';
  $('#oform').hidden = !items.length;
}
function renderOrder(){
  const items = cartItems();
  const totalN = items.reduce((s, x) => s + x.n, 0);
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = totalN; if (el.classList.contains('hcount')) el.hidden = !totalN; });
  if (drawerOpen) renderDrawer(false);
}
$('#oform').addEventListener('submit', e => {
  e.preventDefault();
  const items = cartItems(); if (!items.length) return;
  const msg = buildMsg(items);
  sb('/rest/v1/orders', { method:'POST', prefer:'return=minimal', keepalive:true, body:{
    code: orderCode(), customer_name: fName.value.trim() || null, customer_city: fDist.value.trim() || null, customer_note: null,
    items: items.map(({p, n}) => ({ name: fullName(p), size: p.size, price: p.price, qty: n })) } }).catch(() => {});
  window.open(waLink(msg), '_blank', 'noopener');
  try { sessionStorage.removeItem('reynas.code'); } catch {}
  cart = {}; saveC(); renderAll(); closeDrawer();
  toast('Pedido enviado. Te responderemos por WhatsApp.');
});
$('#customLink').href = waLink("Hola Reyna's Superfoods, quiero armar un pack con estos productos: ");
document.querySelectorAll('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });
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
