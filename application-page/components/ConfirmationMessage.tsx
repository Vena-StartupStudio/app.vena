import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';

const ConfirmationMessage: React.FC = () => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
        <CheckCircleIcon className="h-12 w-12 text-primary" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-zinc-800">Welcome to Vena!</h2>
      <p className="mt-4 text-base text-zinc-600 max-w-md mx-auto">
        We’ve received your details. Our team will review and activate your account shortly.
      </p>
    </div>
  );
};

export default ConfirmationMessage;