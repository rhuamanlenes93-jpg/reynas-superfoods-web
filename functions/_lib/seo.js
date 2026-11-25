/* Reyna's Superfoods · páginas para Google (Cloudflare Pages Functions)
   Cada producto y cada categoría tiene su propia dirección (/producto/harina-de-maca-negra,
   /categoria/superalimentos-andinos) con el texto ya escrito en el HTML, para que Google la lea.
   Los datos salen de Supabase: lo que la dueña cambia en el panel aparece aquí solo. */
import { NUTRI } from './nutri.js';

const SB_URL = 'https://cauphvgvqtcvmcsvbyry.supabase.co';
const SB_KEY = 'sb_publishable_gpHao0azXWKB31UoQrRt-w_pFBnE3bY'; // clave publicable (la misma de config.js)
const WA = '51918515262';
const SITE = "Reyna's Superfoods";
// mismas cabeceras de seguridad que _headers (las páginas generadas aquí no las reciben de ese archivo)
export const SECURITY = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://cauphvgvqtcvmcsvbyry.supabase.co; connect-src 'self' https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
};

const G = { naturales:'Harinas naturales', gelatinizadas:'Harinas gelatinizadas', condimentos:'Condimentos en polvo', extractos:'Extractos atomizados', frutos:'Frutos secos y semillas', frutas:'Frutas deshidratadas', packs:'Packs y combos' };
const HARINA = [G.naturales, G.gelatinizadas];
const ORDER = [G.naturales, G.gelatinizadas, G.condimentos, G.extractos, G.frutos, G.frutas, G.packs];
const COLORS = { [G.naturales]:'#D39F78', [G.gelatinizadas]:'#C9962F', [G.condimentos]:'#D9603B', [G.extractos]:'#9473C7', [G.frutos]:'#9C7A54', [G.frutas]:'#E8913A', [G.packs]:'#4FA9A2' };
const INTRO = {
  [G.naturales]:'Harinas de maca, lúcuma, quinua, kiwicha, cañihua, cacao, camu camu, plátano, avena y más, molidas y listas para batidos, panadería, postres y la industria alimentaria.',
  [G.gelatinizadas]:'Harinas gelatinizadas o instantáneas de maca (amarilla, negra y roja), quinua, kiwicha y cañihua: se disuelven fácil en bebidas, batidos y yogures sin cocción.',
  [G.condimentos]:'Cúrcuma, jengibre, paprika, ají panca, ají amarillo, cebolla, ajo, canela, pimienta, comino y achiote en polvo para sazonar en casa o en tu negocio.',
  [G.extractos]:'Extractos atomizados de frutas (maracuyá, arándano, fresa, uva, pitahaya, granada, camu camu, açaí y más): el sabor y el color de la fruta en un polvo fino para jugos, helados, yogures y repostería.',
  [G.frutos]:'Nibs de cacao, almendras, pecanas, maní, nueces, pistachos, castaña, chía y ajonjolí para snacks, granolas, panadería y repostería.',
  [G.frutas]:'Aguaymanto, naranja, manzana, arándano rojo, piña y coco deshidratados para snacks, granolas, cereales e infusiones.',
  [G.packs]:'Combinaciones de productos que se usan juntos, en un solo pedido.'
};

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const urlSlug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lc = n => n.charAt(0).toLowerCase() + n.slice(1);
export function fullName(p){
  if (HARINA.includes(p.category)) return 'Harina de ' + lc(p.name);
  if (p.category === G.extractos && !/atomizad/i.test(p.name)) return 'Extracto en polvo de ' + lc(p.name);
  return p.name;
}
const money = v => 'S/ ' + Number(v).toFixed(2);
const fmt = v => v == null ? '—' : String(v).replace('.', ',');
const imgUrl = (p, origin) => !p.image_url ? origin + '/assets/img/logo-512.png'
  : /^https?:/.test(p.image_url) ? p.image_url
  : /^[a-z0-9_]+$/.test(p.image_url) ? `${origin}/assets/products/${p.image_url}.webp` : origin + '/assets/img/logo-512.png';
const thumb = p => /^[a-z0-9_]+$/.test(p.image_url || '') ? `/assets/products/sm/${p.image_url}.webp` : (/^https?:/.test(p.image_url || '') ? p.image_url : '/assets/img/logo-512.png');
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const sortCats = cats => [...cats].sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));

async function sbGet(path){
  const r = await fetch(SB_URL + path, { headers: { apikey: SB_KEY }, cf: { cacheTtl: 120, cacheEverything: true } });
  if (!r.ok) throw new Error('supabase ' + r.status);
  return r.json();
}
export async function loadData(){
  const [products, settings] = await Promise.all([
    sbGet('/rest/v1/products?select=id,name,category,price,unit,image_url,description,sort&active=is.true&order=sort.asc,name.asc'),
    sbGet('/rest/v1/settings?select=key,value&key=eq.empresa').catch(() => [])
  ]);
  products.forEach(p => { p.full = fullName(p); p.slug = urlSlug(p.full); });
  return { products, empresa: (settings[0] || {}).value || {} };
}
export async function loadEmpresa(){
  const s = await sbGet('/rest/v1/settings?select=key,value&key=eq.empresa').catch(() => []);
  return { products: [], empresa: (s[0] || {}).value || {} };
}
export const categories = products => sortCats([...new Set(products.map(p => p.category))]);

/* ---------- plantilla común ---------- */
export function layout({ origin, path, title, description, image, jsonld = [], body, empresa, status = 200 }){
  const canon = origin + path;
  const e = empresa || {};
  const legal = [e.razon_social || "Reyna's Superfoods S.A.C.", e.ruc ? 'RUC ' + e.ruc : '', e.direccion || ''].filter(Boolean).map(esc).join(' · ');
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canon)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_PE">
<meta property="og:site_name" content="${SITE}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canon)}">
<meta property="og:image" content="${esc(image || origin + '/assets/img/og.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF6EA">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/pages.css">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<header class="pg-top"><div class="pg-wrap">
  <a class="pg-logo" href="/" aria-label="${SITE}, inicio"><img src="/assets/img/logo-sm.webp" alt="${SITE}" width="180" height="190"></a>
  <nav class="pg-nav" aria-label="Principal"><a href="/#tienda">Tienda</a><a href="/#packs">Packs</a><a href="/#nosotros">Nosotros</a><a class="pg-cta" href="/#pedido">Mi pedido</a></nav>
</div></header>
<main class="pg-wrap">${body}</main>
<footer class="pg-foot"><div class="pg-wrap">
  <div class="pg-fcols">
    <div><b>${SITE}</b><p>Harinas, superalimentos y extractos en polvo. Venta por mayor y menor, envíos a todo Lima y provincias.</p></div>
    <div><b>Contacto</b><p><a href="https://wa.me/${WA}" rel="noopener">WhatsApp +51 918 515 262</a><br><a href="https://wa.me/51992595837" rel="noopener">WhatsApp +51 992 595 837</a>${e.correo ? `<br><a href="mailto:${esc(e.correo)}">${esc(e.correo)}</a>` : ''}${e.horario ? `<br>${esc(e.horario)}` : ''}</p></div>
    <div><b>Ayuda</b><p><a href="/libro-de-reclamaciones" class="pg-libro">Libro de Reclamaciones</a><br><a href="/privacidad">Política de privacidad</a><br><a href="/terminos">Términos, envíos y devoluciones</a></p></div>
  </div>
  <p class="pg-legal">${legal}</p>
</div></footer>
</body>
</html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=600', ...SECURITY } });
}

const crumbs = (origin, items) => ({
  html: `<nav class="pg-crumbs" aria-label="Ruta"><ol>${items.map((it, i) => i === items.length - 1 ? `<li><span aria-current="page">${esc(it.name)}</span></li>` : `<li><a href="${it.path}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`,
  ld: { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type':'ListItem', position: i + 1, name: it.name, item: origin + it.path })) }
});
const card = p => `<a class="pg-card" href="/producto/${p.slug}" style="--c:${COLORS[p.category] || '#D39F78'}"><img src="${esc(thumb(p))}" alt="${esc(p.full)}" loading="lazy" width="360" height="270"><span>${esc(p.full)}</span>${p.unit ? `<small>${esc(p.unit)}</small>` : ''}${p.price != null ? `<em>${money(p.price)}</em>` : ''}</a>`;

/* ---------- página de producto ---------- */
export function productPage({ origin, data, slug }){
  const { products, empresa } = data;
  const p = products.find(x => x.slug === slug);
  if (!p) return notFound({ origin, data, path: '/producto/' + slug });
  const ALIAS = { d_lucuma:'h_lucuma', d_maca_negra:'feat_maca', d_maca_roja:'feat_maca', d_maca_amarilla:'feat_maca' };
  // la foto puede ser compartida (p. ej. té verde para el matcha): en extractos solo se usa el dato si la foto es del extracto
  const nk = ALIAS[p.image_url] || p.image_url;
  const catSlug = urlSlug(p.category), n = (p.category === G.extractos && !/^x_/.test(p.image_url || '')) ? null : (NUTRI[nk] || null);
  const joinY = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1] : (a[0] || '');
  const desc = p.description || [
    p.category === G.extractos ? `${p.full}: atomizado en polvo fino, listo para usar.` : HARINA.includes(p.category) ? `${p.full}, molida y lista para usar.` : `${p.full}.`,
    n ? n.u : '',
    n && n.d ? `Lo que más aporta: ${joinY(n.d.map(x => x.toLowerCase()))}.` : ''
  ].filter(Boolean).join(' ');
  const metaDesc = `${p.full} de ${SITE}${p.unit ? ` (${p.unit})` : ''}. ${n && n.d ? 'Aporta ' + n.d.slice(0, 3).join(', ').toLowerCase() + '. ' : ''}Venta por mayor y menor, envíos a todo Lima y provincias. Pide por WhatsApp.`;
  const c = crumbs(origin, [{ name:'Inicio', path:'/' }, { name: p.category, path:'/categoria/' + catSlug }, { name: p.full, path:'/producto/' + p.slug }]);
  const nutri = n ? (n.inf
    ? `<p class="pg-inf">Hierba de uso en infusión o en pequeñas cantidades: no tiene tabla oficial de composición y aporta muy pocas calorías por taza.</p>`
    : `<table class="pg-nt"><caption>Valor nutricional por 100 g</caption><thead><tr><th>Energía</th><th>Proteína</th><th>Carbohidratos</th><th>Fibra</th><th>Grasa</th></tr></thead><tbody><tr><td>${n.n[0]} kcal</td><td>${fmt(n.n[1])} g</td><td>${fmt(n.n[2])} g</td><td>${fmt(n.n[3])}${n.n[3] == null ? '' : ' g'}</td><td>${fmt(n.n[4])} g</td></tr></tbody></table><p class="pg-src">Fuente: ${esc(n.s)}. Valores referenciales.</p>`) : '';
  const rel = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const msg = `Hola Reyna's Superfoods, quiero pedir: ${p.full}${p.unit ? ` (${p.unit})` : ''}. ¿Me indican el total y el costo de envío?`;
  const ld = { '@context':'https://schema.org', '@type':'Product', name: p.full, image: [imgUrl(p, origin)], description: desc, category: p.category, brand: { '@type':'Brand', name: SITE }, url: origin + '/producto/' + p.slug };
  if (p.price != null) ld.offers = { '@type':'Offer', price: Number(p.price).toFixed(2), priceCurrency:'PEN', availability:'https://schema.org/InStock', url: origin + '/producto/' + p.slug, seller: { '@type':'Organization', name: empresa.razon_social || "Reyna's Superfoods S.A.C." } };
  const body = `${c.html}
<article class="pg-prod" style="--c:${COLORS[p.category] || '#D39F78'}">
  <div class="pg-img"><img src="${esc(imgUrl(p, origin))}" alt="${esc(p.full)}" width="640" height="480"></div>
  <div class="pg-info">
    <a class="pg-chip" href="/categoria/${catSlug}">${esc(p.category)}</a>
    <h1>${esc(p.full)}</h1>
    ${p.price != null ? `<p class="pg-price">${money(p.price)}</p>` : ''}
    <p class="pg-desc">${esc(desc)}</p>
    <dl class="pg-facts">${p.unit ? `<div><dt>Presentación</dt><dd>${esc(p.unit)}</dd></div>` : ''}<div><dt>Venta</dt><dd>Por mayor y menor</dd></div><div><dt>Envíos</dt><dd>Lima y provincias</dd></div></dl>
    ${n && n.d ? `<div class="pg-chips">${n.d.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
    <div class="pg-acts"><a class="pg-btn pri" href="/#producto/${encodeURIComponent(p.id)}">Agregar a mi pedido</a><a class="pg-btn" href="${esc(waLink(msg))}" rel="noopener">Pedir por WhatsApp</a></div>
  </div>
</article>
${n ? `<section class="pg-box"><h2>Valor nutricional y cómo usarla</h2>${nutri}<div class="pg-two"><div><h3>Cómo usar</h3><p>${esc(n.u)}</p></div><div><h3>Porción sugerida</h3><p>${esc(n.p)}</p></div></div></section>` : ''}
${rel.length ? `<section class="pg-rel"><h2>Más de ${esc(p.category.toLowerCase())}</h2><div class="pg-grid">${rel.map(card).join('')}</div><p><a class="pg-more" href="/categoria/${catSlug}">Ver todo ${esc(p.category.toLowerCase())}</a></p></section>` : ''}`;
  return layout({ origin, path: '/producto/' + p.slug, title: `${p.full} | ${SITE}`, description: metaDesc, image: imgUrl(p, origin), jsonld: [ld, c.ld], body, empresa });
}

/* ---------- página de categoría ---------- */
export function categoryPage({ origin, data, slug }){
  const { products, empresa } = data;
  const cat = categories(products).find(c => urlSlug(c) === slug);
  if (!cat) return notFound({ origin, data, path: '/categoria/' + slug });
  const list = products.filter(p => p.category === cat);
  const c = crumbs(origin, [{ name:'Inicio', path:'/' }, { name: cat, path:'/categoria/' + slug }]);
  const ld = { '@context':'https://schema.org', '@type':'ItemList', name: cat, itemListElement: list.map((p, i) => ({ '@type':'ListItem', position: i + 1, url: origin + '/producto/' + p.slug, name: p.full })) };
  const others = categories(products).filter(x => x !== cat);
  const body = `${c.html}
<header class="pg-cat" style="--c:${COLORS[cat] || '#D39F78'}"><p class="pg-k">${list.length} productos</p><h1>${esc(cat)}</h1><p>${esc(INTRO[cat] || '')} Venta por mayor y menor, con envíos a todo Lima y provincias.</p></header>
<div class="pg-grid">${list.map(card).join('')}</div>
<section class="pg-rel"><h2>Otras categorías</h2><div class="pg-cats">${others.map(o => `<a href="/categoria/${urlSlug(o)}" style="--c:${COLORS[o] || '#D39F78'}">${esc(o)}</a>`).join('')}</div></section>`;
  return layout({ origin, path: '/categoria/' + slug, title: `${cat} | ${SITE}`, description: `${cat} de ${SITE}: ${list.slice(0, 5).map(p => p.full.toLowerCase()).join(', ')} y más. Venta por mayor y menor, envíos a todo Lima y provincias.`, jsonld: [ld, c.ld], body, empresa });
}

export function notFound({ origin, data, path }){
  const cats = data ? categories(data.products) : [];
  return layout({ origin, path, status: 404, title: `Página no encontrada | ${SITE}`, description: 'Esta página no existe.', empresa: data?.empresa,
    body: `<section class="pg-cat"><h1>No encontramos esta página</h1><p>Puede que el producto ya no esté disponible. Mira la tienda o elige una categoría.</p><p><a class="pg-btn pri" href="/#tienda">Ir a la tienda</a></p></section>${cats.length ? `<div class="pg-cats">${cats.map(o => `<a href="/categoria/${urlSlug(o)}" style="--c:${COLORS[o] || '#D39F78'}">${esc(o)}</a>`).join('')}</div>` : ''}` });
}

/* ---------- sitemap ---------- */
export function sitemap({ origin, data }){
  const today = new Date().toISOString().slice(0, 10);
  const urls = ['/', ...categories(data.products).map(c => '/categoria/' + urlSlug(c)), ...data.products.map(p => '/producto/' + p.slug), '/libro-de-reclamaciones', '/privacidad', '/terminos'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].map(u => `  <url><loc>${esc(origin + u)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
}
