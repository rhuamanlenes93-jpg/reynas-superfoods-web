/* Reyna's Superfoods · admin.js
   Panel de administración. NO se carga para los visitantes: lo descarga acceso.js
   solo cuando la dueña abre el panel (5 toques o 5 s sobre el logo, Ctrl + Shift + A o /#admin).
   Secciones (menú a la izquierda): Inicio, Productos, Textos de la página, Pedidos y Facturación.
   Usuario de Supabase Auth que figure en la tabla admins. */

const ICON = {
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  prod: '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/>',
  txt: '<path d="M4 6h16M4 12h10M4 18h13"/>',
  ord: '<path d="M7 4h10l3 4v12H4V8z"/><path d="M4 8h16"/><path d="M9 13h6M9 16h4"/>',
  bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  shop: '<path d="M4 9l2-5h12l2 5"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/>',
  out: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4"/><path d="M6 12h10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/>',
};
const ico = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

// el HTML del panel vive aquí para no cargarlo en la página de los visitantes
document.body.insertAdjacentHTML('beforeend', `
<div class="admin" id="admin" hidden role="dialog" aria-modal="true" aria-label="Panel de Reyna's">
  <div class="a-login" id="aLogin">
    <form class="a-card" id="aLoginForm">
      <img class="a-logo" src="${withV('/assets/img/logo.webp')}" alt="Reyna's Superfoods">
      <h2>Panel de Reyna's</h2>
      <p>Entra con tu correo y contraseña.</p>
      <label class="af">Correo<input class="a-in" id="aEmail" type="email" autocomplete="username" required></label>
      <label class="af" for="aPass">Contraseña</label>
      <div class="pw"><input class="a-in" id="aPass" type="password" autocomplete="current-password" required><button class="pw-eye" type="button" id="aEye" aria-label="Mostrar contraseña" aria-pressed="false" title="Mostrar contraseña">${ico('eye')}</button></div>
      <p class="a-err" id="aErr" role="alert"></p>
      <button class="btn pri big" type="submit">Entrar</button>
      <button class="btn ghost" type="button" data-aclose>Volver a la tienda</button>
    </form>
  </div>

  <div class="adm" id="aApp" hidden>
    <aside class="adm-side">
      <div class="adm-brand"><img src="${withV('/assets/img/logo.webp')}" alt=""><div><b>Panel de Reyna's</b><span id="aUser">Administración</span></div></div>
      <nav class="adm-nav" aria-label="Secciones del panel">
        <button type="button" data-view="home">${ico('home')}<span>Inicio</span></button>
        <button type="button" data-view="prod">${ico('prod')}<span>Productos</span><em id="cProd"></em></button>
        <button type="button" data-view="txt">${ico('txt')}<span>Textos de la página</span></button>
        <button type="button" data-view="ord">${ico('ord')}<span>Pedidos</span><em class="hot" id="cOrd"></em></button>
        <button type="button" data-view="bill">${ico('bill')}<span>Facturación</span></button>
      </nav>
      <div class="adm-foot">
        <button type="button" data-aclose>${ico('shop')}<span>Ver la tienda</span></button>
        <button type="button" id="aOut">${ico('out')}<span>Cerrar sesión</span></button>
      </div>
    </aside>

    <main class="adm-main">
      <header class="adm-head">
        <div><h1 id="vTitle">Inicio</h1><p id="vHelp"></p></div>
        <div class="adm-head-act" id="vAct"></div>
      </header>
      <p class="adm-msg" id="aMsg" role="status" aria-live="polite" hidden></p>

      <!-- INICIO -->
      <section id="vHome" data-v="home">
        <div class="stats">
          <button class="stat" type="button" data-go="prod"><span>Productos en la tienda</span><b id="sVis">–</b><small id="sHid"></small></button>
          <button class="stat" type="button" data-go="ord"><span>Pedidos este mes</span><b id="sNew">–</b><small id="sOrdAll"></small></button>
          <button class="stat" type="button" data-go="bill"><span>Boletas y facturas</span><b id="sInv">–</b><small id="sApi"></small></button>
        </div>
        <div class="box dash">
          <div class="box-h"><div><h3>¿Qué piden más tus clientes?</h3><p class="hint">Se arma solo con los pedidos que llegan por WhatsApp y con lo que la gente agrega al carrito en la página.</p></div>
            <div class="dseg" id="dRange" role="group" aria-label="Periodo"><button type="button" data-r="7">7 días</button><button type="button" data-r="30" class="on">30 días</button><button type="button" data-r="0">Todo</button></div></div>
          <div class="kpis" id="dKpis"></div>
          <div class="dgrid">
            <div class="dcol"><h4>Más pedidos por WhatsApp</h4><p class="hint">Unidades pedidas de cada producto.</p><ol class="rank" id="dTopOrd"></ol></div>
            <div class="dcol"><h4>Más agregados al carrito</h4><p class="hint">Veces que lo pusieron en el carrito, aunque no hayan enviado el pedido.</p><ol class="rank" id="dTopCart"></ol></div>
          </div>
          <div class="dgrid">
            <div class="dcol"><h4>Pedidos por día</h4><div class="days" id="dDays" role="img"></div></div>
            <div class="dcol"><h4>Categorías más pedidas</h4><ol class="rank cats" id="dCats"></ol></div>
          </div>
          <div class="dcol miss" id="dMissWrap" hidden><h4>Los ponen en el carrito pero casi no los piden</h4><p class="hint">Puede que el precio o la presentación no los convenza. Vale la pena preguntar.</p><ol class="rank" id="dMiss"></ol></div>
        </div>
        <div class="box">
          <h3>¿Qué hago en cada sección?</h3>
          <div class="guide">
            <button type="button" data-go="prod">${ico('prod')}<b>Productos</b><span>Agrega productos, cambia fotos, nombres y precios, o esconde lo que no tengas.</span></button>
            <button type="button" data-go="txt">${ico('txt')}<b>Textos de la página</b><span>Cambia lo que dice la página: títulos, misión, pasos para comprar…</span></button>
            <button type="button" data-go="ord">${ico('ord')}<b>Pedidos</b><span>El historial de todo lo que los clientes te enviaron por WhatsApp. Solo para mirar.</span></button>
            <button type="button" data-go="bill">${ico('bill')}<b>Facturación</b><span>Emite boletas y facturas. Puedes llenarlas con un pedido del historial.</span></button>
          </div>
        </div>
      </section>

      <!-- PRODUCTOS -->
      <section id="vProd" data-v="prod" hidden>
        <div class="bar">
          <label class="srch">${ico('search')}<input id="aQ" type="search" placeholder="Buscar un producto…" aria-label="Buscar producto"></label>
          <button class="btn pri" type="button" id="aAdd">${ico('plus')}Agregar producto</button>
        </div>
        <div class="chips" id="aCats" role="group" aria-label="Categorías"></div>
        <div id="aList"></div>
      </section>

      <!-- TEXTOS -->
      <section id="vTxt" data-v="txt" hidden>
        <div class="tx">
          <nav class="tx-nav" id="tNav" aria-label="Partes de la página"></nav>
          <div class="tx-pane">
            <label class="srch">${ico('search')}<input id="tQ" type="search" placeholder="Buscar una palabra en la página…" aria-label="Buscar texto"></label>
            <div id="tList"></div>
          </div>
        </div>
        <div class="savebar" id="tBar" hidden>
          <span id="tBarMsg">Tienes cambios sin guardar</span>
          <button class="btn ghost" type="button" id="tUndo">Descartar</button>
          <button class="btn pri" type="button" id="tSave">Guardar cambios</button>
        </div>
      </section>

      <!-- PEDIDOS -->
      <section id="vOrd" data-v="ord" hidden>
        <div class="anote">${ico('wa')}<p>Cada vez que un cliente toca <b>“Enviar pedido por WhatsApp”</b>, el mensaje llega a tu WhatsApp y aquí se guarda una copia. Cada pedido tiene un <b>código</b> (por ejemplo R-7K2Q) que también aparece en el mensaje, para que sepas qué chat es de qué pedido. Esta sección es solo un historial para revisar: los pagos se conversan por WhatsApp.</p></div>
        <div class="bar">
          <label class="srch">${ico('search')}<input id="oQ" type="search" placeholder="Buscar por nombre o código…" aria-label="Buscar pedido"></label>
        </div>
        <div class="chips" id="oFil" role="group" aria-label="Fecha del pedido"></div>
        <div id="oList"></div>
      </section>

      <!-- FACTURACIÓN -->
      <section id="vBill" data-v="bill" hidden>
        <div class="box api" id="bApi"></div>
        <div class="box">
          <h3>Así se emite una boleta</h3>
          <ol class="steps3">
            <li><b>1</b><span>El cliente te escribe por WhatsApp y te paga.</span></li>
            <li><b>2</b><span>Aquí toca <b>“Nueva boleta”</b> y elige su pedido por el código (R-…) para llenarla sola.</span></li>
            <li><b>3</b><span>Revisa los datos y toca <b>“Emitir boleta”</b>. Aparece aquí con su PDF.</span></li>
          </ol>
        </div>
        <div class="box">
          <div class="box-h"><h3>Comprobantes emitidos</h3><button class="btn sec" type="button" id="bNew">${ico('plus')}Nueva boleta</button></div>
          <div id="bList"></div>
        </div>
        <form class="box" id="bCfg">
          <h3>Datos de tu empresa</h3>
          <p class="hint">Salen impresos en cada boleta y factura. Pídeselos a tu contador si no los tienes a la mano.</p>
          <div class="grid2">
            <label class="af">RUC<input class="a-in" id="cRuc" inputmode="numeric" maxlength="11" placeholder="20xxxxxxxxx"></label>
            <label class="af">Razón social<input class="a-in" id="cRs" placeholder="REYNA'S SUPERFOODS S.A.C."></label>
            <label class="af span2">Dirección fiscal<input class="a-in" id="cDir" placeholder="Av. …, Lima"></label>
            <label class="af">Serie de boletas<input class="a-in" id="cSb" maxlength="4" placeholder="B002"></label>
            <label class="af">Serie de facturas<input class="a-in" id="cSf" maxlength="4" placeholder="F002"></label>
            <label class="af">IGV de tus productos<select class="a-in" id="cIgv"><option value="gravado">Con IGV (18 %) incluido en el precio</option><option value="exonerado">Exonerado de IGV</option></select></label>
            <label class="af">Modo<select class="a-in" id="cAmb"><option value="pruebas">Pruebas (no se envía a SUNAT)</option><option value="produccion">Real (se envía a SUNAT)</option></select></label>
          </div>
          <div class="row-end"><span class="a-err" id="cMsg" role="status"></span><button class="btn pri" type="submit">Guardar datos</button></div>
        </form>
      </section>
    </main>
  </div>

  <!-- Formulario de producto (panel lateral) -->
  <div class="drawer-a" id="aForm" hidden>
    <div class="scrim-a" data-fclose></div>
    <form class="panel-a" id="pForm">
      <div class="panel-h"><h2 id="aFormT">Nuevo producto</h2><button class="x-a" type="button" data-fclose aria-label="Cerrar">${ico('x')}</button></div>
      <div class="panel-b">
        <div class="photo">
          <img id="pImgPrev" alt="Foto del producto">
          <div><label class="btn sec">Cambiar foto<input id="pImg" type="file" accept="image/*" hidden></label>
          <button class="btn ghost" type="button" id="pImgClear">Quitar foto</button>
          <p class="hint">Mejor una foto cuadrada con fondo blanco.</p></div>
        </div>
        <label class="af">Nombre<input class="a-in" id="pName" required placeholder="Ej.: Maca negra"></label>
        <label class="af">Categoría<select class="a-in" id="pGroup"></select></label>
        <label class="af" id="pNewWrap" hidden>Nombre de la nueva categoría<input class="a-in" id="pNew" placeholder="Ej.: Condimentos en polvo"></label>
        <div class="grid2">
          <label class="af">Presentación<input class="a-in" id="pSize" placeholder="Ej.: Saco de 25 kg"><small>Cómo se vende.</small></label>
          <label class="af">Precio (S/)<input class="a-in" id="pPrice" inputmode="decimal" placeholder="Ej.: 18.50"><small>Apenas lo escribas, se ve en la tienda. Vacío = no se muestra precio.</small></label>
        </div>
        <label class="af">Descripción<textarea class="a-in" id="pDesc" rows="3" placeholder="Qué incluye, para qué sirve…"></textarea><small>Se ve en la ficha del producto y en los packs.</small></label>
        <label class="chk"><input type="checkbox" id="pVis" checked><span>Que se vea en la tienda</span></label>
        <p class="a-err" id="pErr" role="alert"></p>
      </div>
      <div class="panel-f"><button class="btn ghost" type="button" data-fclose>Cancelar</button><button class="btn pri" type="submit">Guardar producto</button></div>
    </form>
  </div>

  <!-- Emitir boleta o factura -->
  <div class="drawer-a" id="bModal" hidden>
    <div class="scrim-a" data-bclose></div>
    <form class="panel-a wide" id="bForm">
      <div class="panel-h"><h2 id="bTitle">Emitir comprobante</h2><button class="x-a" type="button" data-bclose aria-label="Cerrar">${ico('x')}</button></div>
      <div class="panel-b">
        <div class="seg" role="radiogroup" aria-label="Tipo de comprobante">
          <label><input type="radio" name="bType" value="boleta" checked><span>Boleta<small>Para personas</small></span></label>
          <label><input type="radio" name="bType" value="factura"><span>Factura<small>Para empresas con RUC</small></span></label>
        </div>
        <label class="af">Llenar con un pedido del historial<select class="a-in" id="bFrom"></select><small>Opcional. Copia los productos y el nombre del pedido que elijas.</small></label>
        <h3 class="sub">Datos del cliente</h3>
        <div class="grid2">
          <label class="af">Documento<select class="a-in" id="bDocT"></select></label>
          <label class="af">Número<input class="a-in" id="bDoc" inputmode="numeric" maxlength="11"></label>
          <label class="af span2"><span id="bNameL">Nombre completo</span><input class="a-in" id="bName"></label>
          <label class="af span2" id="bAddrW" hidden>Dirección fiscal<input class="a-in" id="bAddr"></label>
        </div>
        <h3 class="sub">Productos</h3>
        <div class="lines-a" id="bLines"></div>
        <button class="btn ghost" type="button" id="bAddL">${ico('plus')}Agregar otra línea</button>
        <div class="tot-a" id="bTot"></div>
        <p class="a-err" id="bErr" role="alert"></p>
      </div>
      <div class="panel-f"><button class="btn ghost" type="button" data-bclose>Cancelar</button><button class="btn pri" type="submit" id="bGo">Emitir</button></div>
    </form>
  </div>
</div>
`);

const admin = $('#admin'), aLogin = $('#aLogin'), aApp = $('#aApp'), aForm = $('#aForm'), bModal = $('#bModal');
const aList = $('#aList'), aQ = $('#aQ');
let editing = null, formImg = '', aProducts = [], aOrders = [], aInvoices = [], billing = {}, apiReady = null;
let view = 'home', catSel = 'Todas', ordSel = 'todos', txtSel = null, aCart = [], dRange = 30;
const aById = id => aProducts.find(p => p.id === id);
const CAT_C = { [G.andinos]:'#D39F78', [G.granos]:'#E8B85C', [G.raices]:'#E58EA4', [G.hierbas]:'#7FBF6E', [G.extractos]:'#A98BD0', [G.packs]:'#6DBFB8' };
const catColor = g => CAT_C[g] || '#B9B1A0';
const fmtDate = new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
let msgT;
function aMsg(t, kind = 'ok'){
  const m = $('#aMsg'); clearTimeout(msgT);
  if (!t){ m.hidden = true; return; }
  m.textContent = t; m.className = 'adm-msg ' + kind; m.hidden = false;
  if (kind !== 'err') msgT = setTimeout(() => { m.hidden = true; }, 4500);
}
async function isAdminUser(){ try { return (await sb('/rest/v1/admins?select=user_id', { auth:true })).length > 0; } catch { return false; } }

/* ---------- abrir / cerrar / sesión ---------- */
async function adminOpen(){
  touch(); admin.hidden = false; document.body.style.overflow = 'hidden';
  const ok = !!session && await isAdminUser();
  aLogin.hidden = ok; aApp.hidden = !ok;
  if (ok) renderAdmin(); else { $('#aPass').value = ''; $('#aErr').textContent = ''; setTimeout(() => $('#aEmail').focus(), 30); }
}
function adminClose(){
  admin.hidden = true; aForm.hidden = true; bModal.hidden = true; document.body.style.overflow = ''; touch();
  if (location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search);
  loadCatalog().then(renderAll).catch(() => {});
}
function setEye(show){
  const i = $('#aPass'), b = $('#aEye'); i.type = show ? 'text' : 'password';
  b.innerHTML = ico(show ? 'eyeoff' : 'eye'); b.setAttribute('aria-pressed', String(show));
  b.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña'); b.title = b.getAttribute('aria-label');
}
$('#aEye').addEventListener('click', () => { setEye($('#aPass').type === 'password'); $('#aPass').focus(); });
$('#aLoginForm').addEventListener('submit', async e => {
  e.preventDefault(); $('#aErr').textContent = 'Entrando…';
  try {
    const r = await fetch(SB.supabaseUrl + '/auth/v1/token?grant_type=password', { method:'POST', headers:{ apikey: SB.supabaseKey, 'Content-Type':'application/json' }, body: JSON.stringify({ email: $('#aEmail').value.trim(), password: $('#aPass').value }) });
    if (!r.ok) throw new Error('auth');
    const s = await r.json(); keepSession(s);
    if (!(await isAdminUser())){ dropSession(); $('#aErr').textContent = 'Esta cuenta no tiene permiso para administrar la tienda.'; return; }
    try { localStorage.setItem('reynas.adminEmail', s.user?.email || ''); } catch {}
    $('#aErr').textContent = ''; $('#aPass').value = ''; setEye(false);
    aLogin.hidden = true; aApp.hidden = false; renderAdmin();
  } catch { $('#aErr').textContent = 'Correo o contraseña incorrectos.'; $('#aPass').select(); }
});
$('#aOut').addEventListener('click', () => {
  if (session) fetch(SB.supabaseUrl + '/auth/v1/logout', { method:'POST', headers:{ apikey: SB.supabaseKey, Authorization: 'Bearer ' + session.access_token } }).catch(() => {});
  dropSession(); adminClose();
});
admin.querySelectorAll('[data-aclose]').forEach(b => b.addEventListener('click', adminClose));
// Escape cierra primero el formulario de boleta (el de producto lo cierra portada.js)
admin.addEventListener('keydown', e => { if (e.key === 'Escape' && !bModal.hidden){ e.stopPropagation(); bModal.hidden = true; } });

/* ---------- navegación ---------- */
const VIEWS = {
  home: ['Inicio', 'Un resumen de tu tienda. Toca cualquier cuadro para ir a esa sección.'],
  prod: ['Productos', 'Todo lo que se vende en la tienda, ordenado por categoría. Toca “Editar” para cambiar foto, nombre o precio.'],
  txt: ['Textos de la página', 'Elige a la izquierda la parte de la página, cambia lo que quieras y toca “Guardar cambios”. El diseño no cambia.'],
  ord: ['Pedidos', 'El historial de pedidos que los clientes te enviaron por WhatsApp desde la tienda.'],
  bill: ['Facturación', 'Boletas y facturas electrónicas de tus ventas.'],
};
function aGo(v){
  view = v;
  admin.querySelectorAll('.adm-nav [data-view]').forEach(b => b.toggleAttribute('aria-current', b.dataset.view === v));
  admin.querySelectorAll('[data-v]').forEach(s => { s.hidden = s.dataset.v !== v; });
  $('#vTitle').textContent = VIEWS[v][0]; $('#vHelp').textContent = VIEWS[v][1];
  if (v === 'txt') renderTexts();
  if (v === 'bill') renderBilling();
  admin.querySelector('.adm-main').scrollTop = 0;
}
admin.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => aGo(b.dataset.view)));
admin.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => aGo(b.dataset.go)));

async function renderAdmin(){
  try { const em = localStorage.getItem('reynas.adminEmail'); if (em) $('#aUser').textContent = em; } catch {}
  aGo(view);
  try {
    const [rows, os, st, inv, ce] = await Promise.all([
      sb('/rest/v1/products?select=*&order=sort.asc,name.asc', { auth:true }),
      sb('/rest/v1/orders?select=*&order=created_at.desc&limit=500', { auth:true }),
      sb('/rest/v1/settings?select=key,value'),
      sb('/rest/v1/invoices?select=*&order=created_at.desc&limit=500', { auth:true }).catch(() => []),
      sb('/rest/v1/cart_events?select=created_at,product_name,qty&order=created_at.desc&limit=5000', { auth:true }).catch(() => [])
    ]);
    aProducts = rows.map(r => fromRow(r, true)); aOrders = os; aInvoices = inv; aCart = ce;
    billing = (st.find(s => s.key === 'billing') || {}).value || {};
  } catch (err) { aMsg('No se pudo cargar el panel: ' + err.message, 'err'); }
  renderAll_();
  checkApi();
}
function renderAll_(){ renderHome(); aRenderCats(); renderProducts(); renderOrders(); if (view === 'bill') renderBilling(); if (view === 'txt') renderTexts(); }

/* ---------- inicio ---------- */
const DAY = 864e5;
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const inRange = (iso, days) => !days || new Date(iso) >= new Date(startOfDay(Date.now()) - (days - 1) * DAY);
const groupOfName = name => { const n = norm(name); const p = aProducts.find(x => norm(fullName(x)) === n || norm(x.name) === n); return p ? p.group : null; };
function tally(rows){ const m = new Map(); rows.forEach(([k, q]) => m.set(k, (m.get(k) || 0) + q)); return [...m].sort((a, b) => b[1] - a[1]); }
const rankHTML = (list, unit, empty, max = 8) => {
  if (!list.length) return `<li class="none">${empty}</li>`;
  const top = list[0][1];
  return list.slice(0, max).map(([k, v], i) => `<li><span class="rk">${i + 1}</span><div><p><b>${esc(k)}</b><em>${v} ${v === 1 ? unit[0] : unit[1]}</em></p><i style="--w:${Math.max(4, Math.round(v / top * 100))}%"></i></div></li>`).join('');
};
function renderDash(){
  const os = aOrders.filter(o => o.status !== 'anulado' && inRange(o.created_at, dRange));
  const ce = aCart.filter(c => inRange(c.created_at, dRange));
  const ordRows = os.flatMap(o => (o.items || []).map(i => [i.name, Number(i.qty) || 1]));
  const topOrd = tally(ordRows), topCart = tally(ce.map(c => [c.product_name, c.qty || 1]));
  const units = ordRows.reduce((s, r) => s + r[1], 0), adds = ce.reduce((s, c) => s + (c.qty || 1), 0);
  const cats = tally(ordRows.map(([n, q]) => [groupOfName(n) || 'Otros', q]));
  const lbl = dRange ? `en los últimos ${dRange} días` : 'desde el inicio';
  $('#dKpis').innerHTML = [
    ['Pedidos recibidos', os.length, lbl],
    ['Productos pedidos', units, 'unidades en esos pedidos'],
    ['Agregados al carrito', adds, 'veces que tocaron “Agregar”'],
    ['Más pedido', topOrd[0] ? topOrd[0][0] : '—', topOrd[0] ? `${topOrd[0][1]} unidades` : 'Aún sin pedidos', 'txt']
  ].map(([l, v, s, c]) => `<div class="kpi${c ? ' t' : ''}"><span>${l}</span><b>${esc(v)}</b><small>${esc(s)}</small></div>`).join('');
  $('#dTopOrd').innerHTML = rankHTML(topOrd, ['unidad', 'unidades'], 'Todavía no llegan pedidos en este periodo.');
  $('#dTopCart').innerHTML = rankHTML(topCart, ['vez', 'veces'], 'Todavía no hay productos agregados al carrito en este periodo. Se empieza a contar desde hoy.');
  $('#dCats').innerHTML = rankHTML(cats, ['unidad', 'unidades'], 'Sin pedidos en este periodo.', 6);
  // pedidos por día (máx. 30 barras)
  const n = Math.min(dRange || 30, 30), today = startOfDay(Date.now());
  const days = Array.from({ length: n }, (_, i) => { const d = new Date(today - (n - 1 - i) * DAY); return { d, c: aOrders.filter(o => o.status !== 'anulado' && startOfDay(o.created_at).getTime() === d.getTime()).length }; });
  const mx = Math.max(1, ...days.map(x => x.c)), fmtD = new Intl.DateTimeFormat('es-PE', { day:'numeric', month:'short' });
  $('#dDays').setAttribute('aria-label', `Pedidos por día en los últimos ${n} días`);
  $('#dDays').innerHTML = `<div class="bars">${days.map(x => `<span title="${fmtD.format(x.d)}: ${x.c} ${x.c === 1 ? 'pedido' : 'pedidos'}" style="--h:${x.c ? Math.max(6, Math.round(x.c / mx * 100)) : 0}%"><i></i>${x.c ? `<b>${x.c}</b>` : ''}</span>`).join('')}</div><div class="ax"><span>${fmtD.format(days[0].d)}</span><span>Hoy</span></div>`;
  // en carrito pero poco pedidos
  const ordMap = new Map(topOrd), miss = topCart.filter(([k, v]) => v >= 3 && (ordMap.get(k) || 0) < v / 3).map(([k, v]) => [k, v]);
  $('#dMissWrap').hidden = !miss.length;
  $('#dMiss').innerHTML = rankHTML(miss, ['vez en carrito', 'veces en carrito'], '', 5);
}
$('#dRange').addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; dRange = Number(b.dataset.r); $('#dRange').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); renderDash(); });
function renderHome(){
  const vis = aProducts.filter(p => !p.hidden).length, hid = aProducts.length - vis;
  const mes = aOrders.filter(o => { const d = new Date(o.created_at), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  const hoy = aOrders.filter(o => inRange(o.created_at, 1)).length;
  $('#sVis').textContent = vis; $('#sHid').textContent = hid ? `${hid} escondidos` : 'Ninguno escondido';
  $('#sNew').textContent = mes; $('#sOrdAll').textContent = `${hoy ? hoy + ' hoy · ' : ''}${aOrders.length} en total`;
  $('#sInv').textContent = aInvoices.filter(i => i.status === 'aceptado').length;
  $('#sApi').textContent = apiReady ? 'Facturación conectada' : 'Esperando el acceso a la API';
  $('#cProd').textContent = aProducts.length || '';
  $('#cOrd').textContent = hoy || '';
  $('#cOrd').title = hoy ? `${hoy} pedidos hoy` : '';
  renderDash();
}

/* ---------- productos ---------- */
const aGroups = () => [...new Set([...BASE_GROUPS, ...aProducts.map(p => p.group)])];
function aRenderCats(){
  const gs = aGroups().filter(g => aProducts.some(p => p.group === g));
  const chip = (g, n, c) => `<button type="button" class="chip-a${catSel === g ? ' on' : ''}" data-cat="${esc(g)}"${c ? ` style="--c:${c}"` : ''}>${c ? '<i></i>' : ''}${esc(g)} <small>${n}</small></button>`;
  $('#aCats').innerHTML = chip('Todas', aProducts.length) + gs.map(g => chip(g, aProducts.filter(p => p.group === g).length, catColor(g))).join('');
}
$('#aCats').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; catSel = b.dataset.cat; aRenderCats(); renderProducts(); });
const aCardHTML = p => `<article class="pc${p.hidden ? ' off' : ''}" data-id="${p.id}">
  <div class="pc-img"><img src="${imgSrc(p)}" alt="" loading="lazy">${p.hidden ? '<span class="badge">Escondido</span>' : ''}${p.example ? '<span class="badge alt">Ejemplo</span>' : ''}</div>
  <div class="pc-bd">
    <span class="pcat" style="--c:${catColor(p.group)}"><i></i>${esc(p.group)}</span>
    <h3>${esc(p.name)}</h3>
    <dl><div><dt>Presentación</dt><dd>${p.size ? esc(p.size) : '<span class="muted">Sin definir</span>'}</dd></div>
    <div><dt>Precio</dt><dd>${p.price !== '' ? money(p.price) : '<span class="muted">Sin precio (no se muestra)</span>'}</dd></div></dl>
  </div>
  <div class="pc-act">
    <button class="btn pri sm" type="button" data-act="edit">Editar</button>
    <button class="btn sec sm" type="button" data-act="hide">${p.hidden ? 'Mostrar' : 'Esconder'}</button>
    <button class="btn icon dan" type="button" data-act="del" aria-label="Eliminar ${esc(p.name)}" title="Eliminar">${ico('trash')}</button>
  </div>
</article>`;
function renderProducts(){
  const term = norm(aQ.value.trim());
  const rows = aProducts.filter(p => (catSel === 'Todas' || p.group === catSel) && (!term || norm(p.name + ' ' + p.group).includes(term)));
  if (!rows.length){ aList.innerHTML = '<p class="aempty">No hay productos con esa búsqueda.</p>'; return; }
  const groups = catSel === 'Todas' ? aGroups().filter(g => rows.some(p => p.group === g)) : [catSel];
  aList.innerHTML = groups.map(g => {
    const list = rows.filter(p => p.group === g);
    return `<section class="pgroup"><h2 class="gh" style="--c:${catColor(g)}"><i></i>${esc(g)} <small>${list.length} ${list.length === 1 ? 'producto' : 'productos'}</small></h2><div class="pgrid-a">${list.map(aCardHTML).join('')}</div></section>`;
  }).join('');
}
aList.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const p = aById(b.closest('[data-id]').dataset.id); if (!p) return;
  if (b.dataset.act === 'edit') return openForm(p);
  try {
    if (b.dataset.act === 'hide'){
      await sb(`/rest/v1/products?id=eq.${p.id}`, { method:'PATCH', auth:true, body:{ active: p.hidden } });
      p.hidden = !p.hidden; renderProducts(); renderHome(); aMsg(p.hidden ? `“${p.name}” quedó escondido: ya no se ve en la tienda.` : `“${p.name}” ya se ve en la tienda.`);
    }
    if (b.dataset.act === 'del' && confirm(`¿Eliminar "${p.name}"?\n\nSe borra para siempre. Si solo quieres que no se vea, usa “Esconder”.`)){
      await sb(`/rest/v1/products?id=eq.${p.id}`, { method:'DELETE', auth:true });
      delete cart[p.id]; saveC(); aProducts = aProducts.filter(x => x !== p); aRenderCats(); renderProducts(); renderHome(); aMsg(`“${p.name}” se eliminó.`);
    }
  } catch (err) { aMsg('No se pudo guardar: ' + err.message, 'err'); }
});
aQ.addEventListener('input', renderProducts);

function fillGroupSelect(){
  $('#pGroup').innerHTML = aGroups().map(g => `<option>${esc(g)}</option>`).join('') + '<option value="__new">+ Nueva categoría…</option>';
}
function setFormImg(v){ formImg = v; $('#pImgPrev').src = v ? imgSrc({img:v}) : PLACEHOLDER; }
function openForm(p){
  editing = p || null; fillGroupSelect();
  $('#aFormT').textContent = p ? 'Editar producto' : 'Nuevo producto';
  $('#pName').value = p ? p.name : '';
  $('#pGroup').value = p ? p.group : (catSel !== 'Todas' ? catSel : G.andinos);
  $('#pSize').value = p ? p.size : '';
  $('#pPrice').value = p ? p.price : '';
  $('#pDesc').value = p ? p.desc : '';
  $('#pVis').checked = p ? !p.hidden : true;
  $('#pImg').value = ''; setFormImg(p ? p.img : '');
  $('#pNew').value = ''; $('#pNewWrap').hidden = true; $('#pErr').textContent = '';
  aForm.hidden = false; setTimeout(() => $('#pName').focus(), 30);
}
aForm.querySelectorAll('[data-fclose]').forEach(b => b.addEventListener('click', () => { aForm.hidden = true; editing = null; }));
// la foto se reduce a 800×800 (cuadrada, fondo blanco) antes de subirla
$('#pImg').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => {
    const S = 800, c = document.createElement('canvas'); c.width = S; c.height = S;
    const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, S, S);
    const s = Math.min(S / im.width, S / im.height), w = im.width * s, h = im.height * s;
    x.drawImage(im, (S - w) / 2, (S - h) / 2, w, h);
    let d = c.toDataURL('image/webp', 0.82); if (!d.startsWith('data:image/webp')) d = c.toDataURL('image/jpeg', 0.85);
    setFormImg(d); URL.revokeObjectURL(url);
  };
  im.onerror = () => { $('#pErr').textContent = 'No se pudo leer esa imagen. Prueba con otra foto (JPG o PNG).'; URL.revokeObjectURL(url); };
  im.src = url;
});
$('#pImgClear').addEventListener('click', () => { $('#pImg').value = ''; setFormImg(''); });
$('#pGroup').addEventListener('change', e => { $('#pNewWrap').hidden = e.target.value !== '__new'; if (e.target.value === '__new') $('#pNew').focus(); });
$('#aAdd').addEventListener('click', () => openForm(null));
$('#pForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('#pName').value.trim();
  let group = $('#pGroup').value; if (group === '__new') group = $('#pNew').value.trim();
  const priceRaw = $('#pPrice').value.trim().replace(',', '.');
  if (!name){ $('#pErr').textContent = 'Escribe el nombre del producto.'; $('#pName').focus(); return; }
  if (!group){ $('#pErr').textContent = 'Escribe el nombre de la nueva categoría.'; $('#pNew').focus(); return; }
  if (priceRaw !== '' && !(Number(priceRaw) >= 0)){ $('#pErr').textContent = 'El precio debe ser un número, por ejemplo 18.50'; $('#pPrice').focus(); return; }
  const btn = $('#pForm [type="submit"]'); btn.disabled = true; $('#pErr').textContent = 'Guardando…';
  try {
    let img = formImg;
    if (img.startsWith('data:')){
      const blob = await (await fetch(img)).blob();
      const path = `${uid()}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`;
      await sb(`/storage/v1/object/productos/${path}`, { method:'POST', auth:true, raw:true, body: blob, headers:{ 'Content-Type': blob.type, 'x-upsert':'true' } });
      img = `${SB.supabaseUrl}/storage/v1/object/public/productos/${path}`;
    }
    const row = { name, category: group, image_url: img || null, unit: $('#pSize').value.trim() || null, price: priceRaw === '' ? null : Number(priceRaw), description: $('#pDesc').value.trim() || null, active: $('#pVis').checked, show_price: true };
    if (editing) await sb(`/rest/v1/products?id=eq.${editing.id}`, { method:'PATCH', auth:true, body: row });
    else await sb('/rest/v1/products', { method:'POST', auth:true, prefer:'return=minimal', body: { ...row, sort: 999 } });
    $('#pErr').textContent = ''; aForm.hidden = true; editing = null;
    aProducts = (await sb('/rest/v1/products?select=*&order=sort.asc,name.asc', { auth:true })).map(r => fromRow(r, true));
    aRenderCats(); renderProducts(); renderHome(); aMsg(`“${name}” se guardó. Ya se ve en la tienda.`);
  } catch (err) { $('#pErr').textContent = 'No se pudo guardar: ' + err.message; }
  finally { btn.disabled = false; }
});

/* ---------- textos de la página ---------- */
const TXT_WHERE = {
  hero: 'La pantalla grande de colores que se ve al abrir la página.',
  cinta1: 'La franja verde con palabras que se mueve, debajo de la portada.',
  tienda: 'El título que está encima del catálogo de productos.',
  packs: 'La sección amarilla de packs y combos.',
  dest: 'La sección café de la maca destacada.',
  val: 'Las 4 tarjetas con dibujitos (Natural, Saludable, Nutritivo, Sostenible).',
  mv: 'Las tarjetas de misión y visión.',
  pres: 'Las tarjetas del tambor, el saco y el doypack.',
  may: 'El recuadro verde grande de venta por mayor.',
  pasos: 'Los 3 pasos para comprar.',
  pedido: 'Donde el cliente revisa su pedido antes de enviarlo.',
  cinta2: 'La franja amarilla que se mueve, arriba del pie de página.',
  pie: 'La parte de abajo de la página, en verde oscuro.',
};
const tList = $('#tList'), tDraft = {};
const tKeys = () => [...new Set([...document.querySelectorAll('[data-edit]')].filter(el => !el.closest('#admin')).map(el => el.dataset.edit))];
const tDef = k => document.querySelector(`[data-edit="${k}"]`).dataset.def;
const tSaved = k => siteTexts[k] ?? tDef(k);
const tCur = k => k in tDraft ? tDraft[k] : tSaved(k);
const tGroups = () => Object.keys(TXT_GROUPS).filter(g => tKeys().some(k => k.startsWith(g + '.')));
function renderTexts(){
  const gs = tGroups(); if (!txtSel || !gs.includes(txtSel)) txtSel = gs[0];
  const edited = g => tKeys().filter(k => k.startsWith(g + '.') && (siteTexts[k] != null || k in tDraft)).length;
  $('#tNav').innerHTML = gs.map(g => `<button type="button" data-tg="${g}"${g === txtSel && !$('#tQ').value ? ' aria-current="true"' : ''}><span>${esc(TXT_GROUPS[g])}</span>${edited(g) ? `<em title="Textos cambiados">${edited(g)}</em>` : ''}</button>`).join('');
  const q = norm($('#tQ').value.trim());
  const keys = tKeys().filter(k => q ? norm(txtLabel(k) + ' ' + tCur(k) + ' ' + TXT_GROUPS[k.split('.')[0]]).includes(q) : k.startsWith(txtSel + '.'));
  const field = k => {
    const v = tCur(k), long = tDef(k).length > 60, changed = tSaved(k) !== tDef(k) || k in tDraft;
    return `<div class="tf" data-k="${k}">
      <label for="t_${k.replace('.', '_')}">${esc(txtLabel(k))}${q ? ` <small>· ${esc(TXT_GROUPS[k.split('.')[0]])}</small>` : ''}</label>
      ${long ? `<textarea class="a-in" id="t_${k.replace('.', '_')}" rows="3" maxlength="2000">${esc(v)}</textarea>` : `<input class="a-in" id="t_${k.replace('.', '_')}" maxlength="300" value="${esc(v)}">`}
      ${changed ? `<button class="lnk" type="button" data-trestore>Volver al texto original</button>` : ''}
    </div>`;
  };
  tList.innerHTML = q
    ? (keys.length ? `<div class="box">${keys.map(field).join('')}</div>` : '<p class="aempty">No encontramos esa palabra en la página.</p>')
    : `<div class="box"><div class="box-h"><div><h3>${esc(TXT_GROUPS[txtSel])}</h3><p class="hint">Dónde está: ${esc(TXT_WHERE[txtSel] || '')}</p></div><button class="btn sec sm" type="button" data-tshow>${ico('eye')}Ver en la página</button></div>${keys.map(field).join('')}</div>`;
  const n = Object.keys(tDraft).length;
  $('#tBar').hidden = !n; $('#tBarMsg').textContent = n === 1 ? 'Tienes 1 cambio sin guardar' : `Tienes ${n} cambios sin guardar`;
}
$('#tNav').addEventListener('click', e => { const b = e.target.closest('[data-tg]'); if (!b) return; txtSel = b.dataset.tg; $('#tQ').value = ''; renderTexts(); });
tList.addEventListener('input', e => {
  const row = e.target.closest('[data-k]'); if (!row) return;
  tDraft[row.dataset.k] = e.target.value;
  const n = Object.keys(tDraft).length; $('#tBar').hidden = false; $('#tBarMsg').textContent = n === 1 ? 'Tienes 1 cambio sin guardar' : `Tienes ${n} cambios sin guardar`;
});
tList.addEventListener('click', e => {
  if (e.target.closest('[data-trestore]')){ const k = e.target.closest('[data-k]').dataset.k; tDraft[k] = tDef(k); renderTexts(); return; }
  if (e.target.closest('[data-tshow]')){
    const el = document.querySelector(`[data-edit^="${txtSel}."]`); adminClose();
    if (el){ setTimeout(() => { el.scrollIntoView({ behavior:'smooth', block:'center' }); el.classList.add('flash-edit'); setTimeout(() => el.classList.remove('flash-edit'), 2600); }, 250); }
  }
});
$('#tQ').addEventListener('input', renderTexts);
$('#tUndo').addEventListener('click', () => { Object.keys(tDraft).forEach(k => delete tDraft[k]); renderTexts(); });
$('#tSave').addEventListener('click', async () => {
  const keys = Object.keys(tDraft); if (!keys.length) return;
  const up = [], del = [];
  for (const k of keys){ const v = tDraft[k].trim(); if (!v || v === tDef(k)) del.push(k); else up.push({ key: k, value: v }); }
  $('#tSave').disabled = true; $('#tBarMsg').textContent = 'Guardando…';
  try {
    if (up.length) await sb('/rest/v1/site_texts?on_conflict=key', { method:'POST', auth:true, prefer:'resolution=merge-duplicates,return=minimal', body: up });
    if (del.length) await sb(`/rest/v1/site_texts?key=in.${encodeURIComponent('(' + del.map(k => `"${k}"`).join(',') + ')')}`, { method:'DELETE', auth:true });
    up.forEach(r => { siteTexts[r.key] = r.value; }); del.forEach(k => { delete siteTexts[k]; });
    keys.forEach(k => delete tDraft[k]);
    applyTexts(); renderTexts(); aMsg(keys.length === 1 ? 'Listo: se guardó 1 texto. Ya se ve en la página.' : `Listo: se guardaron ${keys.length} textos. Ya se ven en la página.`);
  } catch (err) { aMsg('No se pudo guardar: ' + err.message, 'err'); renderTexts(); }
  finally { $('#tSave').disabled = false; }
});

/* ---------- pedidos (historial de WhatsApp) ---------- */
const FIL = [['todos','Todos', 0], ['hoy','Hoy', 1], ['sem','Últimos 7 días', 7], ['mes','Últimos 30 días', 30]];
const filDays = k => (FIL.find(f => f[0] === k) || FIL[0])[2];
const orderTotal = o => { const it = o.items || []; return it.length && it.every(i => i.price !== '' && i.price != null) ? it.reduce((s, i) => s + Number(i.price) * (i.qty || 1), 0) : null; };
const oCode = o => o.code || ('#' + o.id);
const orderMsg = o => [`Pedido ${oCode(o)}`, ...(o.items || []).map(i => `• ${i.qty || 1} × ${i.name}${i.size ? ' (' + i.size + ')' : ''}`), o.customer_name ? `Nombre: ${o.customer_name}` : '', o.customer_city ? `Envío a: ${o.customer_city}` : '', o.customer_note ? `Nota: ${o.customer_note}` : ''].filter(Boolean).join('\n');
function renderOrders(){
  $('#oFil').innerHTML = FIL.map(([k, l, d]) => `<button type="button" class="chip-a${ordSel === k ? ' on' : ''}" data-of="${k}">${l} <small>${aOrders.filter(o => inRange(o.created_at, d)).length}</small></button>`).join('');
  const q = norm($('#oQ').value.trim());
  const list = aOrders.filter(o => inRange(o.created_at, filDays(ordSel)) && (!q || norm(`${o.customer_name || ''} ${oCode(o)} ${o.customer_city || ''}`).includes(q)));
  const box = $('#oList');
  if (!aOrders.length){ box.innerHTML = '<div class="box empty-box"><h3>Todavía no hay pedidos</h3><p>Cuando un cliente envíe su pedido por WhatsApp desde la tienda, aparecerá aquí.</p></div>'; return; }
  if (!list.length){ box.innerHTML = '<p class="aempty">No hay pedidos en esas fechas.</p>'; return; }
  box.innerHTML = list.map(o => {
    const t = orderTotal(o), inv = aInvoices.find(i => i.order_id === o.id && i.status === 'aceptado');
    return `<article class="oc" data-id="${o.id}">
      <header>
        <div><span class="code">${esc(oCode(o))}</span><b>${o.customer_name ? esc(o.customer_name) : 'Cliente sin nombre'}</b><span class="meta">${fmtDate.format(new Date(o.created_at))}${o.customer_city ? ' · ' + esc(o.customer_city) : ''}</span></div>
        <span class="oitems">${(o.items || []).reduce((s, i) => s + (Number(i.qty) || 1), 0)} productos</span>
      </header>
      <ul>${(o.items || []).map(i => `<li><span>${i.qty || 1} ×</span> ${esc(i.name)}${i.size ? ` <em>(${esc(i.size)})</em>` : ''}${i.price !== '' && i.price != null ? `<b>${money(i.price * (i.qty || 1))}</b>` : ''}</li>`).join('')}</ul>
      ${o.customer_note ? `<p class="onote">Nota del cliente: ${esc(o.customer_note)}</p>` : ''}
      <footer>
        <span class="otot">${t !== null ? `Total de productos: <b>${money(t)}</b>` : ''}</span>
        <div class="aacts">${inv && inv.pdf_url ? `<a class="btn sec sm" href="${esc(inv.pdf_url)}" target="_blank" rel="noopener">Ver boleta ${esc((inv.series || '') + '-' + (inv.number || ''))}</a>` : ''}<button class="btn icon" type="button" data-oact="copy" title="Copiar el pedido" aria-label="Copiar el pedido">${ico('txt')}</button><button class="btn icon dan" type="button" data-oact="del" title="Eliminar del historial" aria-label="Eliminar del historial">${ico('trash')}</button></div>
      </footer>
    </article>`;
  }).join('');
}
$('#oFil').addEventListener('click', e => { const b = e.target.closest('[data-of]'); if (!b) return; ordSel = b.dataset.of; renderOrders(); });
$('#oQ').addEventListener('input', renderOrders);
$('#oList').addEventListener('click', async e => {
  const b = e.target.closest('[data-oact]'); if (!b) return;
  const o = aOrders.find(x => String(x.id) === b.closest('[data-id]').dataset.id); if (!o) return;
  try {
    switch (b.dataset.oact){
      case 'copy': await navigator.clipboard.writeText(orderMsg(o)); aMsg('Pedido copiado. Puedes pegarlo en WhatsApp.'); break;
      case 'del':
        if (confirm(`¿Eliminar el pedido ${oCode(o)} del historial?\nSe borra para siempre.`)){
          await sb(`/rest/v1/orders?id=eq.${o.id}`, { method:'DELETE', auth:true });
          aOrders = aOrders.filter(x => x !== o); renderOrders(); renderHome(); renderBillFrom();
        }
    }
  } catch (err) { aMsg('No se pudo guardar: ' + err.message, 'err'); }
});

/* ---------- facturación ---------- */
const INV_ST = { pendiente:['Pendiente','amber'], aceptado:['Emitido','green'], rechazado:['Rechazado','red'], anulado:['Anulado','grey'], error:['Error','red'] };
async function checkApi(){
  if (apiReady !== null) return;
  try { apiReady = !!(await sb('/functions/v1/emitir-comprobante', { method:'POST', auth:true, body:{ action:'estado' } })).configurado; }
  catch { apiReady = false; }
  renderHome(); if (view === 'bill') renderBilling();
}
function renderBilling(){
  const filled = billing.ruc && billing.razon_social;
  $('#bApi').className = 'box api ' + (apiReady ? 'on' : 'off');
  $('#bApi').innerHTML = apiReady
    ? `<span class="dot"></span><div><h3>Facturación conectada</h3><p>Las boletas y facturas se envían a SUNAT a través de Factus.${filled ? '' : ' <b>Completa abajo los datos de tu empresa.</b>'}</p></div>`
    : `<span class="dot"></span><div><h3>Esperando el acceso a la API</h3><p>Todo está listo. Cuando el proveedor del facturador (Factus) entregue el acceso, se activa sin cambiar nada más. Mientras tanto puedes preparar boletas: quedan como <b>pendientes</b> y se emiten con un toque cuando se active.</p></div>`;
  $('#cRuc').value = billing.ruc || ''; $('#cRs').value = billing.razon_social || ''; $('#cDir').value = billing.direccion || '';
  $('#cSb').value = billing.serie_boleta || 'B002'; $('#cSf').value = billing.serie_factura || 'F002';
  $('#cIgv').value = billing.igv_type || 'gravado'; $('#cAmb').value = billing.ambiente || 'pruebas';
  const box = $('#bList');
  if (!aInvoices.length){ box.innerHTML = '<p class="aempty">Todavía no hay comprobantes. Los emites desde <b>Pedidos</b> cuando un cliente te paga.</p>'; return; }
  box.innerHTML = `<div class="tbl"><div class="tr th"><span>Fecha</span><span>Comprobante</span><span>Cliente</span><span>Total</span><span>Estado</span><span></span></div>${aInvoices.map(i => {
    const [lab, col] = INV_ST[i.status] || [i.status, 'grey'];
    const num = i.number ? `${i.series}-${i.number}` : (i.doc_type === 'factura' ? 'Factura' : 'Boleta') + ' (sin número)';
    return `<div class="tr" data-inv="${i.id}"><span>${fmtDate.format(new Date(i.created_at))}</span><span><b>${esc(num)}</b><small>${i.doc_type === 'factura' ? 'Factura' : 'Boleta'}</small></span><span>${esc(i.customer_name || 'Clientes varios')}<small>${i.customer_doc ? esc(i.customer_doc_type.toUpperCase() + ' ' + i.customer_doc) : 'Sin documento'}</small></span><span>${money(i.total)}</span><span><span class="pill ${col}" title="${esc(i.message || '')}">${lab}</span></span><span class="aacts">${i.pdf_url ? `<a class="btn sec sm" href="${esc(i.pdf_url)}" target="_blank" rel="noopener">PDF</a>` : ''}${['pendiente','rechazado','error'].includes(i.status) ? `<button class="btn pri sm" type="button" data-iact="send">Emitir ahora</button><button class="btn icon dan" type="button" data-iact="del" aria-label="Borrar borrador" title="Borrar borrador">${ico('trash')}</button>` : ''}</span></div>`;
  }).join('')}</div>`;
}
$('#bCfg').addEventListener('submit', async e => {
  e.preventDefault();
  const ruc = $('#cRuc').value.trim(), sb_ = $('#cSb').value.trim().toUpperCase(), sf = $('#cSf').value.trim().toUpperCase();
  if (ruc && !/^(10|20)\d{9}$/.test(ruc)){ $('#cMsg').textContent = 'El RUC tiene 11 números y empieza con 10 o 20.'; return; }
  if (!/^B[A-Z0-9]{3}$/.test(sb_) || !/^F[A-Z0-9]{3}$/.test(sf)){ $('#cMsg').textContent = 'Las series tienen 4 caracteres: boletas empiezan con B (ej. B002) y facturas con F (ej. F002).'; return; }
  const val = { ruc, razon_social: $('#cRs').value.trim(), direccion: $('#cDir').value.trim(), serie_boleta: sb_, serie_factura: sf, igv_type: $('#cIgv').value, ambiente: $('#cAmb').value };
  try {
    await sb('/rest/v1/settings?on_conflict=key', { method:'POST', auth:true, prefer:'resolution=merge-duplicates,return=minimal', body:{ key:'billing', value: val } });
    billing = val; $('#cMsg').textContent = ''; aMsg('Datos de la empresa guardados.');
  } catch (err) { $('#cMsg').textContent = 'No se pudo guardar: ' + err.message; }
});
$('#bList').addEventListener('click', async e => {
  const b = e.target.closest('[data-iact]'); if (!b) return;
  const inv = aInvoices.find(i => String(i.id) === b.closest('[data-inv]').dataset.inv); if (!inv) return;
  if (b.dataset.iact === 'send') return sendInvoice(inv);
  if (b.dataset.iact === 'del' && confirm('¿Borrar este borrador de comprobante?')){
    try { await sb(`/rest/v1/invoices?id=eq.${inv.id}`, { method:'DELETE', auth:true }); aInvoices = aInvoices.filter(i => i !== inv); renderBilling(); renderOrders(); }
    catch (err) { aMsg('No se pudo borrar: ' + err.message, 'err'); }
  }
});

// formulario para emitir
let billOrder = null;
const bType = () => $('#bForm').querySelector('[name="bType"]:checked').value;
function setDocOptions(){
  const fac = bType() === 'factura';
  $('#bDocT').innerHTML = fac ? '<option value="ruc">RUC</option>' : '<option value="dni">DNI</option><option value="ce">Carné de extranjería</option><option value="ninguno">Sin documento</option>';
  $('#bNameL').textContent = fac ? 'Razón social' : 'Nombre completo'; $('#bAddrW').hidden = !fac;
  $('#bDoc').disabled = $('#bDocT').value === 'ninguno'; $('#bGo').textContent = fac ? 'Emitir factura' : 'Emitir boleta';
  $('#bTitle').textContent = (fac ? 'Emitir factura' : 'Emitir boleta') + (billOrder ? ` · pedido ${oCode(billOrder)}` : '');
}
const lineRow = (l = { name:'', qty:1, price:'' }) => `<div class="ln"><input class="a-in" data-l="name" value="${esc(l.name)}" placeholder="Producto" aria-label="Producto"><input class="a-in" data-l="qty" inputmode="decimal" value="${esc(l.qty)}" aria-label="Cantidad"><input class="a-in" data-l="price" inputmode="decimal" value="${esc(l.price)}" placeholder="Precio S/" aria-label="Precio unitario"><span class="lsum"></span><button class="btn icon" type="button" data-ldel aria-label="Quitar línea">${ico('x')}</button></div>`;
const readLines = () => [...$('#bLines').querySelectorAll('.ln:not(.lh)')].map(r => ({ name: r.querySelector('[data-l="name"]').value.trim(), qty: Number(r.querySelector('[data-l="qty"]').value.replace(',', '.')) || 0, price: Number(r.querySelector('[data-l="price"]').value.replace(',', '.')) || 0 }));
function calcTotals(){
  const ls = readLines(); const total = Math.round(ls.reduce((s, l) => s + l.qty * l.price, 0) * 100) / 100;
  const exo = (billing.igv_type || 'gravado') === 'exonerado';
  const subtotal = exo ? total : Math.round(total / 1.18 * 100) / 100, igv = exo ? 0 : Math.round((total - subtotal) * 100) / 100;
  [...$('#bLines').querySelectorAll('.ln:not(.lh)')].forEach((r, i) => { r.querySelector('.lsum').textContent = money(ls[i].qty * ls[i].price); });
  $('#bTot').innerHTML = exo
    ? `<div><span>Op. exonerada</span><b>${money(total)}</b></div><div class="big"><span>Total</span><b>${money(total)}</b></div>`
    : `<div><span>Valor de venta (sin IGV)</span><b>${money(subtotal)}</b></div><div><span>IGV 18 %</span><b>${money(igv)}</b></div><div class="big"><span>Total a pagar</span><b>${money(total)}</b></div>`;
  return { ls, total, subtotal, igv };
}
function renderBillFrom(sel){
  const s = $('#bFrom'); if (!s) return;
  s.innerHTML = '<option value="">Sin pedido (la lleno yo)</option>' + aOrders.slice(0, 200).map(o => `<option value="${o.id}"${sel && sel.id === o.id ? ' selected' : ''}>${esc(oCode(o))} · ${esc(o.customer_name || 'Cliente sin nombre')} · ${fmtDate.format(new Date(o.created_at))}</option>`).join('');
}
function fillFromOrder(o){
  billOrder = o || null;
  $('#bName').value = o?.customer_name || '';
  const items = o ? (o.items || []).map(i => ({ name: i.name + (i.size ? ` (${i.size})` : ''), qty: i.qty || 1, price: i.price !== '' && i.price != null ? i.price : '' })) : [{ name:'', qty:1, price:'' }];
  $('#bLines').innerHTML = `<div class="ln lh"><span>Producto</span><span>Cant.</span><span>Precio c/u</span><span>Importe</span><span></span></div>` + items.map(lineRow).join('');
  setDocOptions(); calcTotals();
}
$('#bFrom').addEventListener('change', e => {
  const o = aOrders.find(x => String(x.id) === e.target.value) || null;
  const pend = o && aInvoices.find(i => i.order_id === o.id && ['pendiente','rechazado','error'].includes(i.status));
  if (pend){ e.target.value = billOrder ? billOrder.id : ''; $('#bErr').textContent = `El pedido ${oCode(o)} ya tiene una boleta preparada en la lista. Emítela desde ahí.`; return; }
  $('#bErr').textContent = ''; fillFromOrder(o);
});
function openBill(o){
  billOrder = o || null;
  const pend = o && aInvoices.find(i => i.order_id === o.id && ['pendiente','rechazado','error'].includes(i.status));
  if (pend){ aGo('bill'); aMsg('Este pedido ya tiene una boleta preparada. Tócala en la lista para emitirla.'); return; }
  $('#bForm').reset(); $('#bForm').querySelector('[value="boleta"]').checked = true; setDocOptions();
  $('#bDoc').value = ''; $('#bAddr').value = ''; $('#bErr').textContent = '';
  renderBillFrom(o); fillFromOrder(o); bModal.hidden = false; setTimeout(() => $('#bDoc').focus(), 30);
}
$('#bNew').addEventListener('click', () => openBill(null));
bModal.querySelectorAll('[data-bclose]').forEach(b => b.addEventListener('click', () => { bModal.hidden = true; }));
$('#bForm').addEventListener('change', e => { if (e.target.name === 'bType' || e.target.id === 'bDocT') setDocOptions(); });
$('#bLines').addEventListener('input', calcTotals);
$('#bLines').addEventListener('click', e => { if (e.target.closest('[data-ldel]')){ e.target.closest('.ln').remove(); calcTotals(); } });
$('#bAddL').addEventListener('click', () => { $('#bLines').insertAdjacentHTML('beforeend', lineRow()); calcTotals(); });
$('#bForm').addEventListener('submit', async e => {
  e.preventDefault();
  const fac = bType() === 'factura', dt = $('#bDocT').value, doc = $('#bDoc').value.trim(), name = $('#bName').value.trim();
  const { ls, total, subtotal, igv } = calcTotals(), err = m => { $('#bErr').textContent = m; };
  if (!ls.length || ls.some(l => !l.name || l.qty <= 0 || l.price <= 0)) return err('Revisa los productos: cada línea necesita nombre, cantidad y precio mayor a 0.');
  if (fac && !/^(10|20)\d{9}$/.test(doc)) return err('El RUC tiene 11 números y empieza con 10 o 20.');
  if (fac && (!name || !$('#bAddr').value.trim())) return err('Para una factura escribe la razón social y la dirección fiscal.');
  if (dt === 'dni' && !/^\d{8}$/.test(doc)) return err('El DNI tiene 8 números.');
  if (dt === 'ce' && !/^[A-Z0-9]{8,12}$/i.test(doc)) return err('Revisa el número del carné de extranjería.');
  if (dt === 'ninguno' && total >= 700) return err('Para ventas de S/ 700 o más, SUNAT pide el DNI del cliente.');
  if (!billing.ruc || !billing.razon_social) return err('Primero completa los datos de tu empresa en Facturación (RUC y razón social).');
  $('#bGo').disabled = true; err('Guardando…');
  try {
    const [inv] = await sb('/rest/v1/invoices', { method:'POST', auth:true, prefer:'return=representation', body:{
      order_id: billOrder?.id ?? null, doc_type: fac ? 'factura' : 'boleta', customer_doc_type: fac ? 'ruc' : dt,
      customer_doc: dt === 'ninguno' ? null : doc, customer_name: name || null, customer_address: fac ? $('#bAddr').value.trim() : null,
      items: ls, igv_type: billing.igv_type || 'gravado', subtotal, igv, total } });
    aInvoices.unshift(inv); bModal.hidden = true; err('');
    await sendInvoice(inv);
  } catch (ex) { err('No se pudo guardar: ' + ex.message); }
  finally { $('#bGo').disabled = false; }
});
async function sendInvoice(inv){
  aMsg('Enviando al facturador…');
  try {
    const r = await sb('/functions/v1/emitir-comprobante', { method:'POST', auth:true, body:{ invoice_id: inv.id } });
    if (r.ok){
      Object.assign(inv, r.invoice || {});
      const o = aOrders.find(x => x.id === inv.order_id); if (o) Object.assign(o, { status:'facturado', invoice_series: inv.series, invoice_number: inv.number, invoice_pdf_url: inv.pdf_url });
      aMsg(`Listo: ${inv.doc_type === 'factura' ? 'factura' : 'boleta'} ${inv.series}-${inv.number} emitida.`);
    } else if (r.code === 'sin_api'){
      aMsg('Quedó guardada como pendiente. Se emitirá cuando se active la API de facturación (botón “Emitir ahora” en Facturación).', 'warn');
    } else {
      inv.status = r.code === 'rechazado' ? 'rechazado' : 'error'; inv.message = r.message;
      aMsg('El facturador no la aceptó: ' + (r.message || 'revisa los datos e inténtalo otra vez.'), 'err');
    }
  } catch (ex) { aMsg('No se pudo conectar con el facturador: ' + ex.message, 'err'); }
  renderBilling(); renderOrders(); renderHome();
}
