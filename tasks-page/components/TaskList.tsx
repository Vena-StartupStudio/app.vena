import React, { useMemo, useState, useEffect } from 'react';
import { Task, Client, TaskStatus, ClientGroup, TaskAssignment } from '../types';
import { EditIcon, TrashIcon, UsersIcon } from './Icons';
import StatusBadge from './StatusBadge';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface TaskListProps {
  tasks: Task[];
  clients: Client[];
  clientGroups: ClientGroup[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  user: User | null;
  assignments: TaskAssignment[];
  onDataChange: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, clients, clientGroups, onEditTask, onDeleteTask, onStatusChange, user, assignments = [], onDataChange }) => {
  const clientMap = useMemo(() => {
    return new Map(clients.map(client => [client.id, client]));
  }, [clients]);

  const groupMap = useMemo(() => {
    return new Map(clientGroups.map(group => [group.id, group]));
  }, [clientGroups]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  // Function to assign a task to clients
  const handleAssignTask = async (taskId: string, clientIds: string[]) => {
    if (clientIds.length === 0) return;

    const assignments = clientIds.map(clientId => ({
      task_id: taskId,
      client_id: clientId,
    }));

    // @ts-ignore - Supabase type inference issue
    const { error } = await supabase.from('client_tasks').insert(assignments);

    if (error) {
      alert('Error assigning task: ' + error.message);
    } else {
      alert('Task assigned successfully!');
    }
  };

  const getStatusChip = (status: string) => {
    switch (status?.toLowerCase()) { // Added safety check for status
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-lg shadow">
        <p className="text-gray-500">No follow-up tasks found. Click "Create Task" to add one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-purple-200 rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-purple-200">
          <thead className="bg-purple-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Client / Group</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Task</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Due</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-purple-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>\
          <tbody className="bg-white divide-y divide-purple-200">
            {sortedTasks.map((task) => {
              const { assignee } = task;
              const isGroup = assignee.type === 'group';
              const assigneeInfo = isGroup ? groupMap.get(assignee.id) : clientMap.get(assignee.id);

              return (
                <tr key={task.id} className="hover:bg-purple-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {isGroup ? (
                            <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                                <UsersIcon className="h-6 w-6 text-purple-500" />
                            </div>
                        ) : (
                            <img className="h-10 w-10 rounded-full object-cover" src={(assigneeInfo as Client)?.avatar} alt={assigneeInfo?.name} />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-purple-900">{assigneeInfo?.name}</div>
                        {isGroup && <div className="text-xs text-purple-500">{ (assigneeInfo as ClientGroup)?.clientIds.length} members</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-purple-900 font-semibold">{task.title}</div>
                    <div className="text-sm text-purple-600 max-w-xs truncate">{task.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={task.status} taskId={task.id} onStatusChange={onStatusChange} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                       <button onClick={() => onEditTask(task)} className="text-purple-600 hover:text-purple-900 transition-colors duration-150">
                          <EditIcon className="w-5 h-5" />
                       </button>
                       <button onClick={() => onDeleteTask(task.id)} className="text-red-600 hover:text-red-900 transition-colors duration-150">
                          <TrashIcon className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
             {sortedTasks.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-purple-500">
                        No follow-up tasks found. Click "Create Follow-Up" to add one.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
