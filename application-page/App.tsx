import React, { useState, useCallback } from 'react';
import RegistrationForm from './components/RegistrationForm';
import ConfirmationMessage from './components/ConfirmationMessage';
import type { FormData, FormErrors } from './types';
import { BusinessNiche } from './types';
import VenaLogo from './components/icons/VenaLogo.png';

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    socialMedia: '',
    businessNiche: BusinessNiche.Physiotherapist,
    logo: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.logo) newErrors.logo = 'Business logo or picture is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.logo;
        return newErrors;
      })
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // Here you would typically send data to a server.
      // For this example, we'll just simulate a successful submission.
      console.log('Form data submitted:', formData);
      setIsSubmitted(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 transition-all duration-500">
          <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
            <img src={VenaLogo} alt="Vena Logo" style={{ height: '48px', marginBottom: '0.5rem' }} />
            <h1 style={{ margin: 0, textAlign: 'center' }}></h1>
          </header>
          {isSubmitted ? (
            <ConfirmationMessage />
          ) : (
            <RegistrationForm 
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>
         <p className="text-center text-xs text-zinc-400 mt-6">
            &copy; 2025 Vena. All rights reserved. vena.software
        </p>
      </main>
    </div>
  );
};

export default App;