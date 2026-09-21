-- Abu Coffee Digital Menu database
-- Run once in the Supabase SQL editor before using the app.

create extension if not exists "uuid-ossp";

-- Remove the legacy transaction tables before applying this schema.
drop table if exists public.waiter_calls cascade;
drop table if exists public.orders cascade;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null default 'Utensils',
  sort_order integer not null default 0,
  active boolean not null default true,
  translations jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  category text not null references public.categories(id) on update cascade,
  image text not null default '',
  tags text[] not null default '{}'::text[],
  rating numeric(3, 1) not null default 0,
  reviews integer not null default 0,
  prep_time text not null default '',
  ingredients text[] not null default '{}'::text[],
  customizations jsonb not null default '[]'::jsonb,
  translations jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.bank_accounts (
  id text primary key,
  bank_name text not null,
  account_name text not null,
  account_number text not null,
  type text not null default 'cbe',
  color text not null default '#166534',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.restaurant_settings (
  id text primary key default 'default',
  restaurant_name text not null,
  tagline text not null default 'Digital menu for your restaurant',
  theme text not null default 'forest',
  mode text not null default 'light' check (mode in ('light', 'dark')),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  table_number text not null default 'Customer',
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- Bring installations created from the earlier schema up to date.
alter table public.menu_items add column if not exists active boolean not null default true;
alter table public.menu_items add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());
alter table public.bank_accounts add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());
alter table public.restaurant_settings add column if not exists mode text not null default 'light';

-- Remove the four records created by the previous local demo seeding code.
delete from public.bank_accounts
where id in ('bank-cbe', 'bank-telebirr', 'bank-boa', 'bank-awash');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.restaurant_settings enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Admin users can read their own record" on public.admin_users;
create policy "Admin users can read their own record"
  on public.admin_users for select
  using (id = auth.uid());

drop policy if exists "Anyone can read active categories" on public.categories;
create policy "Anyone can read active categories"
  on public.categories for select
  using (active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read active menu items" on public.menu_items;
create policy "Anyone can read active menu items"
  on public.menu_items for select
  using (active = true or public.is_admin());

drop policy if exists "Admins manage menu items" on public.menu_items;
create policy "Admins manage menu items"
  on public.menu_items for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read bank accounts" on public.bank_accounts;
create policy "Anyone can read bank accounts"
  on public.bank_accounts for select
  using (true);

drop policy if exists "Admins manage bank accounts" on public.bank_accounts;
create policy "Admins manage bank accounts"
  on public.bank_accounts for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can read restaurant settings" on public.restaurant_settings;
create policy "Anyone can read restaurant settings"
  on public.restaurant_settings for select
  using (true);

drop policy if exists "Admins manage restaurant settings" on public.restaurant_settings;
create policy "Admins manage restaurant settings"
  on public.restaurant_settings for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Anyone can submit a review" on public.reviews;
create policy "Anyone can submit a review"
  on public.reviews for insert
  with check (true);

drop policy if exists "Admins can read reviews" on public.reviews;
create policy "Admins can read reviews"
  on public.reviews for select
  using (public.is_admin());

drop policy if exists "Admins manage reviews" on public.reviews;
create policy "Admins manage reviews"
  on public.reviews for delete
  using (public.is_admin());

-- Create the admin in Authentication first, then run this for that user's email:
-- insert into public.admin_users (id, email)
-- select id, email from auth.users where email = 'admin@example.com';

-- Refresh PostgREST so the client sees newly created tables immediately.
notify pgrst, 'reload schema';
