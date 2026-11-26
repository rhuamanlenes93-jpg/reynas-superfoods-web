/* Reyna's Superfoods · i18n.js
   Español (por defecto) / English. Traduce los textos de la página en el navegador:
   - textos fijos y del panel (diccionario EN),
   - nombres de productos (reglas: "Harina de X" -> "X flour", etc.),
   - lo que se dibuja después (tienda, ficha, pedido) con un MutationObserver.
   El mensaje de WhatsApp a la tienda sigue en español. El panel de administración no se traduce.
   Si la dueña cambia un texto en el panel, ese texto se ve en español hasta que se agregue aquí. */
(function(){
const KEY = 'reynas.lang';
const qs = new URLSearchParams(location.search).get('lang');
let lang = 'es';
try { lang = (qs === 'en' || qs === 'es') ? qs : (localStorage.getItem(KEY) || 'es'); if (qs) localStorage.setItem(KEY, qs); } catch {}
if (lang !== 'en') lang = 'es';
window.LANG = lang;
document.documentElement.lang = lang;

/* ---------- selector de idioma (en la portada y en la barra fija) ---------- */
const FLAG = {
  es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#D91023"/><rect x="10" width="10" height="20" fill="#fff"/></svg>',
  en: '<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="7"/></svg>'
};
const NAME = { es: 'Español', en: 'English' };
function switcher(extra){
  const other = lang === 'es' ? 'en' : 'es';
  const w = document.createElement('div');
  w.className = 'lang ' + (extra || '');
  w.innerHTML = `<button type="button" class="lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="${lang === 'es' ? 'Idioma: Español' : 'Language: English'}">${FLAG[lang]}<span>${lang.toUpperCase()}</span><svg class="chev" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5l4 4 4-4"/></svg></button>
    <div class="lang-menu" hidden><a href="?lang=${other}" hreflang="${other}" lang="${other}" data-lang="${other}">${FLAG[other]}${other === 'en' ? 'English (Inglés)' : 'Español (Spanish)'}</a></div>`;
  const b = w.querySelector('.lang-btn'), m = w.querySelector('.lang-menu');
  const set = o => { m.hidden = !o; b.setAttribute('aria-expanded', o); w.classList.toggle('open', o); };
  b.addEventListener('click', e => { e.stopPropagation(); set(m.hidden); });
  document.addEventListener('click', e => { if (!w.contains(e.target)) set(false); });
  w.addEventListener('keydown', e => { if (e.key === 'Escape'){ set(false); b.focus(); } });
  w.querySelector('[data-lang]').addEventListener('click', e => {
    e.preventDefault();
    try { localStorage.setItem(KEY, other); } catch {}
    // quita ?lang= de la dirección y recarga la página (cambiar solo la dirección con # no la recarga)
    const u = new URL(location.href); u.searchParams.delete('lang');
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    location.reload();
  });
  return w;
}
const acct = document.querySelector('.hacct'); if (acct) acct.prepend(switcher('on-hero'));
const tb = document.querySelector('.tb-in .cartpill'); if (tb) tb.before(switcher('on-bar'));
const nl = document.getElementById('navdLang'); if (nl) nl.append(switcher('in-nav'));

if (lang !== 'en'){ document.documentElement.classList.add('i18n-ready'); return; }

/* ---------- diccionario ---------- */
const EN = {
  // portada y menús
  'Productos':'Products','Packs':'Packs','Por mayor':'Wholesale','Nosotros':'About us','Contacto':'Contact','Mi pedido':'My order',
  'Tienda':'Shop','Packs y combos':'Packs & bundles','Cómo comprar':'How to buy','COMPRAR AHORA':'SHOP NOW','Comprar ahora':'Shop now',
  'Desliza hacia abajo':'Scroll down','Desliza hacia abajo para ver la tienda':'Scroll down to see the shop',
  'Producto anterior':'Previous product','Producto siguiente':'Next product','Productos destacados':'Featured products',
  'Menú principal':'Main menu','Menú':'Menu','Abrir menú':'Open menu','Cerrar menú':'Close menu','Buscar productos':'Search products','Buscar':'Search','Ver categorías':'See categories','Escríbenos por WhatsApp':'Message us on WhatsApp','Secciones':'Sections','Menú de productos':'Product menu','Abrir menú de productos':'Open product menu',
  'Abrir mi pedido':'Open my order',"Reyna's Superfoods, inicio":"Reyna's Superfoods, home",'Estás en':'You are here',
  "Reyna's Superfoods: harinas, superalimentos andinos y extractos en polvo, por mayor y menor":"Reyna's Superfoods: flours, Andean superfoods and powdered extracts, wholesale and retail",
  'Lo mejor de la naturaleza para ti':'The best of nature for you',
  '“El ginseng de los Andes”':'“The ginseng of the Andes”','Energía y vitalidad natural':'Natural energy and vitality',
  '“El oro de los Incas”':'“The gold of the Incas”','Rica en antioxidantes':'Rich in antioxidants',
  '“El color del Perú”':'“The color of Peru”','Rico en antocianinas':'Rich in anthocyanins',
  '“El tesoro de la Amazonía”':'“The treasure of the Amazon”','Fuente natural de vitamina C':'A natural source of vitamin C',
  'Maíz morado':'Purple corn','Quinua':'Quinoa','Cañihua':'Cañihua','Kiwicha':'Kiwicha (amaranth)','Cacao':'Cacao','Aguaje':'Aguaje',
  // tienda
  'Catálogo 2026':'2026 Catalog','Nuestros productos':'Our products','Inicio':'Home','Toda la tienda':'Whole shop','Todos':'All','Categorías':'Categories',
  'Elige una categoría, añade a tu pedido y envíalo por WhatsApp. Venta al por mayor y menor, con envíos a todo Lima y provincias.':'Choose a category, add to your order and send it via WhatsApp. Wholesale and retail, with delivery across Lima and the rest of Peru.',
  'Buscar: maca, cacao, quinua…':'Search: maca, cacao, quinoa…','Buscar producto':'Search product','Catálogo PDF':'PDF catalog',
  'Todos los productos en un PDF con valor nutricional y recomendaciones':'All products in one PDF, with nutrition facts and tips',
  'Cargando el catálogo…':'Loading the catalog…','No encontramos ese producto.':'We couldn’t find that product.','Pregúntanos por WhatsApp':'Ask us on WhatsApp',
  'Ver más productos':'Show more products','Agregar':'Add','Ver producto':'View product','Ver pack':'View pack','Foto por subir':'Photo coming soon',
  'Harinas naturales':'Natural flours','Harinas gelatinizadas':'Gelatinized flours','Condimentos en polvo':'Ground spices',
  'Extractos atomizados':'Spray-dried extracts','Frutos secos y semillas':'Nuts and seeds','Frutas deshidratadas':'Dried fruits','Otros':'Other products',
  'Harinas instantáneas':'Instant flours',
  'Ideal para batidos, panadería, postres, papillas y recetas caseras.':'Great for smoothies, baking, desserts, porridges and home recipes.',
  'Instantánea: se disuelve fácil en bebidas, batidos y yogures, sin cocción.':'Instant: dissolves easily in drinks, smoothies and yogurt, no cooking needed.',
  'Ideal para sazonar guisos, carnes, sopas, salsas y aderezos.':'Great for seasoning stews, meats, soups, sauces and dressings.',
  'Ideal para jugos, smoothies, helados, yogures y repostería.':'Great for juices, smoothies, ice cream, yogurt and baking.',
  'Ideal para snacks, granolas, ensaladas, panadería y repostería.':'Great for snacks, granola, salads, bread and pastries.',
  'Ideal para snacks, granolas, cereales, infusiones y repostería.':'Great for snacks, granola, cereals, infusions and baking.',
  'Proteínas, fibras y espesantes para batidos, suplementos, panadería y la industria alimentaria.':'Proteins, fibers and thickeners for shakes, supplements, baking and the food industry.',
  // packs
  'Combinaciones listas para tu semana':'Ready-made bundles for your week',
  'Productos que se usan juntos, en un solo pedido. Ideales para regalar o para empezar.':'Products that go together, in a single order. Great as a gift or to get started.',
  '¿Necesitas otra combinación? La armamos contigo.':'Need a different bundle? We’ll put it together with you.','Armar mi pack por WhatsApp':'Build my pack on WhatsApp',
  'Pack Energía andina':'Andean Energy Pack','Pack Desayuno andino':'Andean Breakfast Pack','Combo Antioxidante':'Antioxidant Bundle','Pack Repostería natural':'Natural Baking Pack',
  'Maca negra, maca roja, maca amarilla y cacao. Para batidos y desayunos con energía.':'Black, red and yellow maca plus cacao. For energizing smoothies and breakfasts.',
  'Quinua, kiwicha, cañihua y avena. Para papillas, panqueques y bowls.':'Quinoa, kiwicha, cañihua and oats. For porridges, pancakes and bowls.',
  'Extractos en polvo de camu camu, arándano azul, açaí y maracuyá. Para jugos y smoothies.':'Powdered camu camu, blueberry, açaí and passion fruit extracts. For juices and smoothies.',
  'Lúcuma, cacao, almendras y plátano. Para queques, galletas y helados.':'Lúcuma, cacao, almonds and banana. For cakes, cookies and ice cream.',
  // destacado
  'Producto destacado':'Featured product','Maca negra gelatinizada':'Gelatinized black maca','Maca':'Maca',
  'Energía natural':'Natural energy','Ayuda a mejorar el rendimiento físico y mental.':'Helps improve physical and mental performance.',
  'Fortalece el organismo':'Strengthens the body','Aporta nutrientes que apoyan el sistema inmunológico.':'Provides nutrients that support the immune system.',
  'Equilibrio hormonal':'Hormonal balance','Contribuye al bienestar hormonal y la vitalidad.':'Supports hormonal well-being and vitality.',
  '100% natural':'100% natural','Sin aditivos, sin conservantes.':'No additives, no preservatives.','Ideal para:':'Great for:',
  'batidos, recetas, yogures y panadería.':'smoothies, recipes, yogurt and baking.','Agregar a mi pedido':'Add to my order',
  // valores
  'Alimentación saludable':'Healthy eating','Productos reales, resultados reales. Insumos en polvo, listos para tu cocina o tu negocio.':'Real products, real results. Powdered ingredients, ready for your kitchen or your business.',
  'Natural':'Natural','Harinas y extractos de frutas, granos, raíces y plantas.':'Flours and extracts from fruits, grains, roots and plants.',
  'Saludable':'Healthy','Para batidos, desayunos, recetas, yogures y panadería.':'For smoothies, breakfasts, recipes, yogurt and baking.',
  'Nutritivo':'Nutritious','Superalimentos andinos y amazónicos como maca, quinua, camu camu y cacao.':'Andean and Amazonian superfoods such as maca, quinoa, camu camu and cacao.',
  'Sostenible':'Sustainable','Productos del campo peruano, para consumo diario o a gran escala.':'Products from the Peruvian countryside, for daily use or large-scale production.',
  // misión y visión
  'Quiénes somos':'Who we are','Nuestra misión y visión':'Our mission and vision','Misión':'Mission','Visión':'Vision',
  "En Reyna's Superfoods S.A.C. tenemos como misión ofrecer productos naturales y nutritivos de alta calidad, seleccionando cuidadosamente nuestros insumos para brindar soluciones saludables a nuestros clientes. Promovemos una alimentación equilibrada y el bienestar de las personas, acercando los beneficios de los superalimentos peruanos a hogares y empresas de todo el país, con compromiso, confianza y responsabilidad.":
    "At Reyna's Superfoods S.A.C., our mission is to offer high-quality natural and nutritious products, carefully selecting our ingredients to provide healthy solutions to our customers. We promote balanced eating and people’s well-being, bringing the benefits of Peruvian superfoods to homes and businesses across the country, with commitment, trust and responsibility.",
  'Ser una empresa líder y referente en el mercado nacional e internacional de productos naturales y superalimentos, reconocida por la calidad, innovación y confianza de nuestros productos. Buscamos expandir nuestra presencia, impulsar el valor de los insumos peruanos y contribuir a un futuro donde la alimentación saludable y el bienestar estén al alcance de todos.':
    'To be a leading company and a benchmark in the national and international market for natural products and superfoods, recognized for the quality, innovation and reliability of our products. We seek to expand our presence, promote the value of Peruvian ingredients and contribute to a future where healthy eating and well-being are within everyone’s reach.',
  'Llevar a cada hogar y negocio del Perú harinas y superalimentos andinos y amazónicos naturales, de calidad y a buen precio, para que comer sano sea fácil todos los días.':'To bring natural, high-quality Andean and Amazonian flours and superfoods at a fair price to every home and business in Peru, so that eating healthy is easy every day.',
  'Ser la marca peruana de superalimentos en polvo de referencia, reconocida por su calidad, su trato cercano y por llevar lo mejor del campo peruano al país y al mundo.':'To be the leading Peruvian brand of powdered superfoods, known for its quality, its personal service and for bringing the best of the Peruvian countryside to the country and the world.',
  // presentaciones / mayoristas
  'Presentaciones':'Packaging','Para tu negocio, por mayor':'For your business, wholesale',
  'Atomizados en tambores de 25 kg, harinas en sacos de 25 kg y doypacks listos para tu tienda. Cotiza la cantidad que necesitas.':'Spray-dried extracts in 25 kg drums, flours in 25 kg sacks and doypacks ready for your store. Ask for a quote for the quantity you need.',
  'Tambor de atomizados':'Spray-dried extract drum','Saco de harina':'Flour sack','Doypack para tienda':'Retail doypack',
  'Extractos de frutas atomizados (arándano, camu camu, açaí, maracuyá y más) en tambor de cartón con tapa metálica.':'Spray-dried fruit extracts (blueberry, camu camu, açaí, passion fruit and more) in a cardboard drum with a metal lid.',
  'Harinas andinas (maca, quinua, kiwicha, cañihua y más) en saco de polipropileno. Ideal para panaderías e industria.':'Andean flours (maca, quinoa, kiwicha, cañihua and more) in a polypropylene sack. Ideal for bakeries and industry.',
  'Maca gelatinizada (negra, roja y amarilla) y lúcuma en bolsa con cierre zip, lista para vender en bodegas, tiendas naturistas y ferias.':'Gelatinized maca (black, red and yellow) and lúcuma in a zip-lock pouch, ready to sell in grocery stores, health food shops and fairs.',
  'Cotizar por WhatsApp':'Get a quote on WhatsApp','Venta al por mayor y menor':'Wholesale and retail',
  'Insumos para la industria alimentaria: panaderías, juguerías, restaurantes y emprendimientos. Cuéntanos qué necesitas y en qué cantidad.':'Ingredients for the food industry: bakeries, juice bars, restaurants and small businesses. Tell us what you need and how much.',
  'Cotizar por mayor':'Get a wholesale quote',
  'Tambor de cartón de 25 kg con extracto de arándano atomizado':'25 kg cardboard drum with spray-dried blueberry extract','Saco de 25 kg con harina de maca':'25 kg sack of maca flour',
  "Doypacks Reyna's de harina de maca negra, roja y amarilla gelatinizada y de lúcuma":"Reyna's doypacks of gelatinized black, red and yellow maca flour and lúcuma flour",
  // pasos
  'Tu pedido en tres pasos':'Your order in three steps','Arma tu pedido':'Build your order','Agrega productos y packs desde la tienda. Puedes cambiar las cantidades cuando quieras.':'Add products and packs from the shop. You can change the quantities at any time.',
  'Envíalo por WhatsApp':'Send it via WhatsApp','Escribe tu nombre y distrito. El mensaje se arma solo y llega directo a nuestro WhatsApp.':'Type your name and district. The message is written for you and goes straight to our WhatsApp.',
  'Coordina pago y envío':'Arrange payment and delivery','Te confirmamos precios, presentaciones y el costo de envío. Enviamos a todo Lima y provincias.':'We confirm prices, packaging and the delivery cost. We deliver across Lima and the rest of Peru.',
  // preguntas
  'Preguntas frecuentes':'FAQ','Lo que más nos preguntan':'Frequently asked questions',
  '¿Hacen envíos a provincias?':'Do you deliver outside Lima?','Sí. Enviamos a todo Lima y a provincias. El costo y el tiempo de entrega dependen del destino y te los decimos por WhatsApp antes de que pagues.':'Yes. We deliver across Lima and the rest of Peru. The cost and delivery time depend on the destination, and we tell you on WhatsApp before you pay.',
  '¿Venden por mayor?':'Do you sell wholesale?','Sí. Vendemos por kilo, en doypacks de 250 g, 500 g y 1 kg, y en sacos o tambores de 25 kg para panaderías, juguerías, restaurantes, tiendas naturistas y emprendimientos.':'Yes. We sell by the kilo, in 250 g, 500 g and 1 kg doypacks, and in 25 kg sacks or drums for bakeries, juice bars, restaurants, health food shops and small businesses.',
  '¿Cómo hago mi pedido?':'How do I place an order?','Agrega los productos que quieras, escribe tu nombre y distrito y toca “Enviar pedido por WhatsApp”. Te respondemos para coordinar el pago y el envío.':'Add the products you want, type your name and district and tap “Send order via WhatsApp”. We reply to arrange payment and delivery.',
  '¿Cómo pago?':'How do I pay?','Por transferencia al BCP o por Yape. Cuando te respondemos por WhatsApp te enviamos el total y los datos para pagar. No se cobra nada en la página.':'By bank transfer to BCP or with Yape. When we reply on WhatsApp we send you the total and the payment details. Nothing is charged on the website.',
  '¿Entregan boleta o factura?':'Do you issue receipts or invoices?','Sí. Emitimos boleta o factura electrónica por cada compra. Para factura solo necesitamos tu RUC.':'Yes. We issue an electronic receipt or invoice for every purchase. For an invoice we only need your RUC (tax ID).',
  '¿Cómo se usan las harinas y superalimentos?':'How are the flours and superfoods used?','En batidos, jugos, avena, panes, postres, sopas y cremas. La ficha de cada producto dice cómo usarlo, la porción sugerida y su valor nutricional por 100 g.':'In smoothies, juices, oatmeal, bread, desserts, soups and creams. Each product page explains how to use it, the suggested serving and its nutrition facts per 100 g.',
  // cintas y pie
  'Envíos a todo Lima y provincias':'Delivery across Lima and Peru','Venta por mayor y menor':'Wholesale and retail','Insumos para la industria alimentaria':'Ingredients for the food industry',
  'Harinas, superalimentos y extractos en polvo. Lo mejor de la naturaleza para ti.':'Flours, superfoods and powdered extracts. The best of nature for you.',
  'De 8:00 a. m. a 5:00 p. m.':'8:00 a.m. to 5:00 p.m.','Lima, Perú. Envíos a todo el país.':'Lima, Peru. Delivery nationwide.',
'Envíos y devoluciones':'Shipping and returns','Privacidad':'Privacy','Ayuda':'Help','Libro de Reclamaciones':'Complaints Book',
  'Escríbenos por WhatsApp al +51 918 515 262':'Message us on WhatsApp at +51 918 515 262','¿Dudas? Escríbenos':'Questions? Message us',
  // ficha
  'Volver':'Back','Cantidad':'Quantity','Menos':'Less','Más':'More','Agregar al pedido':'Add to order','También te puede interesar':'You may also like',
  'Presentación':'Packaging','Precio':'Price','Venta':'Sales','Envíos':'Delivery','Por mayor y menor':'Wholesale and retail','Lima y provincias':'Lima and the rest of Peru',
  // pedido
  'Tu pedido':'Your order','Cerrar':'Close','Total de productos':'Total products','Tu nombre':'Your name','¿Cómo te llamas?':'What’s your name?',
  '¿A dónde lo enviamos?':'Where should we deliver it?','Distrito o ciudad':'District or city','Acepto la':'I accept the','política de privacidad':'privacy policy',
  'y los':'and the','términos':'terms','Enviar pedido por WhatsApp':'Send order via WhatsApp',
  'No se cobra nada aquí. Te respondemos por WhatsApp para coordinar el pago y el envío.':'Nothing is charged here. We reply on WhatsApp to arrange payment and delivery.',
  'Seguir comprando':'Keep shopping','Ver pedido':'View order','Quitar':'Remove','Quitar uno':'Remove one','Agregar uno':'Add one',
  'Agrega productos para enviar':'Add products to send','Pedido enviado. Te responderemos por WhatsApp.':'Order sent. We’ll reply on WhatsApp.',
  'Todavía no agregas productos. Explora la tienda y toca “Agregar”.':'You haven’t added any products yet. Browse the shop and tap “Add”.',
  'kg':'kg','Kilo':'Kilo','Saco de 25 kg':'25 kg sack','Tonelada':'Tonne','Tambor de 25 kg':'25 kg drum','Doypack 250 g':'Doypack 250 g','Doypack 500 g':'Doypack 500 g','Doypack 1 kg':'Doypack 1 kg','Pack':'Pack','Unidad':'Unit',
  "Producto de Reyna's Superfoods, listo para usar.":"A Reyna's Superfoods product, ready to use.",
  'Harina':'Flour','Proteína':'Protein','Albúmina':'Albumin','Goma':'Gum','Colágeno':'Collagen','Cebolla':'Onion','Ajo':'Garlic','Canela':'Cinnamon','Pimienta':'Pepper','Comino':'Cumin','Achiote':'Annatto','Ajonjolí':'Sesame','Aguaymanto':'Goldenberry','Naranja':'Orange','Manzana':'Apple','Piña':'Pineapple','Té':'Tea','Silimarina':'Silymarin','Arándano':'Berry','Pecanas':'Pecans',
  'No se pudo abrir el panel. Revisa tu conexión.':'Could not open the panel. Check your connection.'
};
// pedazos de los nombres de productos
const TERMS = {
  'maca roja':'red maca','maca negra':'black maca','maca amarilla':'yellow maca','maca':'maca','lúcuma':'lúcuma','plátano':'banana','avena':'oat','camote':'sweet potato',
  'quinua':'quinoa','kiwicha':'kiwicha (amaranth)','cañihua':'cañihua','aguaje':'aguaje','camu camu':'camu camu','linaza':'flaxseed','zanahoria':'carrot','arveja verde':'green pea',
  'alcachofa':'artichoke','cacao':'cacao','maíz morado':'purple corn','soja':'soy','soya':'soy','garbanzo':'chickpea','arroz':'rice','almendras':'almond','huanarpo':'huanarpo',
  'algarrobo':'carob','coco':'coconut','cúrcuma':'turmeric','jengibre':'ginger','paprika':'paprika','ají panca':'ají panca (red chili)','ají amarillo':'ají amarillo (yellow chili)',
  'maracuyá':'passion fruit','arándano azul':'blueberry','arándano rojo':'cranberry','fresa':'strawberry','uva':'grape','pitahaya':'dragon fruit','granada':'pomegranate',
  'beterraga':'beet','açaí':'açaí'
};
const EXACT_NAMES = {
  'Cebolla en polvo':'Onion powder','Ajo en polvo':'Garlic powder','Canela en polvo':'Cinnamon powder','Pimienta negra molida':'Ground black pepper','Comino molido':'Ground cumin',
  'Achiote molido':'Ground annatto (achiote)','Té matcha atomizado':'Spray-dried matcha tea','Silimarina atomizado':'Spray-dried silymarin',
  'Nibs de cacao':'Cacao nibs','Almendras':'Almonds','Pecanas':'Pecans','Maní':'Peanuts','Nueces':'Walnuts','Pistachos':'Pistachios','Castaña':'Brazil nuts','Chía':'Chia seeds',
  'Ajonjolí natural':'Natural sesame seeds','Ajonjolí negro':'Black sesame seeds',
  'Aguaymanto deshidratado':'Dried goldenberries','Naranja deshidratada':'Dried orange','Manzana deshidratada':'Dried apple','Arándano rojo deshidratado':'Dried cranberries',
  'Piña deshidratada':'Dried pineapple','Coco deshidratado':'Dried coconut',
  'Proteína concentrada de suero de leche 80%':'Whey protein concentrate 80%','Proteína aislada de soya 90%':'Soy protein isolate 90%','Proteína de alverja 80%':'Pea protein 80%',
  'Proteína de arroz':'Rice protein','Albúmina de huevo':'Egg white albumin','Inulina':'Inulin','Goma guar':'Guar gum','Colágeno hidrolizado':'Hydrolyzed collagen'
};
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const term = s => TERMS[s.toLowerCase()] || null;
function name(s){
  if (EXACT_NAMES[s]) return EXACT_NAMES[s];
  let m;
  if ((m = s.match(/^Harina de (.+?) gelatinizada$/i)) && term(m[1])) return cap('gelatinized ' + term(m[1]) + ' flour');
  if ((m = s.match(/^Harina de (.+)$/i)) && term(m[1])) return cap(term(m[1]) + (/^(ají|cúrcuma|jengibre|paprika)/i.test(m[1]) ? ' powder' : ' flour'));
  if ((m = s.match(/^Extracto en polvo de (.+)$/i)) && term(m[1])) return cap(term(m[1]) + ' powder extract');
  if ((m = s.match(/^(.+?) gelatinizada$/i)) && term(m[1])) return cap('gelatinized ' + term(m[1]));
  if (term(s)) return cap(term(s));
  return null;
}
const RULES = [
  [/^(\d+) productos?$/, (m, n) => n + (n === '1' ? ' product' : ' products')],
  [/^Ver más productos \((\d+)\)$/, (m, n) => `Show more products (${n})`],
  [/^Ver los (\d+)$/, (m, n) => `See all ${n}`],
  [/^Tu pedido \((\d+)\)$/, (m, n) => `Your order (${n})`],
  [/^Búsqueda: “(.*)”$/, (m, q) => `Search: “${q}”`],
  [/^Ver (.+)$/, (m, x) => { const t = tr(x); return t !== x ? 'View ' + t : null; }],
  [/^Agregado: (.+)$/, (m, x) => 'Added: ' + tr(x)],
  [/^Sumaste otro: (.+)$/, (m, x) => 'Added one more: ' + tr(x)],
  [/^Cantidad de (.+)$/, (m, x) => 'Quantity of ' + tr(x)],
  [/^Unidad de (.+)$/, (m, x) => 'Unit for ' + tr(x)],
  [/^Quitar (.+)$/, (m, x) => 'Remove ' + tr(x)],
  [/^Agregar (.+) al pedido$/, (m, x) => 'Add ' + tr(x) + ' to the order'],
  [/^Agregaste (.+)$/, (m, rest) => { const parts = rest.split(' de ');
      for (let i = 1; i < parts.length; i++){ const q = parts.slice(0, i).join(' de '), x = parts.slice(i).join(' de '); if (tr(x) !== x) return `You added ${tr(q)} of ${tr(x)}`; }
      return null; }],
  [/^Producto de Reyna's Superfoods, listo para usar\. (.+)$/, (m, x) => "A Reyna's Superfoods product, ready to use. " + tr(x)],
  [/^y más combinaciones listas\.$/, () => 'and more ready-made bundles.'],
  [/^(\d+(?:,\d+)?) (sacos? de 25 kg|tambor(?:es)? de 25 kg|toneladas?|doypacks? de (?:250 g|500 g|1 kg)|unidad(?:es)?|packs?)$/, (m, n, u) => n + ' ' + unit(u, n)]
];
function unit(u, n){
  const pl = n !== '1';
  if (/^saco/.test(u)) return pl ? '25 kg sacks' : '25 kg sack';
  if (/^tambor/.test(u)) return pl ? '25 kg drums' : '25 kg drum';
  if (/^tonelada/.test(u)) return pl ? 'tonnes' : 'tonne';
  if (/^doypack/.test(u)) return (pl ? 'doypacks' : 'doypack') + ' of ' + u.replace(/^doypacks? de /, '');
  if (/^unidad/.test(u)) return pl ? 'units' : 'unit';
  return pl ? 'packs' : 'pack';
}
function tr(s){
  if (!s) return s;
  if (EN[s] !== undefined) return EN[s];
  const n = name(s); if (n) return n;
  for (const [re, fn] of RULES){ const m = s.match(re); if (m){ const r = fn(...m); if (r) return r; } }
  return s;
}
window.t = tr;

/* ---------- aplicar a la página ---------- */
const SKIP = '#admin, .admin, script, style, noscript, .h2 .w, [data-noi18n]';
const ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
function doText(node){
  const p = node.parentElement; if (!p || p.closest(SKIP)) return;
  const raw = node.nodeValue, core = raw.trim(); if (!core || !/[A-Za-zÁÉÍÓÚáéíóúñ]/.test(core)) return;
  const out = tr(core.replace(/\s+/g, ' '));
  if (out !== core && out !== core.replace(/\s+/g, ' ')) node.nodeValue = raw.replace(core, out);
}
function doAttrs(el){
  if (el.closest(SKIP)) return;
  if (el.matches('.h2')){ doH2(el); return; }
  for (const a of ATTRS){ const v = el.getAttribute(a); if (v){ const o = tr(v.trim()); if (o !== v.trim()) el.setAttribute(a, o); } }
}
function doH2(h){
  if (h.closest('#admin')) return;
  const src = h.getAttribute('aria-label'); if (!src) return;
  const o = tr(src); if (o !== src && typeof splitH2 === 'function') splitH2(h, o);
}
function walk(root){
  if (root.nodeType === 3){ doText(root); return; }
  if (root.nodeType !== 1) return;
  if (root.matches && root.matches('.h2')){ doH2(root); return; }
  if (root.hasAttribute && ATTRS.some(a => root.hasAttribute(a))) doAttrs(root);
  root.querySelectorAll('.h2').forEach(doH2);
  root.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(doAttrs);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) doText(n);
}
document.title = "Reyna's Superfoods · Peruvian superfoods, flours and powdered extracts";
const md = document.querySelector('meta[name="description"]'); if (md) md.content = 'Maca, lúcuma, camu camu, quinoa, cacao and more: Peruvian superfood flours and spray-dried fruit extracts, wholesale and retail. Order via WhatsApp.';
walk(document.body);
// catálogo PDF en inglés
document.querySelectorAll('a[href*="catalogo-reynas-superfoods.pdf"]').forEach(a => {
  a.href = a.getAttribute('href').replace('catalogo-reynas-superfoods.pdf', 'catalogo-reynas-superfoods-en.pdf');
  a.setAttribute('download', 'Reynas-Superfoods-Catalog-2026.pdf');
});
new MutationObserver(list => {
  for (const r of list){
    if (r.type === 'characterData') doText(r.target);
    else if (r.type === 'attributes'){ if (r.target.matches('.h2') && r.attributeName === 'aria-label') doH2(r.target); else doAttrs(r.target); }
    else r.addedNodes.forEach(walk);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
document.documentElement.classList.add('i18n-ready');
})();
