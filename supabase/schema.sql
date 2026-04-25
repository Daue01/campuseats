create table if not exists public.users (
  id text primary key,
  role text not null check (role in ('student', 'vendor')),
  name text not null,
  email text not null,
  password_hash text not null,
  campus text,
  phone text,
  saved_vendor_ids text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists users_email_key on public.users (email);

create table if not exists public.vendor_profiles (
  id text primary key,
  user_id text not null unique references public.users(id) on delete cascade,
  business_name text not null,
  logo text not null,
  description text not null,
  location text not null,
  category text not null,
  phone text not null,
  views integer not null default 0,
  orders integer not null default 0,
  messages integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists vendor_profiles_user_id_idx on public.vendor_profiles (user_id);

create table if not exists public.products (
  id text primary key,
  vendor_id text not null references public.vendor_profiles(id) on delete cascade,
  title text not null,
  price integer not null check (price > 0),
  image text not null,
  description text not null,
  category text not null,
  in_stock boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_vendor_id_idx on public.products (vendor_id);

alter table public.users enable row level security;
alter table public.vendor_profiles enable row level security;
alter table public.products enable row level security;
