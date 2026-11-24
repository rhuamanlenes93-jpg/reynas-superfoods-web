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
