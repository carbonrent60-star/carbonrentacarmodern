create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_id text,
  entity_title text,
  summary text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_logs_created_at_idx
  on public.admin_activity_logs (created_at desc);

alter table public.admin_activity_logs enable row level security;

