
-- Update the handle_new_user function to not require email confirmation for professors
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
      -- Auto-confirm professor emails
      UPDATE auth.users 
      SET email_confirmed_at = NOW(),
          confirmed_at = NOW()
      WHERE id = NEW.id;
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

-- Insert professor accounts with default password setup
-- Note: These will need to be created through Supabase Auth with password 'prof123'
-- The function above will auto-confirm their emails and assign proper roles
