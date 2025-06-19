const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4aWx6Y2R3dmNtaGdland4bnJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMyMzIzNCwiZXhwIjoyMDY1ODk5MjM0fQ.wHtobYgoVY4hGMcd9hFuCG_re4CUqDO22zWL8Vjml74'
);

async function main() {
  // 1. Get all auth users
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  for (const user of users.users) {
    // 2. Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!profile) {
      // 3. Insert profile if missing
      await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          // Add other fields if needed
        },
      ]);
      console.log(`Inserted profile for ${user.email}`);
    }
  }
}

main().catch(console.error);