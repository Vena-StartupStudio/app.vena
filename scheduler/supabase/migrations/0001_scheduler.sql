set search_path = public;

create extension if not exists "pgcrypto" with schema public;
create extension if not exists "btree_gist" with schema public;

create type booking_status as enum ('held', 'booked', 'canceled');

create table schedules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null default 'My Schedule',
  timezone text not null default 'Europe/Berlin',
  edit_token text not null unique,
  created_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9-]{3,}$')
);

create table availability_windows (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references schedules(id) on delete cascade,
  weekday int not null check (weekday between 1 and 7),
  start_minute int not null check (start_minute between 0 and 1439),
  end_minute int not null check (end_minute between 1 and 1440),
  slot_minutes int not null check (slot_minutes in (15, 20, 30, 45, 60)),
  created_at timestamptz not null default now(),
  constraint window_valid_range check (end_minute > start_minute)
);

alter table availability_windows
  add constraint window_no_overlap
  exclude using gist (
    schedule_id with =,
    weekday with =,
    int4range(start_minute, end_minute, '[]') with &&
  );

create table bookings (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references schedules(id) on delete cascade,
  start_ts timestamptz not null,
  end_ts timestamptz not null,
  guest_name text not null,
  guest_phone text not null check (guest_phone ~ '^\+[1-9][0-9]{6,14}$'),
  status booking_status not null default 'booked',
  hold_expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint booking_valid_range check (end_ts > start_ts),
  unique (schedule_id, start_ts, end_ts)
);

create index bookings_schedule_start_idx on bookings (schedule_id, start_ts);
create index availability_windows_schedule_weekday_idx on availability_windows (schedule_id, weekday);

alter table schedules enable row level security;
alter table availability_windows enable row level security;
alter table bookings enable row level security;
alter table bookings force row level security;

-- Owner policies
create policy "Owner manage schedules" on schedules
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owner manage windows" on availability_windows
  using (
    exists (
      select 1
        from schedules s
       where s.id = availability_windows.schedule_id
         and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
        from schedules s
       where s.id = availability_windows.schedule_id
         and s.owner_id = auth.uid()
    )
  );

create policy "Owner manage bookings" on bookings
  using (
    exists (
      select 1
        from schedules s
       where s.id = bookings.schedule_id
         and s.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
        from schedules s
       where s.id = bookings.schedule_id
         and s.owner_id = auth.uid()
    )
  );

-- Public read access limited to metadata via grants.
create policy "Public schedule lookup" on schedules
  for select using (true);

create policy "Public availability lookup" on availability_windows
  for select using (
    exists (
      select 1
        from schedules s
       where s.id = availability_windows.schedule_id
    )
  );

-- Allow booking insert with defaults
create policy "Public insert bookings" on bookings
  for insert
  with check (
    coalesce(current_setting('request.jwt.claim.role', true), 'anon') in ('anon', 'authenticated')
    and status = 'booked'
    and hold_expires_at is null
  );

create policy "Public read bookings" on bookings
  for select using (
    exists (
      select 1
        from schedules s
       where s.id = bookings.schedule_id
    )
  );

revoke all on schedules from public;
revoke all on availability_windows from public;
revoke all on bookings from public;

revoke all on schedules from anon, authenticated;
revoke all on availability_windows from anon, authenticated;
revoke all on bookings from anon, authenticated;

-- Column-level grants for metadata
grant select (slug, title, timezone, owner_id) on schedules to anon, authenticated;

grant select, insert, update, delete on schedules to authenticated;
grant select, insert, update, delete on availability_windows to authenticated;
grant select, update, delete on bookings to authenticated;
grant insert on bookings to anon, authenticated;

grant select, insert, update, delete on schedules, availability_windows, bookings to service_role;

drop view if exists public_bookings;
create or replace view public_bookings with (security_barrier = true) as
select schedule_id, start_ts, end_ts, status
  from bookings
 where status <> 'canceled';

grant select on public_bookings to anon, authenticated;

create or replace function attempt_booking(
  p_schedule_id uuid,
  p_start_ts timestamptz,
  p_end_ts timestamptz,
  p_guest_name text,
  p_guest_phone text
) returns bookings
language plpgsql
set search_path = public
as $$
declare
  v_schedule schedules%rowtype;
  v_window availability_windows%rowtype;
  v_booking bookings%rowtype;
  v_duration_minutes int;
  v_local_start timestamp;
  v_local_end timestamp;
  v_weekday int;
  v_start_minute int;
  v_end_minute int;
  v_lock_key bigint;
begin
  if p_end_ts <= p_start_ts then
    raise exception using message = 'INVALID_RANGE';
  end if;

  if p_start_ts < now() then
    raise exception using message = 'PAST_SLOT';
  end if;

  select * into v_schedule
    from schedules
   where id = p_schedule_id
   limit 1;

  if not found then
    raise exception using message = 'SCHEDULE_NOT_FOUND';
  end if;

  v_duration_minutes := round(extract(epoch from (p_end_ts - p_start_ts)) / 60.0);

  if v_duration_minutes <= 0 then
    raise exception using message = 'INVALID_DURATION';
  end if;

  v_local_start := p_start_ts at time zone v_schedule.timezone;
  v_local_end := p_end_ts at time zone v_schedule.timezone;
  v_weekday := extract(isodow from v_local_start)::int;
  v_start_minute := (extract(hour from v_local_start)::int * 60) + extract(minute from v_local_start)::int;
  v_end_minute := (extract(hour from v_local_end)::int * 60) + extract(minute from v_local_end)::int;

  if v_end_minute <= v_start_minute then
    raise exception using message = 'INVALID_LOCAL_RANGE';
  end if;

  select * into v_window
    from availability_windows
   where schedule_id = p_schedule_id
     and weekday = v_weekday
     and start_minute <= v_start_minute
     and end_minute >= v_end_minute
   order by start_minute
   limit 1;

  if not found then
    raise exception using message = 'OUTSIDE_AVAILABILITY';
  end if;

  if v_duration_minutes <> v_window.slot_minutes then
    raise exception using message = 'INVALID_SLOT_DURATION';
  end if;

  if mod(v_start_minute - v_window.start_minute, v_window.slot_minutes) <> 0 then
    raise exception using message = 'INVALID_SLOT_ALIGNMENT';
  end if;

  v_lock_key := hashtextextended(concat_ws('|', p_schedule_id::text, p_start_ts::text, p_end_ts::text), 0);
  perform pg_advisory_xact_lock(v_lock_key);

  if exists (
    select 1
      from bookings b
     where b.schedule_id = p_schedule_id
       and b.status = 'booked'
       and tstzrange(b.start_ts, b.end_ts, '[)') && tstzrange(p_start_ts, p_end_ts, '[)')
  ) then
    raise exception using message = 'SLOT_TAKEN';
  end if;

  insert into bookings (schedule_id, start_ts, end_ts, guest_name, guest_phone, status)
  values (p_schedule_id, p_start_ts, p_end_ts, p_guest_name, p_guest_phone, 'booked')
  returning * into v_booking;

  return v_booking;
end;
$$;

grant execute on function attempt_booking(uuid, timestamptz, timestamptz, text, text) to anon, authenticated, service_role;

