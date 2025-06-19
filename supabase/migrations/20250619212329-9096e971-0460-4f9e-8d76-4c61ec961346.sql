
-- Insert professor accounts into the profiles table
INSERT INTO public.profiles (id, name, email, role, subject) VALUES
  (gen_random_uuid(), 'Prof. Cruz', 'cruz@cvsu.edu.ph', 'professor', 'Mathematics'),
  (gen_random_uuid(), 'Prof. Dela Pena', 'delapena@cvsu.edu.ph', 'professor', 'Physics'),
  (gen_random_uuid(), 'Prof. Garcia', 'garcia@cvsu.edu.ph', 'professor', 'Chemistry'),
  (gen_random_uuid(), 'Prof. Lim', 'lim@cvsu.edu.ph', 'professor', 'Biology'),
  (gen_random_uuid(), 'Prof. Ramos', 'ramos@cvsu.edu.ph', 'professor', 'English'),
  (gen_random_uuid(), 'Prof. Reyes', 'reyes@cvsu.edu.ph', 'professor', 'History'),
  (gen_random_uuid(), 'Prof. Santos', 'santos@cvsu.edu.ph', 'professor', 'Computer Science')
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  subject = EXCLUDED.subject;

-- Create auth users for professors (they will use password: prof123)
-- Note: In a real system, you would use Supabase Admin API to create these users
-- For now, professors will need to sign up with their @cvsu.edu.ph email and the system will auto-assign them as professors
