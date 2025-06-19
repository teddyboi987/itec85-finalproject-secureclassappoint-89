
-- First, let's check and update the RLS policies for the profiles table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id OR public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert any profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete any profile" 
  ON public.profiles 
  FOR DELETE 
  USING (public.get_current_user_role() = 'admin');

-- Update the handle_new_user function to set role based on email domain
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT := 'student';
BEGIN
  -- Check if it's a professor email (you can customize this logic)
  IF NEW.email LIKE '%@cvsu.edu.ph' AND NEW.email != 'admin@cvsu.edu.ph' THEN
    user_role := 'professor';
  ELSIF NEW.email = 'admin@cvsu.edu.ph' THEN
    user_role := 'admin';
  END IF;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    user_role
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;
