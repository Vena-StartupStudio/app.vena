import React from 'react';
import { createRoot } from 'react-dom/client';
import SignInForm from './components/SignInForm';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 border border-slate-200">
        <h1 className="text-2xl font-semibold mb-6 text-slate-800 text-center">Sign In</h1>
        <SignInForm />
      </div>
    </React.StrictMode>
  );
}
