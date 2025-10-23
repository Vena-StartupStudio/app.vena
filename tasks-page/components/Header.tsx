import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { VenaLogo, PlusIcon, UsersIcon, SignOutIcon } from './Icons';
import TaskModal from './TaskModal';
import ClientManagementModal from './ClientManagementModal';
import { Client, ClientGroup } from '../types';

interface HeaderProps {
  user: User | null;
  clients: Client[];
  clientGroups: ClientGroup[];
  onDataChange: () => void; // Add this prop
}

const Header: React.FC<HeaderProps> = ({ user, clients, clientGroups, onDataChange }) => {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isClientModalOpen, setClientModalOpen] = useState(false);

  // Function to handle signing out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener in App.tsx will handle redirecting to the login page.
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <VenaLogo className="w-20" />
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={() => setTaskModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Task
                </button>
                <button
                  onClick={() => setClientModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <UsersIcon className="w-5 h-5" />
                  Manage Clients
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
              )}
              {/* Add the Sign Out button here */}
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <SignOutIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        user={user}
        onTaskCreated={onDataChange}
        clients={clients}
        clientGroups={clientGroups}
      />
      <ClientManagementModal
        isOpen={isClientModalOpen}
        onClose={() => setClientModalOpen(false)}
        user={user}
        onDataChange={onDataChange}
        // Pass the data down to the client modal
        clients={clients}
        clientGroups={clientGroups}
      />
    </>
  );
};

export default Header;