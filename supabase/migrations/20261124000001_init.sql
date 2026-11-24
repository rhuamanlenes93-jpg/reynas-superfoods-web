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
