-- ============================================================
-- Abu Coffee Ethiopia · Digital Menu & Admin Database Schema
-- Run this script in the Supabase SQL Editor (SQL Editor -> New query)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  order_type text not null check (order_type in ('dine-in', 'delivery')),
  table_number text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0.00,
  delivery_details jsonb,
  offer_applied text,
  status text not null default 'pending' check (status in ('pending', 'preparing', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. WAITER CALLS TABLE
create table if not exists public.waiter_calls (
  id uuid primary key default uuid_generate_v4(),
  table_number text not null,
  reason text not null,
  timestamp text,
  resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  table_number text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MENU ITEMS TABLE
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0.00,
  category text not null,
  image text,
  tags text[] default '{}'::text[],
  rating numeric(3, 1) default 5.0,
  reviews integer default 0,
  prep_time text,
  ingredients text[] default '{}'::text[],
  customizations jsonb default '[]'::jsonb,
  translations jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. BANK ACCOUNTS TABLE
create table if not exists public.bank_accounts (
  id text primary key,
  bank_name text not null,
  account_name text not null,
  account_number text not null,
  type text default 'cbe',
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.waiter_calls enable row level security;
alter table public.reviews enable row level security;
alter table public.menu_items enable row level security;
alter table public.bank_accounts enable row level security;

-- Permissive public policies for the demo / storefront & admin operations
-- (In high-security environments, restrict update/delete to authenticated admin roles)
create policy "Allow all operations on orders" on public.orders for all using (true) with check (true);
create policy "Allow all operations on waiter_calls" on public.waiter_calls for all using (true) with check (true);
create policy "Allow all operations on reviews" on public.reviews for all using (true) with check (true);
create policy "Allow all operations on menu_items" on public.menu_items for all using (true) with check (true);
create policy "Allow all operations on bank_accounts" on public.bank_accounts for all using (true) with check (true);

-- Enable Realtime subscriptions for orders, waiter calls, and bank accounts
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.waiter_calls;
alter publication supabase_realtime add table public.bank_accounts;
