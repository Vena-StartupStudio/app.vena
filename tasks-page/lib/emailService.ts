import { supabase } from './supabaseClient';

// Existing function - sends emails immediately
export async function sendTaskEmail(
  taskId: string,
  clientEmail: string,
  clientName: string,
  taskTitle: string,
  status: string,
  taskDescription?: string,
  dueDate?: string
) {
  try {
    console.log('Sending email with data:', {
      taskId,
      clientEmail,
      clientName,
      taskTitle,
      status,
      taskDescription,
      dueDate
    });

    const { data, error } = await supabase.functions.invoke('send-task-email', {
      body: {
        taskId,
        clientEmail,
        clientName,
        taskTitle,
        taskDescription,
        dueDate,
        status
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      return null;
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending task email:', error);
    return null;
  }
}

// NEW: Function to schedule emails for later
export async function scheduleTaskEmail(
  taskId: string,
  clientEmail: string,
  clientName: string,
  taskTitle: string,
  status: string,
  scheduledFor: Date, // When to send the email
  taskDescription?: string,
  dueDate?: string
) {
  try {
    console.log('Scheduling email for:', scheduledFor);

    // Store the scheduled email in database
    const { data, error } = await supabase
      .from('scheduled_emails') // You need to create this table first
      .insert({
        task_id: taskId,
        client_email: clientEmail,
        client_name: clientName,
        task_title: taskTitle,
        task_description: taskDescription,
        due_date: dueDate,
        status: status,
        scheduled_for: scheduledFor.toISOString(),
        sent: false
      });

    if (error) {
      console.error('Error scheduling email:', error);
      throw error;
    }

    console.log('Email scheduled successfully:', data);
    return data;
  } catch (error) {
    console.error('Error scheduling email:', error);
    throw error;
  }
}

// Your existing function - this creates a reminder
export async function scheduleReminderEmail(
  taskId: string,
  clientEmail: string,
  clientName: string,
  taskTitle: string,
  dueDate: string,
  reminderDaysBefore: number = 1
) {
  // Calculate when to send the reminder
  const dueDateTime = new Date(dueDate);
  const reminderDate = new Date(dueDateTime.getTime() - (reminderDaysBefore * 24 * 60 * 60 * 1000));
  
  // Schedule the email
  return scheduleTaskEmail(
    taskId,
    clientEmail,
    clientName,
    taskTitle,
    'Reminder Sent',
    reminderDate, // Send on this date
    `Reminder: This task is due on ${dueDateTime.toLocaleDateString()}`,
    dueDate
  );
}