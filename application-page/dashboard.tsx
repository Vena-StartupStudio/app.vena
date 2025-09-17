import React from 'react';
import ReactDOM from 'react-dom/client';
import VenaProfileEditor from './pages/ProfileEditor/components/VenaProfileEditor';

// Try importing the ProfileEditor
try {
  const VenaProfileEditor = React.lazy(() => import('./pages/ProfileEditor/components/VenaProfileEditor'));
  
  const Dashboard: React.FC = () => {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <VenaProfileEditor />
      </React.Suspense>
    );
  };
} catch (error) {
  // Fallback if ProfileEditor can't be imported
  const Dashboard: React.FC = () => {
    return (
      <div className="min-h-screen bg-red-100 p-8">
        <h1 className="text-4xl font-bold text-center text-red-600">
          ProfileEditor Import Error
        </h1>
        <p className="text-center mt-4 text-gray-600">
          Could not load ProfileEditor component
        </p>
      </div>
    );
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <VenaProfileEditor />
  </React.StrictMode>
);