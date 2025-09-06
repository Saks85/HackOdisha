-- Create profiles table for Supabase Auth
-- Run this in your Supabase SQL editor or with your DB migrations tool

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  wallet text
);

-- Create a function + trigger to keep profiles in sync when an auth user is created
-- This inserts a profile row when a new user is created in auth.users
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = coalesce(excluded.email, public.profiles.email);
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users (fires after insert)
create trigger handle_new_auth_user
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Optional: enable Row Level Security and add policies so users can read/update only their profile
-- Uncomment and run these if you want strict per-user access control

-- alter table public.profiles enable row level security;
--
-- create policy "Profiles are viewable by owner" on public.profiles
--   for select using ( auth.uid() = id );
--
-- create policy "Profiles are editable by owner" on public.profiles
--   for update using ( auth.uid() = id );

-- Notes:
-- 1) Run this in Supabase SQL editor. Triggers on auth.users require the SQL to be executed by a user with appropriate privileges (Supabase SQL editor works fine).
-- 2) If you prefer to manually manage profile rows, you can omit the trigger and upsert profiles from your app server on sign-up.
