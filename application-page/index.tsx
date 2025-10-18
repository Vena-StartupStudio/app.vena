import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import RegistrationForm from './components/RegistrationForm';
import ConfirmationMessage from './components/ConfirmationMessage';
import { VenaLogo } from './components/icons/VenaLogo';

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSuccess = () => {
    setIsRegistered(true);
    // Wait for 3 seconds before redirecting
    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <VenaLogo className="mx-auto h-12 w-auto" />
        </div>
        {isRegistered ? (
          <ConfirmationMessage 
            title="Welcome to Vena!"
            message="Your account has been created successfully. We're redirecting you to your dashboard..."
          />
        ) : (
          <RegistrationForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
