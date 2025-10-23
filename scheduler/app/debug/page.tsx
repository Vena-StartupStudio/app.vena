import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function DebugPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (!user) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug Page - Not Authenticated</h1>
        <p>Please sign in first.</p>
      </div>
    );
  }
  
  // Get ALL schedules for this user
  const { data: schedules, error: schedulesError } = await supabase
    .from('schedules')
    .select('*')
    .eq('owner_id', user.id);
  
  // Get registration data
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return (
    <div className="p-8 max-w-4xl mx-auto font-mono">
      <h1 className="text-2xl font-bold mb-6">Scheduler Debug Information</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify({ 
            id: user.id, 
            email: user.email,
            created_at: user.created_at 
          }, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Registration Data</h2>
        {regError ? (
          <p className="text-red-600">Error: {regError.message}</p>
        ) : (
          <pre className="text-sm overflow-auto">
            {JSON.stringify(registration, null, 2)}
          </pre>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Schedules ({schedules?.length || 0})</h2>
        {schedulesError ? (
          <p className="text-red-600">Error: {schedulesError.message}</p>
        ) : schedules && schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule, idx) => (
              <div key={schedule.id} className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold">Schedule #{idx + 1}</p>
                <pre className="text-sm overflow-auto mt-2">
                  {JSON.stringify(schedule, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No schedules found</p>
        )}
      </div>
      
      {schedules && schedules.length > 1 && (
        <div className="p-4 bg-red-100 border border-red-400 rounded">
          <h2 className="text-xl font-semibold mb-2 text-red-800">⚠️ DUPLICATE SCHEDULES DETECTED</h2>
          <p className="text-red-700 mb-4">
            You have {schedules.length} schedules. You should only have 1.
          </p>
          <div className="bg-white p-4 rounded">
            <p className="font-semibold mb-2">Run this SQL in Supabase to fix:</p>
            <pre className="text-sm overflow-auto bg-gray-900 text-green-400 p-4 rounded">
{`-- Delete duplicate schedules, keeping only the oldest
DELETE FROM schedules
WHERE id NOT IN (
  SELECT DISTINCT ON (owner_id) id
  FROM schedules
  ORDER BY owner_id, created_at ASC
);`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
