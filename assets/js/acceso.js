/* Reyna's Superfoods · acceso.js
   Entrada oculta al panel: 5 toques o 5 segundos sobre el logo, Ctrl + Shift + A o /#admin.
   La primera vez descarga admin.css y admin.js; los visitantes nunca los cargan. */
const isAdminOpen = () => { const a = document.getElementById('admin'); return !!a && !a.hidden; };
let adminReady = null;
function loadAdmin(){
  if (!adminReady){
    const css = new Promise((ok, fail) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/assets/css/admin.css'; l.onload = ok; l.onerror = fail; document.head.appendChild(l); });
    const js = new Promise((ok, fail) => { const s = document.createElement('script'); s.src = '/assets/js/admin.js'; s.onload = ok; s.onerror = fail; document.body.appendChild(s); });
    adminReady = Promise.all([css, js]).catch(err => { adminReady = null; throw err; });
  }
  return adminReady;
}
async function openAdmin(){
  try { await loadAdmin(); adminOpen(); }
  catch { toast('No se pudo abrir el panel. Revisa tu conexión.'); }
}
function closeAdmin(){ if (typeof adminClose === 'function') adminClose(); }

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
