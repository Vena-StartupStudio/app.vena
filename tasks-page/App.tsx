import { useState, useEffect } from 'react';
import { supabase, sendTaskEmail } from './lib/supabaseClient';
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
    switch (status?.toLowerCase()) {
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
        return TaskStatus.Pending; // Default fallback
    }
  };

  const fetchData = async (user: User) => {
    const [assignmentRes, clientsRes, groupsRes] = await Promise.all([
      supabase
        .from('client_tasks')
        .select(`id, status, due_date, client:clients(id, name:client_name, avatar:client_avatar), task:tasks(id, title, description)`)
        .eq('task.creator_user_id', user.id),
      supabase.from('clients').select('*').eq('creator_user_id', user.id),
      supabase.from('client_groups').select(`*, group_members(client_id)`).eq('creator_user_id', user.id)
    ]);

    setTaskAssignments(assignmentRes.data || []);
    setClients(clientsRes.data?.map(c => ({ id: c.id, name: c.client_name, email: c.client_email, avatar: c.client_avatar || '' })) || []);
    setClientGroups(groupsRes.data?.map(g => ({ id: g.id, name: g.group_name, clientIds: g.group_members.map((m: any) => m.client_id) })) || []);
    setTasks(assignmentRes.data?.map(a => ({
      id: a.task.id,
      title: a.task.title,
      details: a.task.description,
      assignee: { type: 'client' as const, id: a.client.id },
      dueDate: a.due_date || '',
      status: mapStatusToEnum(a.status),
      reminder: false,
      deliveryMethod: 'email'
    })) || []);
  };

  const handleDataChange = () => {
    if (session) {
      fetchData(session);
    }
  };

  const handleEditTask = (task: Task) => {
    alert('Edit task: ' + task.title);
    // TODO: Implement edit functionality
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from('client_tasks').delete().eq('id', taskId);
    if (error) {
      alert('Error deleting task: ' + error.message);
    } else {
      handleDataChange();
    }
  };

  // Helper function to map TaskStatus enum to database string
  const mapEnumToDatabaseStatus = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Done:
        return 'Done';
      case TaskStatus.Pending:
        return 'Pending';
      case TaskStatus.Missed:
        return 'Missed';
      case TaskStatus.ReminderSent:
        return 'Reminder Sent';
      default:
        return 'Pending';
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    // @ts-ignore - Supabase type inference issue
    const { error } = await supabase.from('client_tasks').update({ status: mapEnumToDatabaseStatus(status) }).eq('id', taskId);
    if (error) {
      alert('Error updating status: ' + error.message);
    } else {
      // Send email notification to client
      try {
        const taskAssignment = taskAssignments.find(ta => ta.id === taskId);
        if (taskAssignment) {
          // Find the client details from the clients array
          const client = clients.find(c => c.id === taskAssignment.client.id);
          if (client) {
            await sendTaskEmail(
              taskId,
              client.email,
              client.name,
              taskAssignment.task.title,
              taskAssignment.task.description,
              taskAssignment.due_date || undefined,
              mapEnumToDatabaseStatus(status)
            );
            console.log('Task email sent successfully');
          }
        }
      } catch (emailError) {
        console.error('Failed to send task email:', emailError);
        // Don't show error to user as the status update was successful
      }

      handleDataChange();
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
      />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <TaskList
          tasks={tasks}
          clients={clients}
          clientGroups={clientGroups}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          user={session}
          assignments={taskAssignments}
          onDataChange={handleDataChange}
        />
      </main>
    </div>
  );
}

export default App;
