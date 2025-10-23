import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { sendTaskEmail, scheduleReminderEmail } from './lib/emailService';
import { User } from '@supabase/supabase-js';
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import TaskList from './components/TaskList';
import { Client, ClientGroup, TaskAssignment, Task, TaskStatus } from './types';

function App() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientGroups, setClientGroups] = useState<ClientGroup[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null); // ADD THIS STATE

  useEffect(() => {
    // First, check if there's an existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session.user);
        fetchData(session.user).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Then set up the listener for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session.user);
        fetchData(session.user);
      } else {
        setSession(null);
        setTaskAssignments([]);
        setClients([]);
        setClientGroups([]);
        setTasks([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to map database status to TaskStatus enum
  const mapStatusToEnum = (status: string): TaskStatus => {
    console.log('Mapping database status to enum:', status);
    switch (status?.toLowerCase()) {
      case 'assigned':
        return TaskStatus.Assigned;
      case 'done':
      case 'completed':
        return TaskStatus.Done;
      case 'pending':
        return TaskStatus.Pending;
      case 'missed':
        return TaskStatus.Missed;
      case 'reminder sent':
      case 'reminder_sent':
        return TaskStatus.ReminderSent;
      default:
        console.warn(`Unknown status from database: ${status}`);
        return TaskStatus.Pending;
    }
  };

  // Helper function to map TaskStatus enum to database string
  const mapEnumToDatabaseStatus = (status: TaskStatus): string => {
    console.log('Mapping enum to database status:', status);
    switch (status) {
      case TaskStatus.Assigned:
        return 'Assigned';
      case TaskStatus.Done:
        return 'completed'; // Make sure this matches what your dropdown sends
      case TaskStatus.Pending:
        return 'pending';
      case TaskStatus.Missed:
        return 'Missed';
      case TaskStatus.ReminderSent:
        return 'Reminder Sent';
      default:
        return 'pending';
    }
  };

  const fetchData = async (user: User) => {
    const [assignmentRes, clientsRes, groupsRes] = await Promise.all([
      supabase
        .from('client_tasks')
        .select(`id, status, due_date, client:clients(id, name:client_name, email:client_email, avatar:client_avatar), task:tasks(id, title, description)`)
        .eq('task.creator_user_id', user.id),
      supabase.from('clients').select('*').eq('creator_user_id', user.id),
      supabase.from('client_groups').select(`*, group_members(client_id)`).eq('creator_user_id', user.id)
    ]);

    setTaskAssignments(assignmentRes.data || []);
    setClients(clientsRes.data?.map(c => ({ id: c.id, name: c.client_name, email: c.client_email, avatar: c.client_avatar || '' })) || []);
    setClientGroups(groupsRes.data?.map(g => ({ id: g.id, name: g.group_name, clientIds: g.group_members.map((m: any) => m.client_id) })) || []);
    
    // FIX: Use assignment ID (a.id) instead of task ID (a.task.id)
    setTasks(assignmentRes.data?.map(a => ({
      id: a.id, // This should be the client_tasks assignment ID, not a.task.id
      title: a.task.title,
      details: a.task.description,
      assignee: { type: 'client' as const, id: a.client.id },
      dueDate: a.due_date || '',
      status: mapStatusToEnum(a.status),
      reminder: false,
      deliveryMethod: 'email',
      taskId: a.task.id // Store the actual task ID separately if needed
    })) || []);
  };

  const fetchClients = async () => {
    if (!session) return;
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('creator_user_id', session.id);

    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }

    setClients(data?.map(c => ({ 
      id: c.id, 
      name: c.client_name, 
      email: c.client_email, 
      avatar: c.client_avatar || '' 
    })) || []);
  };

  const handleDataChange = async () => {
    if (session) {
      await fetchData(session);
    }
  };

  const handleEditTask = (task: Task) => {
    console.log('Editing task:', task);
    setEditingTask(task); // Set the task to be edited
  };

  const handleUpdateTask = async (taskData: {
    id: string;
    title: string;
    description: string;
    due_date: string;
    client_id: string;
  }) => {
    try {
      console.log('Updating task:', taskData);

      // Update the task in the tasks table
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          title: taskData.title,
          description: taskData.description
        })
        .eq('id', taskData.id);

      if (taskError) throw taskError;

      // Update the assignment in client_tasks table
      const { error: assignmentError } = await supabase
        .from('client_tasks')
        .update({
          due_date: taskData.due_date,
          client_id: taskData.client_id
        })
        .eq('id', editingTask?.id); // Use the assignment ID

      if (assignmentError) throw assignmentError;

      console.log('Task updated successfully');
      setEditingTask(null); // Close the edit modal
      await handleDataChange(); // Refresh data

    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: ' + (error as Error).message);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('client_tasks').delete().eq('id', taskId);
    if (error) {
      alert('Error deleting task: ' + error.message);
    } else {
      handleDataChange();
    }
  };

  // KEEP ONLY THIS handleStatusChange FUNCTION - REMOVE EMAIL SENDING
  const handleStatusChange = async (assignmentId: string, status: TaskStatus) => {
    try {
      console.log('=== STATUS UPDATE DEBUG ===');
      console.log('Assignment ID:', assignmentId);
      console.log('New Status:', status);
      console.log('Status as string:', mapEnumToDatabaseStatus(status));
      
      // Check if this task exists in our local state
      const taskExists = tasks.find(t => t.id === assignmentId);
      console.log('Task exists in local state:', !!taskExists);
      console.log('Current task status:', taskExists?.status);

      // Update in database
      const { data, error } = await supabase
        .from('client_tasks')
        .update({ status: mapEnumToDatabaseStatus(status) })
        .eq('id', assignmentId)
        .select();

      if (error) {
        console.error('Database update error:', error);
        throw error;
      }

      console.log('Database updated successfully:', data);
      console.log('Updated rows count:', data?.length);

      // Update local state immediately
      console.log('Updating local state...');
      setTasks(prevTasks => {
        const updated = prevTasks.map(task => 
          task.id === assignmentId 
            ? { ...task, status: status }
            : task
        );
        console.log('Local state updated. New tasks:', updated.map(t => ({ id: t.id, status: t.status })));
        return updated;
      });

      // REMOVED: Email sending code

      // Refresh data from database
      console.log('Refreshing data from database...');
      await handleDataChange();
      console.log('Data refresh completed');

    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Error updating status: ' + (error as Error).message);
    }
  };

  // ADD NEW FUNCTION FOR MANUAL EMAIL SENDING
  const handleNotifyClient = async (assignmentId: string) => {
    try {
      console.log('Sending notification for assignment:', assignmentId);

      // Find the task and client info
      const taskAssignment = taskAssignments.find(ta => ta.id === assignmentId);
      const task = tasks.find(t => t.id === assignmentId);
      
      if (!taskAssignment || !task) {
        alert('Task information not found');
        return;
      }

      const client = clients.find(c => c.id === taskAssignment.client.id);
      if (!client || !client.email) {
        alert('Client email not found');
        return;
      }

      // Send email notification
      await sendTaskEmail(
        assignmentId,
        client.email,
        client.name,
        taskAssignment.task.title,
        mapEnumToDatabaseStatus(task.status),
        taskAssignment.task.description,
        taskAssignment.due_date || undefined
      );

      console.log('Notification sent successfully');
      alert('Notification sent to ' + client.name);

    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification: ' + (error as Error).message);
    }
  };

  // ADD THIS FUNCTION
  const createTask = async (taskData: {
    title: string;
    description: string;
    due_date: string;
    client_id: string;
    task_id: string; // This should be the ID from your tasks table
  }) => {
    try {
      // 1. Create the task assignment in database
      const { data: task, error } = await supabase
        .from('client_tasks')
        .insert({
          task_id: taskData.task_id,
          client_id: taskData.client_id,
          due_date: taskData.due_date,
          status: 'Pending'
        })
        .select(`
          id,
          due_date,
          status,
          client:clients(id, client_name, client_email),
          task:tasks(id, title, description)
        `)
        .single();

      if (error) throw error;

      // 2. Schedule reminder email
      if (task.due_date && task.client?.client_email) {
        await scheduleReminderEmail(
          task.id,
          task.client.client_email,
          task.client.client_name,
          task.task.title,
          task.due_date,
          1 // 1 day before due date
        );
        console.log('Reminder email scheduled for task:', task.id);
      }

      // 3. Refresh the data
      await handleDataChange();

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50/50 flex items-center justify-center">
        <p className="text-purple-700">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50/50">
      <Header 
        user={session} 
        clients={clients} 
        clientGroups={clientGroups}
        onDataChange={handleDataChange}
        onCreateTask={createTask}
        editingTask={editingTask} // ADD THIS PROP
        onUpdateTask={handleUpdateTask} // ADD THIS PROP
        onCancelEdit={handleCancelEdit} // ADD THIS PROP
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TaskList
          tasks={tasks}
          clients={clients}
          clientGroups={clientGroups}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onNotifyClient={handleNotifyClient}
          user={session}
          assignments={taskAssignments}
          onDataChange={handleDataChange}
        />
      </main>
    </div>
  );
}

export default App;
