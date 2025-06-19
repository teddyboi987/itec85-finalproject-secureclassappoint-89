
-- First, let's create a table to store approved professor emails
CREATE TABLE IF NOT EXISTS public.approved_professors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the approved professor emails (these are the only emails that can become professors)
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

-- Update the handle_new_user function to only assign professor role to approved emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT := 'student';
  approved_prof RECORD;
BEGIN
  -- Check if email is admin
  IF NEW.email = 'admin@cvsu.edu.ph' THEN
    user_role := 'admin';
  ELSE
    -- Check if email is in approved professors list
    SELECT * INTO approved_prof 
    FROM public.approved_professors 
    WHERE email = NEW.email;
    
    IF FOUND THEN
      user_role := 'professor';
    END IF;
  END IF;

  INSERT INTO public.profiles (id, name, email, role, subject)
  VALUES (
    NEW.id,
    CASE 
      WHEN approved_prof.name IS NOT NULL THEN approved_prof.name
      ELSE COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    END,
    NEW.email,
    user_role,
    approved_prof.subject
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Update existing professor profiles to match the approved list
UPDATE public.profiles 
SET 
  name = ap.name,
  subject = ap.subject,
  role = 'professor'
FROM public.approved_professors ap
WHERE profiles.email = ap.email;

-- Remove professor role from any profiles not in the approved list
UPDATE public.profiles 
SET role = 'student', subject = NULL
WHERE role = 'professor' 
AND email NOT IN (SELECT email FROM public.approved_professors)
AND email != 'admin@cvsu.edu.ph';
