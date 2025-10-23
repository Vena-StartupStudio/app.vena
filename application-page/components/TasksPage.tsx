import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from './tasks/Header';
import TaskList from './tasks/TaskList';
import TaskModal from './tasks/TaskModal';
import ClientManagementModal from './tasks/ClientManagementModal';
import { User, Task, Client, ClientGroup, TaskAssignment } from '../types/tasks';
import { sendTaskEmail, scheduleReminderEmail } from '../lib/emailService';

const TasksPage: React.FC = () => {
  const [session, setSession] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientGroups, setClientGroups] = useState<ClientGroup[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session?.user || null);
      if (session?.user) {
        fetchData(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user || null);
      if (session?.user) {
        fetchData(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (user: User) => {
    try {
      const [assignmentRes, clientsRes, groupsRes] = await Promise.all([
        supabase
          .from('client_tasks')
          .select(`
            id, 
            status, 
            due_date, 
            client_id,
            group_id,
            client:clients(id, name:client_name, email:client_email, avatar:client_avatar), 
            task:tasks(id, title, description),
            group:client_groups(id, name:group_name)
          `)
          .eq('task.creator_user_id', user.id),
        supabase.from('clients').select('*').eq('creator_user_id', user.id),
        supabase.from('client_groups').select(`*, group_members(client_id)`).eq('creator_user_id', user.id)
      ]);

      setTaskAssignments(assignmentRes.data || []);
      setClients(clientsRes.data?.map(c => ({ 
        id: c.id, 
        name: c.client_name, 
        email: c.client_email, 
        avatar: c.client_avatar || '' 
      })) || []);
      setClientGroups(groupsRes.data?.map(g => ({ 
        id: g.id, 
        name: g.group_name, 
        clientIds: g.group_members.map((m: any) => m.client_id) 
      })) || []);
      
      setTasks(assignmentRes.data?.map(a => ({
        id: a.id,
        title: a.task.title,
        details: a.task.description,
        assignee: a.group_id 
          ? { type: 'group' as const, id: a.group_id }
          : { type: 'client' as const, id: a.client_id },
        dueDate: a.due_date || '',
        status: mapStatusToEnum(a.status),
        reminder: false,
        deliveryMethod: 'email',
        taskId: a.task.id
      })) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const mapStatusToEnum = (status: string) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in_progress': return 'in-progress';
      case 'pending': return 'pending';
      default: return 'pending';
    }
  };

  const handleDataChange = () => {
    if (session) {
      fetchData(session);
    }
  };

  const createTask = async (taskData: any) => {
    try {
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Create task
      const { data: newTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: taskData.title,
          description: taskData.description,
          creator_user_id: session.id
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Create assignment
      const assignmentData: any = {
        task_id: newTask.id,
        due_date: taskData.due_date,
        status: 'pending'
      };

      if (taskData.assignee_type === 'client' && taskData.client_id) {
        assignmentData.client_id = taskData.client_id;
      } else if (taskData.assignee_type === 'group' && taskData.group_id) {
        assignmentData.group_id = taskData.group_id;
      } else {
        throw new Error('Invalid assignee data');
      }

      const { data: assignment, error: assignmentError } = await supabase
        .from('client_tasks')
        .insert(assignmentData)
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      await handleDataChange();
      return assignment;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleNotifyClient = async (assignmentId: string) => {
    try {
      const taskAssignment = taskAssignments.find(ta => ta.id === assignmentId);
      const task = tasks.find(t => t.id === assignmentId);
      
      if (!taskAssignment || !task) {
        alert('Task information not found');
        return;
      }

      const professionalName = session?.user_metadata?.full_name || 
                              session?.email?.split('@')[0] || 
                              'Your Wellness Professional';

      if (task.assignee.type === 'group') {
        const group = clientGroups.find(g => g.id === task.assignee.id);
        if (!group) {
          alert('Group not found');
          return;
        }

        const groupClients = clients.filter(c => group.clientIds.includes(c.id));
        
        if (groupClients.length === 0) {
          alert('No clients found in this group');
          return;
        }

        const emailPromises = groupClients.map(client => 
          sendTaskEmail(
            assignmentId,
            client.email,
            client.name,
            taskAssignment.task.title,
            'pending',
            taskAssignment.task.description,
            taskAssignment.due_date || undefined,
            professionalName
          )
        );

        await Promise.all(emailPromises);
        alert(`Notification sent to ${groupClients.length} members of ${group.name}`);

      } else {
        const client = clients.find(c => c.id === task.assignee.id);
        if (!client || !client.email) {
          alert('Client email not found');
          return;
        }

        await sendTaskEmail(
          assignmentId,
          client.email,
          client.name,
          taskAssignment.task.title,
          'pending',
          taskAssignment.task.description,
          taskAssignment.due_date || undefined,
          professionalName
        );

        alert('Notification sent to ' + client.name);
      }

    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification: ' + (error as Error).message);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access tasks</h2>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={session} 
        clients={clients}
        clientGroups={clientGroups}
        onDataChange={handleDataChange}
        onCreateTask={createTask}
        editingTask={editingTask}
        onUpdateTask={() => {}}
        onCancelEdit={() => setEditingTask(null)}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-purple-900 mb-8">Follow-Up Tasks</h1>
          
          <TaskList
            tasks={tasks}
            clients={clients}
            clientGroups={clientGroups}
            onEditTask={setEditingTask}
            onDeleteTask={() => {}}
            onStatusChange={() => {}}
            onNotifyClient={handleNotifyClient}
            user={session}
            assignments={taskAssignments}
            onDataChange={handleDataChange}
          />
        </div>
      </main>
    </div>
  );
};

export default TasksPage;