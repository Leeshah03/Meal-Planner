-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Recipes ────────────────────────────────────────────────────────────
create table recipes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  name        text not null,
  ingredients jsonb not null default '[]',
  prep_time   integer,
  created_at  timestamptz default now()
);

alter table recipes enable row level security;

create policy "Users manage own recipes"
  on recipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Week Plan ──────────────────────────────────────────────────────────
create table week_plan (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  week_start  date not null,
  day         integer not null check (day between 0 and 6),
  recipe_id   uuid references recipes(id) on delete set null,
  unique (user_id, week_start, day)
);

alter table week_plan enable row level security;

create policy "Users manage own week plan"
  on week_plan for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Pantry ─────────────────────────────────────────────────────────────
create table pantry (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users not null,
  name        text not null,
  quantity    numeric not null default 1,
  unit        text,
  added_at    timestamptz default now()
);

alter table pantry enable row level security;

create policy "Users manage own pantry"
  on pantry for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
