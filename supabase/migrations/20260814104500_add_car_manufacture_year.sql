alter table public.cars
add column if not exists manufacture_year integer;

update public.cars
set manufacture_year = substring(slug || ' ' || title from '(19[0-9]{2}|20[0-9]{2})')::integer
where manufacture_year is null
  and substring(slug || ' ' || title from '(19[0-9]{2}|20[0-9]{2})') is not null;

alter table public.cars
add constraint cars_manufacture_year_range
check (manufacture_year is null or manufacture_year between 1990 and 2035)
not valid;

alter table public.cars
validate constraint cars_manufacture_year_range;
