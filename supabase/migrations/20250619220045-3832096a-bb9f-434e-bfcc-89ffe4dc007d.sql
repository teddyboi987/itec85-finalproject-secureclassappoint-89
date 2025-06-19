
-- First, create the approved_professors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.approved_professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the approved professor emails
INSERT INTO public.approved_professors (email, name, subject) VALUES
  ('cruz@cvsu.edu.ph', 'Prof. Cruz', 'Mathematics'),
  ('delapena@cvsu.edu.ph', 'Prof. Dela Pena', 'Physics'),
  ('garcia@cvsu.edu.ph', 'Prof. Garcia', 'Chemistry'),
  ('lim@cvsu.edu.ph', 'Prof. Lim', 'Biology'),
  ('ramos@cvsu.edu.ph', 'Prof. Ramos', 'English'),
  ('reyes@cvsu.edu.ph', 'Prof. Reyes', 'History'),
  ('santos@cvsu.edu.ph', 'Prof. Santos', 'Computer Science')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject;

-- Now manually confirm all existing professor accounts (only email_confirmed_at)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN (
  SELECT email FROM public.approved_professors
)
AND email_confirmed_at IS NULL;

-- Also ensure their profiles are properly set up as professors
UPDATE public.profiles 
SET role = 'professor'
WHERE email IN (
  SELECT email FROM public.approved_professors
)
AND role != 'professor';
