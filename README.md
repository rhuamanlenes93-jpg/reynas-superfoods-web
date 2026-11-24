# Reyna’s Superfoods: tienda web

Catálogo de Reyna’s Superfoods S.A.C. con pedidos y cotizaciones por WhatsApp, y un panel de administración oculto.

- **Hosting:** Cloudflare Pages (sitio estático, sin paso de build).
- **Datos:** Supabase (productos, packs, pedidos, ajustes y fotos).
- **Diseño:** el diseño claro v9 (portada con slider de colores pastel, mega menú, tarjetas 3D, ficha de producto, carrito lateral). Letras Baloo 2 y Poppins. Fotos del catálogo PDF.

## Estructura

```
index.html                 página única
assets/css/styles.css      estilos (todos los colores y medidas en tokens)
assets/js/config.js        URL y clave publicable de Supabase, número de WhatsApp
assets/js/app.js           portada, tienda, ficha, carrito, pedido y panel (conectado a Supabase)
assets/hero/               imágenes de la portada (maca, lúcuma, maíz morado, camu camu)
assets/products/           fotos de los productos del catálogo PDF (la clave va en products.image_url)
assets/img/og.jpg          imagen al compartir el enlace
supabase/migrations/       esquema de la base de datos, en orden
supabase/seed/seed.sql     catálogo inicial del PDF (79 productos y 4 packs de ejemplo)
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

El panel se abre con el enlace **Administrar** al pie de la página o con Ctrl + Shift + A.

## Seguridad

- Los precios se guardan desde el panel y solo se muestran en la tienda si se activa **Mostrar precios en la tienda**. Mientras tanto la tienda dice “Precio por confirmar”.
- `config.js` solo tiene la **clave publicable**: está hecha para ir en el navegador. Los permisos los controla la seguridad por filas (RLS):
  - Cualquiera puede leer los productos activos y los ajustes, y crear pedidos nuevos (sin datos de boleta).
  - Solo los usuarios de la tabla `admins` pueden editar, ver pedidos y subir fotos.
- **Nunca** subir al repositorio la clave `service_role`, contraseñas ni el token de facturación. El token de facturación irá como secreto de una Supabase Edge Function.

## Pendiente

- Conexión con la facturación (Factus / Complexless vía Phuyusoft): Edge Function que emite la boleta con serie propia (por ejemplo B002) cuando la clienta marca el pedido como pagado.
- Mantener activo el plan gratis de Supabase: un Cloudflare Worker con cron que consulte la API cada pocos días.
- Dominio, Google Search Console y Perfil de Negocio de Google.
