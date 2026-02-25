-- Alhara App - Supabase Schema
-- Run this in your Supabase SQL editor to set up all tables and RLS policies

-- ============================================================
-- USERS TABLE
-- ============================================================
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  avatar_url text,
  location text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

-- Allow anyone to read profiles
create policy "Public profiles are viewable by everyone"
  on public.users for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Users can insert their own profile on signup
create policy "Users can insert their own profile"
  on public.users for insert with check (auth.uid() = id);


-- ============================================================
-- POSTS TABLE
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  subtitle text,
  description text not null default '',
  images text[] default '{}',
  tags text[] default '{}',
  price text,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

-- Anyone can view posts
create policy "Posts are publicly viewable"
  on public.posts for select using (true);

-- Authenticated users can insert posts
create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = user_id);

-- Users can update their own posts
create policy "Users can update own posts"
  on public.posts for update using (auth.uid() = user_id);

-- Users can delete their own posts
create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);


-- ============================================================
-- SAVED_POSTS TABLE
-- ============================================================
create table if not exists public.saved_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

alter table public.saved_posts enable row level security;

-- Users can only see their own saved posts
create policy "Users can view own saved posts"
  on public.saved_posts for select using (auth.uid() = user_id);

-- Users can save posts
create policy "Users can save posts"
  on public.saved_posts for insert with check (auth.uid() = user_id);

-- Users can unsave posts
create policy "Users can unsave posts"
  on public.saved_posts for delete using (auth.uid() = user_id);
