create extension if not exists "pgcrypto";

create table if not exists public.devocional_purposes (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  tema text not null default 'Outro',
  tipo text not null default 'Oração',
  duracao integer not null check (duracao > 0),
  data_inicio date not null,
  dia_inicial_registro integer not null default 1 check (dia_inicial_registro > 0),
  status text not null default 'em_andamento',
  configuracao_versiculos text not null default 'auto',
  configuracao_louvores text not null default 'auto',
  versiculos_predefinidos jsonb not null default '{}'::jsonb,
  louvores_predefinidos jsonb not null default '{}'::jsonb,
  observacoes text not null default '',
  jejum jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id, user_id)
);

create table if not exists public.devocional_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose_id text not null,
  dia integer not null check (dia > 0),
  data date not null,
  oracao text not null default '',
  versiculo text not null default '',
  louvor text not null default '',
  o_que_deus_falou text not null default '',
  concluido boolean not null default false,
  resposta_recebida boolean not null default false,
  resposta jsonb not null default '{}'::jsonb,
  jejum jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, purpose_id, dia),
  foreign key (purpose_id, user_id)
    references public.devocional_purposes(id, user_id)
    on delete cascade
);

create index if not exists devocional_purposes_user_id_idx
  on public.devocional_purposes(user_id);

create index if not exists devocional_records_user_id_idx
  on public.devocional_records(user_id);

create index if not exists devocional_records_purpose_id_idx
  on public.devocional_records(purpose_id);

alter table public.devocional_purposes enable row level security;
alter table public.devocional_records enable row level security;

drop policy if exists "Usuários leem seus propósitos" on public.devocional_purposes;
drop policy if exists "Usuários criam seus propósitos" on public.devocional_purposes;
drop policy if exists "Usuários editam seus propósitos" on public.devocional_purposes;
drop policy if exists "Usuários apagam seus propósitos" on public.devocional_purposes;

create policy "Usuários leem seus propósitos"
on public.devocional_purposes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Usuários criam seus propósitos"
on public.devocional_purposes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuários editam seus propósitos"
on public.devocional_purposes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuários apagam seus propósitos"
on public.devocional_purposes
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Usuários leem seus registros" on public.devocional_records;
drop policy if exists "Usuários criam seus registros" on public.devocional_records;
drop policy if exists "Usuários editam seus registros" on public.devocional_records;
drop policy if exists "Usuários apagam seus registros" on public.devocional_records;

create policy "Usuários leem seus registros"
on public.devocional_records
for select
to authenticated
using (auth.uid() = user_id);

create policy "Usuários criam seus registros"
on public.devocional_records
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuários editam seus registros"
on public.devocional_records
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuários apagam seus registros"
on public.devocional_records
for delete
to authenticated
using (auth.uid() = user_id);
