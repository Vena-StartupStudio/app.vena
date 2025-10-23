import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export default async function HomePage({ searchParams }: { searchParams: { access_token?: string; refresh_token?: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  // Check if tokens are provided in query parameters
  if (searchParams.access_token && searchParams.refresh_token) {
    console.log('Tokens found in query params, attempting to set session...');
    
    // Create a client with the provided tokens
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseWithToken = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabaseWithToken.auth.setSession({
      access_token: searchParams.access_token,
      refresh_token: searchParams.refresh_token,
    });
    
    if (error) {
      console.error('Error setting session from query params:', error);
    } else if (data.user) {
      console.log('Session established from query params, user:', data.user.id);
      // Redirect without the tokens in URL
      redirect('/scheduler');
    }
  }
  
  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  console.log('Auth check:', { user: user?.id, error: authError });
  
  if (!user) {
    // If not logged in, redirect to sign-in with scheduler redirect parameter
    redirect('https://vena.software/signin.html?redirect=scheduler');
  }
  
  // Fetch the user's business name from registrations table
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('business_name')
    .eq('id', user.id)
    .single();
  
  console.log('Registration check:', { registration, error: regError });
  
  if (!registration?.business_name) {
    // If no business name, show error or redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Business Name Required</h1>
          <p>Please set up your business name in your profile first.</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>User ID: {user.id}</p>
            {regError && <p className="text-red-600">Error: {regError.message}</p>}
          </div>
        </div>
      </div>
    );
  }
  
  // Convert business name to slug (lowercase, replace spaces with hyphens)
  const baseSlug = registration.business_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Check if a schedule exists for this user, if not create one
  let { data: schedule } = await supabase
    .from('schedules')
    .select('slug')
    .eq('owner_id', user.id)
    .single();
  
  if (!schedule) {
    // Find an available slug by checking for conflicts
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const { data: existing } = await supabase
        .from('schedules')
        .select('id')
        .eq('slug', slug)
        .single();
      
      if (!existing) break;
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Create the schedule for this user
    const { error } = await supabase
      .from('schedules')
      .insert({
        owner_id: user.id,
        slug: slug,
        title: registration.business_name,
        timezone: 'Asia/Jerusalem',
        duration_minutes: 60,
        edit_token: crypto.randomUUID().replace(/-/g, ''),
      });
    
    if (error) {
      console.error('Error creating schedule:', error);
    }
    
    schedule = { slug };
  }
  
  // Redirect to the user's specific schedule page
  redirect(`/s/${schedule.slug}`);
}
