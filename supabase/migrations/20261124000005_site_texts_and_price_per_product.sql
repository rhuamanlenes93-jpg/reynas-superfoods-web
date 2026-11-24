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
