create table if not exists public.cars (
  id text primary key,
  slug text not null unique,
  brand text not null,
  title text not null,
  category text not null,
  seats integer,
  baggage integer,
  small_baggage integer,
  thumbnail text not null default '',
  fuel text not null default 'Benzin',
  engine text,
  transmission text not null default 'Avtomat',
  wedding_available boolean not null default false,
  wedding_thumbnail text,
  wedding_price integer,
  wedding_description text,
  rental_visible boolean not null default true,
  transfer_available boolean not null default false,
  transfer_prices jsonb not null default '{}'::jsonb,
  rental_prices jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cars_slug_idx on public.cars (slug);
create index if not exists cars_sort_order_idx on public.cars (sort_order, title);
create index if not exists cars_category_idx on public.cars (category);
create index if not exists cars_public_flags_idx
  on public.cars (is_active, rental_visible, transfer_available, wedding_available);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cars_set_updated_at on public.cars;
create trigger cars_set_updated_at
before update on public.cars
for each row
execute function public.set_updated_at();

alter table public.cars enable row level security;

drop policy if exists "Public can read active cars" on public.cars;
create policy "Public can read active cars"
on public.cars
for select
to anon, authenticated
using (is_active = true);

grant usage on schema public to anon, authenticated;
grant select on public.cars to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('carbon-car-images', 'carbon-car-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read carbon car images" on storage.objects;
create policy "Public can read carbon car images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'carbon-car-images');

create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  description text not null default '',
  image text not null default '',
  images text[],
  date date not null default current_date,
  category text not null default 'Blog',
  reading_time text not null default '5 dəq',
  eyebrow text not null default '',
  intro text not null default '',
  sections jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_date_idx on public.blog_posts (date desc);
create index if not exists blog_posts_sort_order_idx on public.blog_posts (sort_order, date desc);
create index if not exists blog_posts_public_idx on public.blog_posts (is_active, sort_order);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row
execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read active blog posts" on public.blog_posts;
create policy "Public can read active blog posts"
on public.blog_posts
for select
to anon, authenticated
using (is_active = true);

grant select on public.blog_posts to anon, authenticated;
