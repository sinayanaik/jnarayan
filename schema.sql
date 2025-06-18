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

-- Create enum for experience types
CREATE TYPE experience_type AS ENUM ('professional', 'administrative');

-- Create experiences table
CREATE TABLE experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type experience_type NOT NULL,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,  -- NULL means present
    location TEXT,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX experiences_type_order_idx ON experiences(type, order_index);

-- Enable Row Level Security
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users (read-only)
CREATE POLICY "Allow anonymous read access"
ON experiences FOR SELECT
TO anon
USING (true);

-- Create policy for authenticated users (full access)
CREATE POLICY "Allow authenticated full access"
ON experiences FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_experiences_updated_at
    BEFORE UPDATE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO experiences (type, title, institution, start_date, end_date, location, description, order_index)
VALUES
    -- Professional Experience
    ('professional', 'Assistant Professor', 'Indian Institute of Technology Patna', '2024-12-01', NULL, 'Bihar, India', 'Teaching and research in Mechanical Engineering department', 1),
    ('professional', 'Assistant Professor', 'Thapar Institute of Engineering & Technology', '2024-08-01', '2024-11-30', 'Patiala, India', 'Teaching and research in Mechanical Engineering', 2),
    ('professional', 'Postdoctoral Research Associate', 'Imperial College London', '2023-02-01', '2024-06-30', 'United Kingdom', 'Research in robotics and control systems', 3),
    ('professional', 'Postdoctoral Research Associate', 'University of Bayreuth', '2023-02-01', '2024-06-30', 'Germany', 'Research in rehabilitation robotics', 4),

    -- Administrative Experience
    ('administrative', 'Member of the Space Allocation Committee', 'Department of Mechanical Engineering, IIT Patna', '2025-01-01', NULL, 'Bihar, India', 'Managing space allocation for department resources', 1),
    ('administrative', 'Member of the Industry/Research Outreach Committee', 'Department of Mechanical Engineering at TIET', '2024-09-01', '2024-11-30', 'Patiala, India', 'Coordinating industry collaborations and research initiatives', 2),
    ('administrative', 'Member of the Experiential Learning Centre Committee', 'Department of Mechanical Engineering (Robotics and AI Group) at TIET', '2024-09-01', '2024-11-30', 'Patiala, India', 'Developing hands-on learning programs', 3);