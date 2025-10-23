import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Client, ClientGroup, Task } from '../types';
import { CloseIcon } from './Icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onTaskCreated: () => void; // Changed to just be a signal
  clients: Client[];
  clientGroups: ClientGroup[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, user, onTaskCreated, clients = [], clientGroups = [] }) => {
  // State for the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('all');
  const [dueDate, setDueDate] = useState('');
  const [sendReminder, setSendReminder] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setSendReminder(false);
      // Set a smart default for the assignee
      if (clients.length === 1 && clientGroups.length === 0) {
        setAssignee(`client-${clients[0].id}`);
      } else {
        setAssignee('all');
      }
    }
  }, [isOpen, clients, clientGroups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    // Step 1: Create the main task template
    // @ts-ignore - Supabase type inference issue
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .insert({ creator_user_id: user.id, title, description } as any)
      .select().single();

    if (taskError || !taskData) {
      alert('Error creating task: ' + (taskError?.message || 'Unknown error'));
      return;
    }

    // Step 2: Determine which clients to assign
    let clientIdsToAssign: string[] = [];
    if (assignee.startsWith('client-')) {
      clientIdsToAssign.push(assignee.replace('client-', ''));
    } else if (assignee.startsWith('group-')) {
      const groupId = assignee.replace('group-', '');
      const group = clientGroups.find(g => g.id === groupId);
      if (group) clientIdsToAssign = group.clientIds;
    } else if (assignee === 'all') {
      clientIdsToAssign = clients.map(c => c.id);
    }

    if (clientIdsToAssign.length === 0) {
      alert('Task template created, but no clients were assigned.');
      onTaskCreated();
      onClose();
      return;
    }

    // Step 3: Create assignments
    const assignments = clientIdsToAssign.map(clientId => ({
      task_id: (taskData as any).id,
      client_id: clientId,
      status: 'Pending',
      due_date: dueDate || null,
    }));

    // @ts-ignore - Supabase type inference issue
    const { error: assignmentError } = await supabase.from('client_tasks').insert(assignments as any);

    if (assignmentError) {
      alert('Task created, but failed to assign: ' + assignmentError.message);
    } else {
      alert('Task created and assigned successfully!');
      onTaskCreated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-purple-800">Create Follow-Up</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <CloseIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-purple-700">Task Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Morning Mobility Video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-purple-700">Details (optional)</label>
              <textarea
                id="description"
                placeholder="e.g., Follow the 15-minute yoga video."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="assignee" className="block text-sm font-medium text-purple-700">Client / Group</label>
                <select
                  id="assignee"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Clients</option>
                  <optgroup label="Groups">
                    {clientGroups.map(group => <option key={group.id} value={`group-${group.id}`}>{group.name}</option>)}
                  </optgroup>
                  <optgroup label="Individual Clients">
                    {clients.map(client => <option key={client.id} value={`client-${client.id}`}>{client.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-purple-700">When to send</label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="sendReminder"
                type="checkbox"
                checked={sendReminder}
                onChange={(e) => setSendReminder(e.target.checked)}
                className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="sendReminder" className="ml-2 block text-sm text-gray-700">Send a reminder if not done</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
