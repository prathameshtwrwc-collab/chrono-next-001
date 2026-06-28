create extension if not exists "pgcrypto";

do $$ begin
  create type public.organization_status as enum ('ACTIVE', 'INACTIVE');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.member_source_type as enum ('ORGANIZATION', 'DIRECT', 'REFERRAL');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.assessment_status as enum ('STARTED', 'COMPLETED', 'ABANDONED');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.chronotype_type as enum ('LARK', 'EAGLE', 'OWL');
exception when duplicate_object then null;
end $$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization_type text,
  unique_code text not null unique,
  status public.organization_status not null default 'ACTIVE',
  contact_person text,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_admins (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  clerk_user_id text unique,
  first_name text,
  last_name text,
  email text not null,
  phone text,
  role text not null default 'admin',
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  clerk_user_id text unique,
  source_type public.member_source_type not null default 'DIRECT',
  first_name text not null,
  last_name text not null,
  age int,
  gender text,
  country text,
  city text,
  pincode text,
  occupation text,
  email text not null unique,
  phone text,
  referral_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_member_id uuid references public.members(id) on delete set null,
  referred_member_id uuid references public.members(id) on delete set null,
  referral_code text not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_versions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version int not null,
  description text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  unique(name, version)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  assessment_version_id uuid references public.assessment_versions(id) on delete cascade,
  question_key text,
  question_text text not null,
  question_order int not null,
  question_type text not null default 'SINGLE_CHOICE',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade,
  option_text text not null,
  option_value text,
  score_value int,
  option_order int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  assessment_version_id uuid references public.assessment_versions(id) on delete restrict,
  status public.assessment_status not null default 'STARTED',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  question_id uuid references public.questions(id) on delete set null,
  question_key text,
  question_text text,
  selected_option_id uuid references public.question_options(id) on delete set null,
  answer_value text not null,
  score_value int,
  created_at timestamptz not null default now()
);

create table if not exists public.chronotype_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.assessments(id) on delete cascade,
  member_id uuid references public.members(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  chronotype public.chronotype_type not null,
  total_score int not null,
  confidence_score int not null,
  lark_score int not null,
  eagle_score int not null,
  owl_score int not null,
  generated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  chronotype public.chronotype_type not null,
  title text not null,
  description text not null,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.member_recommendations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  recommendation_id uuid references public.recommendations(id) on delete cascade,
  assigned_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete cascade,
  report_type text not null,
  report_url text,
  generated_at timestamptz not null default now()
);

create table if not exists public.organization_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  unique_code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.login_audit (
  id uuid primary key default gen_random_uuid(),
  user_type text,
  user_id text,
  ip_address text,
  login_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_type text not null,
  user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  created_at timestamptz not null default now()
);

insert into public.assessment_versions (name, version, description, status)
values ('Chronotype Assessment', 1, 'Initial production chronotype assessment', 'ACTIVE')
on conflict (name, version) do update set status = excluded.status;

insert into public.recommendations (chronotype, title, description, category)
values
  ('LARK', 'Protect morning focus', 'Schedule your highest-cognition work in the first half of the day.', 'work'),
  ('LARK', 'Earlier evening shutdown', 'Reduce intense light and work stimulation later in the evening.', 'sleep'),
  ('EAGLE', 'Anchor wake time', 'Keep wake time consistent within about one hour to protect rhythm stability.', 'sleep'),
  ('EAGLE', 'Use midday collaboration', 'Plan meetings and collaborative decisions around your strongest shared window.', 'work'),
  ('OWL', 'Avoid critical early tasks', 'Reserve deep work for later blocks when possible.', 'work'),
  ('OWL', 'Use morning light intentionally', 'Bright light after waking can reduce morning fog and stabilize timing.', 'light')
on conflict do nothing;

insert into public.organizations (name, organization_type, unique_code, status, contact_person, email)
values ('WelcomeCure HealthTech', 'PLATFORM_OWNER', 'WELCOME-CURE', 'ACTIVE', 'Super Admin', 'admin@welcomecure.com')
on conflict (unique_code) do nothing;
