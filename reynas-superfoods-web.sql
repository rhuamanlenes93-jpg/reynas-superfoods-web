-- ============================================================
-- Reyna's Superfoods: base de datos completa (Supabase / Postgres)
-- Proyecto Supabase: cauphvgvqtcvmcsvbyry
-- Este archivo junta todo en orden: tablas, seguridad (RLS),
-- fotos, ajustes, textos editables y el catálogo inicial.
-- Ya está aplicado en la base de datos; sirve como respaldo o
-- para recrear el proyecto desde cero (SQL Editor > Run).
-- ============================================================

-- ------------------------------------------------------------
-- 1. init
-- ------------------------------------------------------------
-- Reyna's Superfoods: catálogo, packs, pedidos y administradores
-- Lectura pública solo de lo activo; escritura solo para administradores.
-- Los pedidos los puede crear cualquiera (vienen de la web), pero solo los lee el admin.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins a where a.user_id = (select auth.uid()));
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  category text not null check (category in ('har', 'gel', 'con', 'ext', 'fru', 'sec')),
  price numeric(10, 2) check (price is null or price >= 0),
  unit text check (unit is null or char_length(unit) <= 40),
  image_url text,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_sort_idx on public.products (category, sort);

create table public.packs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text,
  price numeric(10, 2) check (price is null or price >= 0),
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pack_items (
  pack_id uuid not null references public.packs (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  qty integer not null default 1 check (qty > 0),
  primary key (pack_id, product_id)
);
create index pack_items_product_idx on public.pack_items (product_id);

create table public.orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  customer_name text check (customer_name is null or char_length(customer_name) <= 120),
  customer_city text check (customer_city is null or char_length(customer_city) <= 120),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 100),
  status text not null default 'nuevo' check (status in ('nuevo', 'pagado', 'facturado', 'anulado')),
  invoice_series text,
  invoice_number text,
  invoice_pdf_url text,
  invoiced_at timestamptz
);
create index orders_created_idx on public.orders (created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger packs_touch before update on public.packs for each row execute function public.touch_updated_at();

alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.packs enable row level security;
alter table public.pack_items enable row level security;
alter table public.orders enable row level security;

-- admins: cada admin puede ver su propia fila (para saber si es admin)
create policy "admins_self_select" on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

-- products
create policy "products_public_read" on public.products for select to anon, authenticated
  using (active or (select public.is_admin()));
create policy "products_admin_insert" on public.products for insert to authenticated
  with check ((select public.is_admin()));
create policy "products_admin_update" on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "products_admin_delete" on public.products for delete to authenticated
  using ((select public.is_admin()));

-- packs
create policy "packs_public_read" on public.packs for select to anon, authenticated
  using (active or (select public.is_admin()));
create policy "packs_admin_insert" on public.packs for insert to authenticated
  with check ((select public.is_admin()));
create policy "packs_admin_update" on public.packs for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "packs_admin_delete" on public.packs for delete to authenticated
  using ((select public.is_admin()));

-- pack_items
create policy "pack_items_public_read" on public.pack_items for select to anon, authenticated
  using (true);
create policy "pack_items_admin_insert" on public.pack_items for insert to authenticated
  with check ((select public.is_admin()));
create policy "pack_items_admin_update" on public.pack_items for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "pack_items_admin_delete" on public.pack_items for delete to authenticated
  using ((select public.is_admin()));

-- orders: la web solo puede crear pedidos nuevos, sin datos de boleta
create policy "orders_public_insert" on public.orders for insert to anon, authenticated
  with check (status = 'nuevo' and invoice_series is null and invoice_number is null and invoice_pdf_url is null and invoiced_at is null);
create policy "orders_admin_read" on public.orders for select to authenticated
  using ((select public.is_admin()));
create policy "orders_admin_update" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "orders_admin_delete" on public.orders for delete to authenticated
  using ((select public.is_admin()));

-- permisos de tabla (RLS decide qué filas)
grant select on public.products, public.packs, public.pack_items to anon, authenticated;
grant insert, update, delete on public.products, public.packs, public.pack_items to authenticated;
grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;
grant select on public.admins to authenticated;
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- 2. move is admin private
-- ------------------------------------------------------------
-- La función is_admin() no debe ser llamable desde la API pública: se mueve a un esquema privado.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
alter function public.is_admin() set schema private;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- 3. settings and product photos
-- ------------------------------------------------------------
-- Ajustes de la tienda (por ahora: mostrar u ocultar precios) y fotos de productos en Storage.
create table public.settings (
  key text primary key check (key ~ '^[a-z_]{2,40}$'),
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;
create policy "settings_public_read" on public.settings for select to anon, authenticated using (true);
create policy "settings_admin_insert" on public.settings for insert to authenticated with check ((select private.is_admin()));
create policy "settings_admin_update" on public.settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
grant select on public.settings to anon, authenticated;
grant insert, update on public.settings to authenticated;
insert into public.settings (key, value) values ('show_prices', 'false'::jsonb);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 3145728, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "productos_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'productos' and (select private.is_admin()));
create policy "productos_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'productos' and (select private.is_admin())) with check (bucket_id = 'productos' and (select private.is_admin()));
create policy "productos_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'productos' and (select private.is_admin()));

update public.products set unit = 'Tambor de 25 kg' where category = 'ext';
update public.products set unit = 'Saco' where category in ('har', 'gel');

-- ------------------------------------------------------------
-- 4. align catalog v9
-- ------------------------------------------------------------
-- Se alinea la base de datos al catálogo del PDF (diseño claro v9):
-- categorías libres, descripción, packs como categoría "Packs y combos" y nota en los pedidos.
drop table if exists public.pack_items;
drop table if exists public.packs;
alter table public.products drop constraint if exists products_category_check;
alter table public.products add constraint products_category_check check (char_length(category) between 2 and 60);
alter table public.products add column if not exists description text check (description is null or char_length(description) <= 600);
alter table public.products add column if not exists is_example boolean not null default false;
alter table public.orders add column if not exists customer_note text check (customer_note is null or char_length(customer_note) <= 600);
delete from public.products;

-- ------------------------------------------------------------
-- 5. site texts and price per product
-- ------------------------------------------------------------
-- Textos editables de la página y precio visible por producto
create table if not exists public.site_texts (
  key text primary key check (key ~ '^[a-z0-9_.]{2,60}$'),
  value text not null check (char_length(value) <= 2000),
  updated_at timestamptz not null default now()
);
alter table public.site_texts enable row level security;
grant select on public.site_texts to anon, authenticated;
grant insert, update, delete on public.site_texts to authenticated;
create policy site_texts_public_read on public.site_texts for select to anon, authenticated using (true);
create policy site_texts_admin_insert on public.site_texts for insert to authenticated with check ((select private.is_admin()));
create policy site_texts_admin_update on public.site_texts for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy site_texts_admin_delete on public.site_texts for delete to authenticated using ((select private.is_admin()));
create trigger site_texts_touch before update on public.site_texts for each row execute function public.touch_updated_at();

alter table public.products add column if not exists show_price boolean not null default true;

-- ------------------------------------------------------------
-- 6. Catálogo inicial (79 productos y 4 packs de ejemplo)
-- ------------------------------------------------------------
-- Catálogo del PDF (diseño v9). image_url guarda la clave de la foto en assets/products/ o una URL de Supabase Storage.
insert into public.products (name, category, image_url, description, is_example, sort) values
('Maca negra gelatinizada','Superalimentos andinos','feat_maca',null,false,0),
('Maca negra','Superalimentos andinos','h_maca_negra',null,false,1),
('Maca roja','Superalimentos andinos','h_maca_roja',null,false,2),
('Maca amarilla','Superalimentos andinos','h_maca_amarilla',null,false,3),
('Maca comercial','Superalimentos andinos','h_maca_comercial',null,false,4),
('Lúcuma','Superalimentos andinos','h_lucuma',null,false,5),
('Maíz morado','Superalimentos andinos','h_maiz_morado',null,false,6),
('Camu camu','Superalimentos andinos','h_camu_camu',null,false,7),
('Cacao','Superalimentos andinos','h_cacao',null,false,8),
('Quinua','Superalimentos andinos','h_quinua',null,false,9),
('Quinua negra','Superalimentos andinos','h_quinua_negra',null,false,10),
('Kiwicha','Superalimentos andinos','h_kiwicha',null,false,11),
('Cañihua','Superalimentos andinos','h_canihua',null,false,12),
('Tarwi desamargado','Superalimentos andinos','h_tarwi_desamargado',null,false,13),
('Aguaje','Superalimentos andinos','h_aguaje',null,false,14),
('Huanarpo','Superalimentos andinos','h_huanarpo',null,false,15),
('Mashua amarilla','Superalimentos andinos','h_mashua_amarilla',null,false,16),
('Espirulina','Superalimentos andinos','h_espirulina',null,false,17),
('Algas','Superalimentos andinos','h_algas',null,false,18),
('Sauco','Superalimentos andinos','h_sauco',null,false,19),
('Noni','Superalimentos andinos','h_noni',null,false,20),
('Algarrobo','Superalimentos andinos','h_algarrobo',null,false,21),
('Avena','Granos, semillas y menestras','h_avena',null,false,22),
('Linaza','Granos, semillas y menestras','h_linaza',null,false,23),
('Chía','Granos, semillas y menestras','h_chia',null,false,24),
('7 semillas','Granos, semillas y menestras','h_7_semillas',null,false,25),
('Almendras','Granos, semillas y menestras','h_almendras',null,false,26),
('Maní granulado','Granos, semillas y menestras','h_mani_granulado',null,false,27),
('Arroz','Granos, semillas y menestras','h_arroz',null,false,28),
('Soja','Granos, semillas y menestras','h_soja',null,false,29),
('Habas','Granos, semillas y menestras','h_habas',null,false,30),
('Habas tostadas','Granos, semillas y menestras','h_habas_tostadas',null,false,31),
('Cebada','Granos, semillas y menestras','h_cebada',null,false,32),
('Maíz amarillo','Granos, semillas y menestras','h_maiz_amarillo',null,false,33),
('Arveja','Granos, semillas y menestras','h_arveja',null,false,34),
('Garbanzo','Granos, semillas y menestras','h_garbanzo',null,false,35),
('Fenogreco','Granos, semillas y menestras','h_fenogreco',null,false,36),
('Plátano','Raíces, frutas y verduras','h_platano',null,false,37),
('Camote','Raíces, frutas y verduras','h_camote',null,false,38),
('Yuca','Raíces, frutas y verduras','h_yuca',null,false,39),
('Zanahoria','Raíces, frutas y verduras','h_zanahoria',null,false,40),
('Beterraga','Raíces, frutas y verduras','h_beterraga',null,false,41),
('Arracacha','Raíces, frutas y verduras','h_arracacha',null,false,42),
('Kion','Raíces, frutas y verduras','h_kion',null,false,43),
('Cúrcuma','Raíces, frutas y verduras','h_curcuma',null,false,44),
('Cebolla','Raíces, frutas y verduras','h_cebolla',null,false,45),
('Ajos','Raíces, frutas y verduras','h_ajos',null,false,46),
('Higo','Raíces, frutas y verduras','h_higo',null,false,47),
('Mango','Raíces, frutas y verduras','h_mango',null,false,48),
('Alcachofa','Raíces, frutas y verduras','h_alcachofa',null,false,49),
('Acelga','Raíces, frutas y verduras','h_acelga',null,false,50),
('Nopal','Raíces, frutas y verduras','h_nopal',null,false,51),
('Té verde','Hierbas e infusiones','h_te_verde',null,false,52),
('Té negro','Hierbas e infusiones','h_te_negro',null,false,53),
('Té rojo','Hierbas e infusiones','h_te_rojo',null,false,54),
('Stevia','Hierbas e infusiones','h_stevia',null,false,55),
('Cedrón','Hierbas e infusiones','h_cedron',null,false,56),
('Muña','Hierbas e infusiones','h_muna',null,false,57),
('Toronjil','Hierbas e infusiones','h_toronjil',null,false,58),
('Orégano','Hierbas e infusiones','h_oregano',null,false,59),
('Romero','Hierbas e infusiones','h_romero',null,false,60),
('Tomillo','Hierbas e infusiones','h_tomillo',null,false,61),
('Clavo de olor','Hierbas e infusiones','h_clavo_de_olor',null,false,62),
('Achiote','Hierbas e infusiones','h_achiote',null,false,63),
('Sen','Hierbas e infusiones','h_sen',null,false,64),
('Pasuchaca','Hierbas e infusiones','h_pasuchaca',null,false,65),
('Alfalfa','Hierbas e infusiones','h_alfalfa',null,false,66),
('Paico','Hierbas e infusiones','h_paico',null,false,67),
('Eucalipto','Hierbas e infusiones','h_eucalipto',null,false,68),
('Chancapiedra','Hierbas e infusiones','h_chancapiedra',null,false,69),
('Camu camu','Extractos en polvo','x_camu_camu',null,false,70),
('Arándano rojo','Extractos en polvo','x_arandano_rojo',null,false,71),
('Arándano azul','Extractos en polvo','x_arandano_azul',null,false,72),
('Maracuyá','Extractos en polvo','x_maracuya',null,false,73),
('Fresa','Extractos en polvo','x_fresa',null,false,74),
('Uva','Extractos en polvo','x_uva',null,false,75),
('Granada','Extractos en polvo','x_granada',null,false,76),
('Açaí','Extractos en polvo','x_acai',null,false,77),
('Pitahaya','Extractos en polvo','x_pitahaya',null,false,78),
('Pack Energía andina','Packs y combos','p_energia','Maca negra, maca roja, maca amarilla y cacao. Para batidos y desayunos con energía.',true,79),
('Pack Desayuno andino','Packs y combos','p_desayuno','Quinua, kiwicha, cañihua y avena. Para papillas, panqueques y bowls.',true,80),
('Combo Antioxidante','Packs y combos','p_antioxidante','Extractos en polvo de camu camu, arándano azul, açaí y maracuyá. Para jugos y smoothies.',true,81),
('Pack Repostería natural','Packs y combos','p_reposteria','Lúcuma, cacao, almendras y plátano. Para queques, galletas y helados.',true,82);

-- ------------------------------------------------------------
-- 7. Facturación electrónica y código de pedido
-- ------------------------------------------------------------
-- código corto del pedido (va en el mensaje de WhatsApp)
alter table public.orders add column if not exists code text check (code is null or code ~ '^R-[A-Z0-9]{4,8}$');

-- comprobantes electrónicos (boletas y facturas)
create table if not exists public.invoices (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  order_id bigint references public.orders(id) on delete set null,
  doc_type text not null check (doc_type in ('boleta','factura')),
  series text check (series is null or series ~ '^[BF][A-Z0-9]{3}$'),
  number text,
  customer_doc_type text not null default 'dni' check (customer_doc_type in ('dni','ruc','ce','ninguno')),
  customer_doc text check (customer_doc is null or char_length(customer_doc) <= 15),
  customer_name text check (customer_name is null or char_length(customer_name) <= 200),
  customer_address text check (customer_address is null or char_length(customer_address) <= 300),
  items jsonb not null default '[]'::jsonb,
  igv_type text not null default 'gravado' check (igv_type in ('gravado','exonerado')),
  subtotal numeric(12,2) not null default 0,
  igv numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'pendiente' check (status in ('pendiente','aceptado','rechazado','anulado','error')),
  message text,
  pdf_url text, xml_url text,
  pse_response jsonb,
  issued_at timestamptz
);
create index if not exists invoices_order_idx on public.invoices(order_id);
alter table public.invoices enable row level security;
grant select, insert, update, delete on public.invoices to authenticated;
grant usage on sequence public.invoices_id_seq to authenticated;
create policy invoices_admin_all on public.invoices for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- ajustes de facturación (sin secretos: el token va como secreto de la Edge Function)
insert into public.settings (key, value) values
  ('billing', '{"ruc":"","razon_social":"","direccion":"","serie_boleta":"B002","serie_factura":"F002","igv_type":"gravado","ambiente":"pruebas"}'::jsonb)
on conflict (key) do nothing;

-- =========================================================
-- 8. Estadísticas del carrito (dashboard del panel)
--    Cada vez que un visitante agrega un producto al carrito se guarda
--    solo el producto y la cantidad (ningún dato del cliente).
-- =========================================================
create table if not exists public.cart_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  product_id text not null check (char_length(product_id) between 1 and 80),
  product_name text not null check (char_length(product_name) between 1 and 160),
  qty integer not null default 1 check (qty between 1 and 50)
);
create index if not exists cart_events_created_idx on public.cart_events (created_at desc);
alter table public.cart_events enable row level security;
grant insert on public.cart_events to anon, authenticated;
grant select, delete on public.cart_events to authenticated;
create policy cart_events_public_insert on public.cart_events for insert to anon, authenticated with check (true);
create policy cart_events_admin_read on public.cart_events for select to authenticated using ((select private.is_admin()));
create policy cart_events_admin_delete on public.cart_events for delete to authenticated using ((select private.is_admin()));
