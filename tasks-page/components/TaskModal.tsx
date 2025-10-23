import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Client, ClientGroup, Task } from '../types';
import { CloseIcon } from './Icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onTaskCreated: (taskData: any) => void;
  clients: Client[];
  clientGroups: ClientGroup[];
  editingTask?: Task | null; // ADD THIS PROP
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onTaskCreated, 
  clients = [], 
  clientGroups = [],
  editingTask // ADD THIS
}) => {
  // State for the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [sendReminder, setSendReminder] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.details);
      setDueDate(editingTask.dueDate.split('T')[0]); // Format for date input
      setSelectedClient(editingTask.assignee.id);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setSelectedClient('');
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      due_date: dueDate,
      client_id: selectedClient,
      // Add other required fields...
    };

    await onTaskCreated(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-purple-800">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
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
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
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
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
