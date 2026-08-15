alter table public.cars
  add column if not exists variants jsonb not null default '[]'::jsonb;
