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
