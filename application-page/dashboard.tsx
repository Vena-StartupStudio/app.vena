import React from 'react';
import ReactDOM from 'react-dom/client';
import VenaProfileEditor from './components/VenaProfileEditor'; 

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <VenaProfileEditor />
  </React.StrictMode>
);