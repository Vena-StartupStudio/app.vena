import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Client, ClientGroup } from '../types';
import { CloseIcon, EditIcon, TrashIcon, UsersIcon, UserPlusIcon, PlusIcon } from './Icons';

interface ClientManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDataChange: () => void;
  clients: Client[]; // Add this prop
  clientGroups: ClientGroup[]; // Add this prop
}

const ClientManagementModal: React.FC<ClientManagementModalProps> = ({ isOpen, onClose, user, onDataChange, clients, clientGroups }) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'groups'>('clients');
  
  // Client state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAvatar, setClientAvatar] = useState('');

  // --- NEW: Group state ---
  const [editingGroup, setEditingGroup] = useState<ClientGroup | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedClientsForGroup, setSelectedClientsForGroup] = useState<string[]>([]);

  const resetClientForm = () => {
    setEditingClient(null);
    setClientName('');
    setClientEmail('');
    setClientAvatar('');
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientName(client.name);
    setClientEmail(client.email);
    setClientAvatar(client.avatar);
  };

  const handleClientFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !user) return;

    const clientData = {
      creator_user_id: user.id,
      client_name: clientName,
      client_email: clientEmail,
      client_avatar: clientAvatar || `https://i.pravatar.cc/150?u=${clientEmail}`,
    };

    let result;
    if (editingClient) {
      // @ts-ignore - Supabase type inference issue
      result = await supabase.from('clients').update(clientData).eq('id', editingClient.id).select().single();
    } else {
      // @ts-ignore - Supabase type inference issue
      result = await supabase.from('clients').insert(clientData).select().single();
    }

    const { data, error } = result;

    if (error) {
      alert('Error saving client: ' + error.message);
    } else if (data) {
      const newClient = {
        id: data.id,
        name: data.client_name,
        email: data.client_email,
        avatar: data.client_avatar || `https://i.pravatar.cc/150?u=${data.client_email}`,
      };
      if (editingClient) {
        // Use the prop function to update the client list
        onDataChange();
      } else {
        // Use the prop function to update the client list
        onDataChange();
      }
      resetClientForm();
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    const { error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) {
      alert('Error deleting client: ' + error.message);
    } else {
      // Use the prop function to update the client list
      onDataChange();
    }
  };

  // --- NEW: Group form functions ---
  const resetGroupForm = () => {
    setEditingGroup(null);
    setGroupName('');
    setSelectedClientsForGroup([]);
  };

  const handleGroupFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !user) return;

    // Step 1: Create the group
    // @ts-ignore - Supabase type inference issue
    const { data: groupData, error: groupError } = await supabase
      .from('client_groups')
      .insert({ creator_user_id: user.id, group_name: groupName } as any)
      .select()
      .single();

    if (groupError || !groupData) {
      alert('Error creating group: ' + (groupError?.message || 'Unknown error'));
      return;
    }

    // Step 2: Add members to the group
    if (selectedClientsForGroup.length > 0) {
      const membersToInsert = selectedClientsForGroup.map(clientId => ({
        group_id: groupData.id,
        client_id: clientId,
      }));
      // @ts-ignore - Supabase type inference issue
      const { error: membersError } = await supabase.from('group_members').insert(membersToInsert as any);
      if (membersError) {
        alert('Group created, but failed to add members: ' + membersError.message);
      }
    }

    // Refresh UI
    // Use the prop function to update the group list
    onDataChange();
    resetGroupForm();
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group? This cannot be undone.')) return;
    const { error } = await supabase.from('client_groups').delete().eq('id', groupId);
    if (error) alert('Error deleting group: ' + error.message);
    else {
      // Use the prop function to update the group list
      onDataChange();
    }
  };

  const handleClientSelectionForGroup = (clientId: string) => {
    setSelectedClientsForGroup(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-purple-800">Manage Clients & Groups</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <CloseIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'clients' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            <UsersIcon className="w-5 h-5 inline-block mr-2" />
            Clients
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'groups' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            <UsersIcon className="w-5 h-5 inline-block mr-2" />
            Groups
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-purple-700 mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h3>
                <form onSubmit={handleClientFormSubmit} className="p-4 bg-purple-50 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="email" placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div className="flex justify-end gap-2">
                    {editingClient && <button type="button" onClick={resetClientForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>}
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center gap-2">
                      <UserPlusIcon className="w-5 h-5" />
                      {editingClient ? 'Save Changes' : 'Add Client'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-purple-700">Existing Clients ({clients.length})</h3>
                <ul className="space-y-2">
                  {clients.map(client => (
                    <li key={client.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50">
                      <div className="flex items-center gap-3">
                        <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <span className="font-medium text-purple-800">{client.name}</span>
                          <p className="text-sm text-purple-500">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleEditClient(client)} className="text-purple-500 hover:text-purple-600"><EditIcon className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteClient(client.id)} className="text-purple-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* --- NEW: Group Management UI --- */}
          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-purple-700 mb-4">Add New Group</h3>
                <form onSubmit={handleGroupFormSubmit} className="p-4 bg-purple-50 rounded-lg space-y-4">
                  <input type="text" placeholder="Group Name (e.g., 'Morning Stretch Club')" value={groupName} onChange={e => setGroupName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <div>
                    <h4 className="text-sm font-medium text-purple-600 mb-2">Add Clients to Group ({selectedClientsForGroup.length})</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2 p-2 border rounded-md bg-white">
                      {clients.map(client => (
                        <label key={client.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                          <input type="checkbox" checked={selectedClientsForGroup.includes(client.id)} onChange={() => handleClientSelectionForGroup(client.id)} className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500" />
                          <img src={client.avatar} alt={client.name} className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-medium text-sm text-gray-700">{client.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 flex items-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      Create Group
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-purple-700">Existing Groups ({clientGroups.length})</h3>
                <ul className="space-y-2">
                  {clientGroups.map(group => (
                    <li key={group.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <span className="font-semibold text-purple-800">{group.name}</span>
                        <p className="text-sm text-purple-500">{group.clientIds.length} member(s)</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Edit button can be added later */}
                        <button onClick={() => handleDeleteGroup(group.id)} className="text-purple-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagementModal;
