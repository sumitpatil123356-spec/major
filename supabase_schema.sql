-- SUPABASE SCHEMA FOR RESHELF
-- Run this in your Supabase project's SQL Editor

-- OPTIONAL: If you want a clean reset and to delete old tables, uncomment the following 4 lines:
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop function if exists public.handle_new_user() cascade;
-- drop table if exists public.products;
-- drop table if exists public.profiles;

-- 1. Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  city text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Profile policies
create policy "Users can view and update their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category text not null,
  quantity text not null default '1 unit',
  purchase_date date not null default current_date,
  expiry_date date not null,
  notes text,
  owner text not null,
  donatable boolean default false,
  alert_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for products
alter table public.products enable row level security;

-- Product policies
create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

create policy "Users can view their own products or any donatable product"
  on public.products for select
  using (auth.uid() = user_id or donatable = true);

-- 3. Trigger to automatically create a profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'city', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
