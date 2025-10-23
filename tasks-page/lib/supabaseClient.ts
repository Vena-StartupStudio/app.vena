import { createClient } from '@supabase/supabase-js';
import { Database } from '../types'; // We will generate this file for type safety

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env.local");
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Email service function
export const sendTaskEmail = async (
  taskId: string,
  clientEmail: string,
  clientName: string,
  taskTitle: string,
  taskDescription?: string,
  dueDate?: string,
  status: string = 'pending'
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('User must be authenticated to send emails');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-task-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        taskId,
        clientEmail,
        clientName,
        taskTitle,
        taskDescription,
        dueDate,
        status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending task email:', error);
    throw error;
  }
};
