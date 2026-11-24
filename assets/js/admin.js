/* Reyna's Superfoods · admin.js
   Panel de administración. NO se carga para los visitantes: lo descarga acceso.js solo cuando la dueña abre el panel. */
/* =========================================================
   PANEL DE ADMINISTRACIÓN (oculto)
   Pestañas: Productos (incluye packs y combos), Textos de la página y Pedidos.
   Acceso oculto: mantener presionado el logo "Reyna's" 5 segundos o tocarlo
   5 veces seguidas (arriba, en la ficha o en el pie). También Ctrl + Shift + A o #admin.
   Usuario de Supabase Auth que figure en la tabla admins.
   ========================================================= */
// el HTML del panel vive aquí para no cargarlo en la página de los visitantes
document.body.insertAdjacentHTML('beforeend', `
<div class="admin" id="admin" hidden role="dialog" aria-modal="true" aria-labelledby="aTitle">
  <div class="a-login" id="aLogin">
    <form class="a-card" id="aLoginForm">
      <h2 id="aTitle">Panel de Reyna's</h2>
      <p>Acceso solo para la tienda.</p>
      <input class="a-in" id="aEmail" type="email" placeholder="Correo" aria-label="Correo" autocomplete="username" required>
      <input class="a-in" id="aPass" type="password" placeholder="Contraseña" aria-label="Contraseña" autocomplete="current-password" required>
      <p class="a-err" id="aErr" role="alert"></p>
      <button class="btn pri" type="submit">Entrar</button>
      <button class="btn sec" type="button" data-aclose>Volver a la tienda</button>
    </form>
  </div>

  <div class="a-wrap" id="aApp" hidden>
    <div class="a-top">
      <h1>Panel de Reyna's</h1>
      <button class="btn sec" type="button" data-aclose>Ver tienda</button>
      <button class="btn sec" type="button" id="aOut">Salir</button>
    </div>
    <div class="a-tabs" role="tablist">
      <button type="button" role="tab" aria-selected="true" data-view="prod" id="tProd">Productos</button>
      <button type="button" role="tab" aria-selected="false" data-view="txt" id="tTxt">Textos de la página</button>
      <button type="button" role="tab" aria-selected="false" data-view="ord" id="tOrd">Pedidos</button>
    </div>

    <section id="vProd">
      <div class="a-bar">
        <input class="a-in" id="aQ" type="search" placeholder="Buscar producto" aria-label="Buscar producto">
        <select class="a-in" id="aG" aria-label="Filtrar por categoría"></select>
        <button class="btn pri" type="button" id="aAdd">Agregar producto</button>
      </div>
      <label class="a-check" style="margin:0 0 12px"><input type="checkbox" id="aPrices"> Mostrar precios en la tienda</label>
      <p class="a-err" id="aMsg" role="status" aria-live="polite"></p>

      <form class="a-form" id="aForm" hidden>
        <h3 id="aFormT">Nuevo producto</h3>
        <div class="a-grid">
          <label>Nombre<input class="a-in" id="pName" required placeholder="Ej.: Maca negra"></label>
          <label>Categoría<select class="a-in" id="pGroup"></select></label>
          <label>Presentación<input class="a-in" id="pSize" placeholder="Ej.: 500 g"></label>
          <label>Precio (S/)<input class="a-in" id="pPrice" inputmode="decimal" placeholder="Opcional"></label>
        </div>
        <label id="pNewWrap" hidden>Nombre de la nueva categoría<input class="a-in" id="pNew" placeholder="Ej.: Condimentos en polvo"></label>
        <div class="a-photo"><img id="pImgPrev" alt="Vista previa de la foto"><label>Foto del producto<input class="a-in" id="pImg" type="file" accept="image/*" style="padding-top:9px"></label><button class="btn sec sm" type="button" id="pImgClear">Quitar foto</button></div>
        <label>Descripción (se ve en la ficha del producto y en packs y combos)<textarea class="a-in" id="pDesc" placeholder="Qué incluye, para qué sirve…"></textarea></label>
        <label class="a-check"><input type="checkbox" id="pVis" checked> Visible en la tienda</label>
        <label class="a-check"><input type="checkbox" id="pShowPrice" checked> Mostrar el precio de este producto (cuando los precios estén activados)</label>
        <p class="a-err" id="pErr" role="alert"></p>
        <div class="a-actions">
          <button class="btn pri" type="submit">Guardar</button>
          <button class="btn sec" type="button" id="aCancel">Cancelar</button>
        </div>
      </form>

      <div class="a-list" id="aList"></div>
      <p class="a-note">Los cambios se guardan en la base de datos y se ven en la tienda al instante. Si un producto no tiene precio, la tienda muestra “Precio por confirmar”.</p>
    </section>

    <section id="vTxt" hidden>
      <p class="a-note" style="margin:0 0 14px">Aquí cambias lo que dice la página: títulos, frases, misión y visión, pasos y el pie. El diseño no cambia. Escribe, presiona <b>Guardar cambios</b> y se ve en la tienda al instante. <b>Restaurar</b> vuelve al texto original.</p>
      <div class="a-bar"><input class="a-in" id="tQ" type="search" placeholder="Buscar texto" aria-label="Buscar texto"><button class="btn pri" type="button" id="tSave" disabled>Guardar cambios</button></div>
      <p class="a-err" id="tMsg" role="status" aria-live="polite"></p>
      <div id="tList"></div>
    </section>

    <section id="vOrd" hidden>
      <div id="oList"></div>
      <p class="a-note">Cada pedido que el cliente envía por WhatsApp queda registrado aquí. La boleta se emitirá desde aquí cuando el facturador entregue el acceso a su API, siempre después de confirmar el pago.</p>
    </section>
  </div>
</div>
`);

const admin = $('#admin'), aLogin = $('#aLogin'), aApp = $('#aApp');
const aList = $('#aList'), aQ = $('#aQ'), aG = $('#aG'), aForm = $('#aForm');
let editing = null, formImg = '', aProducts = [], aOrders = [];
const aById = id => aProducts.find(p => p.id === id);
const aMsg = t => { $('#aMsg').textContent = t || ''; };
async function isAdminUser(){ try { return (await sb('/rest/v1/admins?select=user_id', { auth:true })).length > 0; } catch { return false; } }

async function adminOpen(){
  touch(); admin.hidden = false; document.body.style.overflow = 'hidden';
  const ok = !!session && await isAdminUser();
  aLogin.hidden = ok; aApp.hidden = !ok;
  if (ok) renderAdmin(); else { $('#aPass').value = ''; $('#aErr').textContent = ''; setTimeout(() => $('#aEmail').focus(), 30); }
}
function adminClose(){
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
  dropSession(); adminClose();
});
admin.querySelectorAll('[data-aclose]').forEach(b => b.addEventListener('click', adminClose));
if (location.hash === '#admin') adminOpen();

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
