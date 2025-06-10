-- Journal Articles table
create table journal_articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Conference Articles table
create table conference_articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Book Chapters table
create table book_chapters (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Patents table
create table patents (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teaching table
create table teaching (
    id uuid default uuid_generate_v4() primary key,
    course_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Students table
create table students (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    status text not null check (status in ('present', 'past')),
    year integer,
    thesis_title text,
    degree text not null check (degree in ('Bachelors', 'Masters', 'Doctoral')),
    joint_supervisor text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Talks table
create table talks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Awards table
create table awards (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    year integer not null,
    type text not null check (type in ('Awards', 'Editorial', 'Reviewer', 'Technical', 'Advisory')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table journal_articles enable row level security;
alter table conference_articles enable row level security;
alter table book_chapters enable row level security;
alter table patents enable row level security;
alter table teaching enable row level security;
alter table students enable row level security;
alter table talks enable row level security;
alter table awards enable row level security;


-- For journal_articles
create policy "Allow public read access"
on journal_articles
for select
to anon
using (true);

-- For conference_articles
create policy "Allow public read access"
on conference_articles
for select
to anon
using (true);

-- For book_chapters
create policy "Allow public read access"
on book_chapters
for select
to anon
using (true);

-- For patents
create policy "Allow public read access"
on patents
for select
to anon
using (true);

-- For teaching
create policy "Allow public read access"
on teaching
for select
to anon
using (true);

-- For students
create policy "Allow public read access"
on students
for select
to anon
using (true);

-- For talks
create policy "Allow public read access"
on talks
for select
to anon
using (true);

-- For awards
create policy "Allow public read access"
on awards
for select
to anon
using (true);