# Reyna’s Superfoods: tienda web

Catálogo de Reyna’s Superfoods S.A.C. con pedidos y cotizaciones por WhatsApp, y un panel de administración oculto.

- **Hosting:** Cloudflare Pages (sitio estático, sin paso de build).
- **Datos:** Supabase (productos, packs, pedidos, ajustes y fotos).
- **Diseño:** el diseño claro v9 (portada con slider de colores pastel, mega menú, tarjetas 3D, ficha de producto, carrito lateral). Letras Baloo 2 y Poppins. Fotos del catálogo PDF.

## Estructura

```
index.html                 página única (sin el panel: el panel se carga aparte)
assets/css/styles.css      estilos de la tienda (colores y medidas en tokens)
assets/css/admin.css       estilos del panel (solo se descargan al abrir el panel)
assets/js/config.js        URL y clave publicable de Supabase, número de WhatsApp
assets/js/core.js          utilidades y conexión con Supabase (REST, Auth, Storage)
assets/js/portada.js       slider de la portada y barra superior
assets/js/tienda.js        catálogo, animaciones, textos editables, mega menú, tienda y packs
assets/js/pedido.js        carrito, ficha de producto, pedido por WhatsApp y arranque
assets/js/acceso.js        acceso oculto al panel (5 toques o 5 s en el logo); descarga admin.js
assets/js/admin.js         panel de administración (productos, textos, pedidos)
assets/hero/               imágenes de la portada (maca, lúcuma, maíz morado, camu camu)
assets/products/           fotos de los productos del catálogo PDF (la clave va en products.image_url)
assets/img/                logo, imagen al compartir el enlace (og.jpg)
favicon.ico, favicon-32.png, apple-touch-icon.png   ícono de la pestaña
reynas-superfoods-web.sql  toda la base de datos en un solo archivo (tablas, seguridad, textos, facturación y catálogo inicial)
emitir-comprobante.ts      Edge Function de Supabase que emite boletas y facturas con Factus (ya publicada)
_headers                   caché y cabeceras de seguridad para Cloudflare Pages
robots.txt, sitemap.xml    para Google
```

## Desarrollo local

Cualquier servidor estático sirve, por ejemplo:

```bash
npx serve .
# o
python -m http.server 8080
```

## Publicar en Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → conectar con GitHub → elegir este repositorio.
2. Framework preset: **None**. Build command: vacío. Output directory: `/`.
3. Cada `git push` a `main` publica solo.

Cuando tengan dominio, reemplazar `reynasuperfoods.pages.dev` en `index.html`, `robots.txt` y `sitemap.xml`.

## Crear la cuenta de administración

1. Supabase → Authentication → Users → **Add user** → con el correo de la clienta y una contraseña segura (marcar “Auto confirm user”).
2. Supabase → SQL Editor:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'CORREO_DE_LA_CLIENTA';
   ```

3. Supabase → Authentication → Sign In / Providers → desactivar **Allow new users to sign up** (nadie más debe poder registrarse).

El panel está oculto: se abre **manteniendo presionado el logo "Reyna's" 5 segundos** o **tocándolo 5 veces seguidas** (arriba, en la ficha del producto o en el pie). En computadora también con Ctrl + Shift + A o entrando a `/#admin`.

## Seguridad

- Los precios y las fotos se cambian desde el panel y se ven en la tienda al instante. Si un producto no tiene precio o presentación, simplemente no se muestra ese dato.
- `config.js` solo tiene la **clave publicable**: está hecha para ir en el navegador. Los permisos los controla la seguridad por filas (RLS):
  - Cualquiera puede leer los productos activos y los ajustes, y crear pedidos nuevos (sin datos de boleta).
  - Solo los usuarios de la tabla `admins` pueden editar, ver pedidos y subir fotos.
- **Nunca** subir al repositorio la clave `service_role`, contraseñas ni el token de facturación. El token de facturación irá como secreto de una Supabase Edge Function.

## Páginas para Google (Cloudflare Pages Functions)

La carpeta `functions/` genera páginas con su propia dirección, con el texto ya escrito para que Google las lea.
Se arman solas con los productos del panel (no hay que tocar nada al agregar o editar un producto):

- `/producto/harina-de-maca-negra`: ficha con foto, descripción, valor nutricional, modo de uso y botón de WhatsApp.
- `/categoria/superalimentos-andinos`: todos los productos de la categoría.
- `/sitemap.xml`: lista de todas las páginas para Google (reemplaza al archivo fijo).
- `/libro-de-reclamaciones`, `/privacidad`, `/terminos`: páginas legales con los datos de la empresa.

Los datos de la empresa (RUC, dirección, correo, horario, enlace del Libro de Reclamaciones de Indecopi, Facebook)
se llenan en el panel → Inicio → **Datos de tu empresa**.

## Panel de administración

- **Inicio:** resumen y dashboard (pedidos recibidos, productos más pedidos por WhatsApp, más agregados al carrito, pedidos por día, categorías y productos que se agregan al carrito pero casi no se piden). Periodos: 7 días, 30 días y todo.
- **Pedidos:** historial de solo lectura de los pedidos enviados por WhatsApp, con filtro por fecha, búsqueda, copiar y borrar.
- **Facturación:** “Nueva boleta” se puede llenar con un pedido del historial eligiendo su código.
- Las visitas del carrito se guardan en `cart_events` (solo producto y cantidad, sin datos personales). No se cuentan las pruebas hechas con la sesión de administración abierta.

## Seguridad

- **Base de datos:** todas las tablas tienen RLS. Los visitantes solo pueden **leer** productos, textos y ajustes.
  Los pedidos y el registro del carrito se guardan con las funciones `create_order` y `track_cart` (sección 10 del SQL),
  que validan cada dato y limitan cuántos se aceptan por minuto. No hay INSERT directo desde la API.
- **Panel:** solo usuarios de la tabla `admins`. La función de facturación revisa el usuario y solo acepta llamadas desde la página.
- **Claves:** en el código solo está la clave publicable de Supabase (hecha para el navegador). El token de Factus y la clave
  `service_role` van solo como secretos de Supabase.
- **Cabeceras:** `_headers` (y `functions/_lib/seo.js` para las páginas generadas) activan CSP, HSTS, anti-iframe y más.
  Si cambias el `<script>` pequeño del `<head>` de `index.html`, actualiza su hash `sha256` en la CSP.
- **Pendiente en el panel de Supabase:** Authentication → Sign In / Providers → Email → activar
  *Leaked password protection* (puede requerir plan Pro) y usar una contraseña larga y única para la cuenta de la clienta.
- Cuando tengan dominio: agregarlo en el secreto `SITE_ORIGINS` de Edge Functions (p. ej. `https://reynassuperfoods.pe`).

## Pendiente

**Datos de la clienta**
- Correo de contacto, Gmail de la empresa y enlace de su Libro de Reclamaciones (Indecopi): se pegan en el panel → Inicio → Datos de tu empresa.

**Facturación**
- Token y documentación de Factus (Carlos) y confirmar series de boleta y factura (B002 / F002). Ver la sección siguiente.

**Prueba**
- La clienta prueba la web; se hacen los cambios que pida.

**Publicación en Google (cuando apruebe la web)**
1. Comprar el dominio y conectarlo en Cloudflare Pages (Custom domains); redirigir reynasuperfoods.pages.dev al dominio.
2. Cambiar el dominio en index.html (canonical, og:url, og:image, datos de empresa), robots.txt y el catálogo PDF (link y QR).
3. Google Search Console con el Gmail de la empresa: propiedad de dominio (verificación por DNS en Cloudflare) y enviar /sitemap.xml.
4. Cloudflare Web Analytics: Pages → proyecto → Metrics → Web Analytics → Enable (gratis, sin cookies).
5. Perfil de Negocio de Google con el Gmail de la empresa, como negocio de zona de servicio (solo envíos, sin dirección).

## Facturación electrónica (Factus)

Todo está listo y publicado; solo falta el acceso a la API.

1. Cuando el proveedor entregue el token y la URL del endpoint, en Supabase → Edge Functions → Secrets agrega:
   - `FACTUS_TOKEN` = el token
   - `FACTUS_URL` = la URL para emitir comprobantes
   (Nunca en el código ni en el repositorio.)
2. Con la documentación de Factus, ajusta los nombres de campos en `buildFactusPayload` y `readFactusResponse`
   de `emitir-comprobante.ts` y vuelve a publicar la función.
3. En el panel → Facturación, completa RUC, razón social, dirección y series (por defecto B002 y F002).
4. Las boletas preparadas antes de tener la API quedan como "Pendiente": se emiten con el botón "Emitir ahora".

## Rendimiento

- Celulares básicos, ahorro de datos o "reducir movimiento" activan el **modo liviano** (clase `lite` en `<html>`):
  mismo diseño, sin los efectos pesados (desenfoques, letras animadas, 3D, piezas borrosas de la portada).
- Las tarjetas usan miniaturas de 360 px (`assets/products/sm/`); la foto grande solo se baja en la ficha del producto.
  **Si cambias una foto en `assets/products/`, genera también su miniatura en `sm/`** (las que sube la dueña desde el panel no lo necesitan).
- La portada carga solo la primera diapositiva; las demás se bajan después.
