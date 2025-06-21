create table public.certificate_templates (
  id uuid not null default gen_random_uuid (),
  name text not null,
  preview_url text null,
  template_json jsonb null,
  created_by uuid null,
  created_at timestamp without time zone null default now(),
  constraint certificate_templates_pkey primary key (id),
  constraint certificate_templates_created_by_fkey foreign KEY (created_by) references users (id)
) TABLESPACE pg_default;


create table public.course_certificates (
  id uuid not null default gen_random_uuid (),
  course_id uuid null,
  certificate_id uuid null,
  created_at timestamp without time zone null default now(),
  constraint course_certificates_pkey primary key (id),
  constraint course_certificates_certificate_id_fkey foreign KEY (certificate_id) references certificate_templates (id),
  constraint course_certificates_course_id_fkey foreign KEY (course_id) references courses (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.courses (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  category text null,
  features text[] null,
  mentors text[] null,
  tags text[] null,
  duration_days integer null,
  difficulty text null,
  image_url text null,
  video_url text null,
  is_published boolean null default false,
  created_by uuid null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  slug text null,
  constraint courses_pkey primary key (id),
  constraint courses_slug_key unique (slug),
  constraint courses_created_by_fkey foreign KEY (created_by) references users (id)
) TABLESPACE pg_default;


create table public.courses (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  category text null,
  features text[] null,
  mentors text[] null,
  tags text[] null,
  duration_days integer null,
  difficulty text null,
  image_url text null,
  video_url text null,
  is_published boolean null default false,
  created_by uuid null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  slug text null,
  constraint courses_pkey primary key (id),
  constraint courses_slug_key unique (slug),
  constraint courses_created_by_fkey foreign KEY (created_by) references users (id)


) TABLESPACE pg_default;

create table public.internship_certificates (
  id uuid not null default gen_random_uuid (),
  internship_id uuid null,
  certificate_id uuid null,
  created_at timestamp without time zone null default now(),
  constraint internship_certificates_pkey primary key (id),
  constraint internship_certificates_certificate_id_fkey foreign KEY (certificate_id) references certificate_templates (id),
  constraint internship_certificates_internship_id_fkey foreign KEY (internship_id) references internships (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.internship_subscriptions (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  internship_id uuid null,
  status text null default 'active'::text,
  progress jsonb null default '{}'::jsonb,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint internship_subscriptions_pkey primary key (id),
  constraint internship_subscriptions_internship_id_fkey foreign KEY (internship_id) references internships (id) on delete CASCADE,
  constraint internship_subscriptions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint internship_subscriptions_status_check check (
    (
      status = any (
        array[
          'active'::text,
          'cancelled'::text,
          'completed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;


create table public.internships (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  long_description text null,
  duration_days integer null,
  start_date date null,
  end_date date null,
  price_type text null default 'free'::text,
  price_value numeric(10, 2) null default 0,
  tags text[] null,
  mentors text[] null,
  features text[] null,
  requirements text[] null,
  benefits text[] null,
  certificate_count integer null default 1,
  location text null,
  mode text null default 'online'::text,
  application_link text null,
  max_applicants integer null,
  status text null default 'upcoming'::text,
  organization_name text null,
  rating numeric(2, 1) null default 0.0,
  review_count integer null default 0,
  image_url text null,
  is_published boolean null default false,
  created_by uuid null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  slug text null,
  constraint internships_pkey primary key (id),
  constraint internships_slug_key unique (slug),
  constraint internships_created_by_fkey foreign KEY (created_by) references users (id),
  constraint internships_mode_check check (
    (
      mode = any (
        array['online'::text, 'offline'::text, 'hybrid'::text]
      )
    )
  ),
  constraint internships_price_type_check check (
    (
      price_type = any (array['free'::text, 'paid'::text])
    )
  ),
  constraint internships_status_check check (
    (
      status = any (
        array[
          'upcoming'::text,
          'ongoing'::text,
          'completed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;


create table public.submissions (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  task_id uuid null,
  text_answer text null,
  code_snippet text null,
  code_link text null,
  file_url text null,
  image_urls text[] null,
  video_url text null,
  submission_type text null,
  time_spent_minutes integer null,
  status text null default 'pending'::text,
  rating numeric(2, 1) null,
  feedback text null,
  reviewer_id uuid null,
  submitted_at timestamp without time zone null default now(),
  reviewed_at timestamp without time zone null,
  updated_at timestamp without time zone null default now(),
  constraint submissions_pkey primary key (id),
  constraint submissions_reviewer_id_fkey foreign KEY (reviewer_id) references users (id),
  constraint submissions_task_id_fkey foreign KEY (task_id) references tasks (id) on delete CASCADE,
  constraint submissions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint submissions_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'approved'::text,
          'rejected'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;


create table public.tasks (
  id uuid not null default gen_random_uuid (),
  internship_id uuid null,
  title text not null,
  description text null,
  order_no integer null,
  assigned_day integer null,
  resource_links text[] null,
  reference_links text[] null,
  hints text[] null,
  attachment_urls text[] null,
  expected_output text null,
  submission_format text null,
  evaluation_criteria text[] null,
  estimated_time_hrs integer null,
  difficulty_level text null default 'medium'::text,
  video_tutorial_url text null,
  tags text[] null,
  is_mandatory boolean null default true,
  created_at timestamp without time zone null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_internship_id_fkey foreign KEY (internship_id) references internships (id) on delete CASCADE,
  constraint tasks_assigned_day_check check ((assigned_day > 0)),
  constraint tasks_difficulty_level_check check (
    (
      difficulty_level = any (array['easy'::text, 'medium'::text, 'hard'::text])
    )
  )
) TABLESPACE pg_default;


create table public.user_courses (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  course_id uuid null,
  started_at timestamp without time zone null default now(),
  progress_percent double precision null default 0,
  is_completed boolean null default false,
  completed_at timestamp without time zone null,
  certificate_url text null,
  certificate_id uuid null,
  constraint user_courses_pkey primary key (id),
  constraint user_courses_certificate_id_fkey foreign KEY (certificate_id) references certificate_templates (id),
  constraint user_courses_course_id_fkey foreign KEY (course_id) references courses (id) on delete CASCADE,
  constraint user_courses_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.user_internships (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  internship_id uuid null,
  started_at timestamp without time zone null default now(),
  completed_at timestamp without time zone null,
  progress_percent double precision null default 0,
  is_completed boolean null default false,
  certificate_url text null,
  certificate_id uuid null,
  feedback text null,
  submission_count integer null default 0,
  constraint user_internships_pkey primary key (id),
  constraint user_internships_certificate_id_fkey foreign KEY (certificate_id) references certificate_templates (id),
  constraint user_internships_internship_id_fkey foreign KEY (internship_id) references internships (id) on delete CASCADE,
  constraint user_internships_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;


create table public.users (
  id uuid not null,
  full_name text not null,
  role text null default 'user'::text,
  created_at timestamp without time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign KEY (id) references auth.users (id)
) TABLESPACE pg_default;