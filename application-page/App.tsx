// application-page/App.tsx
import React, { useState, useCallback, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import RegistrationForm from "./components/RegistrationForm";
import ConfirmationMessage from "./components/ConfirmationMessage";
import { IntegrationSettings } from "./components/IntegrationSettings";
import type { FormData as RegistrationFormData } from "./types";
import VenaLogo from './components/icons/VenaLogo.png';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing';
import Dashboard from './dashboard';
import TasksPage from './components/TasksPage';

const initialFormData: RegistrationFormData = {
  businessName: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  socialMedia: "",
  businessNiche: "",
  logo: null,
};

type FormErrors = Partial<Record<keyof RegistrationFormData, string>> & { submit?: string };

// Move your registration logic into a separate component
const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ email: string; logoUrl?: string | null } | null>(null);

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = 'https://vena.software/signin.html';
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[name as keyof FormErrors];
          return copy;
        });
      }
    },
    [errors]
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({ ...prev, logo: file }));
    if (errors.logo) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.logo;
        return copy;
      });
    }
  }, [errors]);

  const handleSubmit = async (payload: RegistrationFormData) => {
    setSubmitting(true);
    setErrors({});

    try {
      if (!payload.password || payload.password.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
        return;
      }
      if (payload.password !== payload.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Registration successful, but no user data returned. Please contact support.");
      }

      const user = authData.user;

      let logoPath: string | null = null;
      if (payload.logo) {
        const ext = payload.logo.name.split(".").pop() || "bin";
        const fileName = `registrations/${user.id}.${ext}`;
        const { data: up, error: upErr } = await supabase
          .storage
          .from("logos")
          .upload(fileName, payload.logo, { 
            contentType: payload.logo.type,
            upsert: true,
          });
        if (upErr) throw upErr;
        logoPath = up.path;
      }

      const { error: dbErr } = await supabase.from("registrations").insert({
        id: user.id,
        business_name: payload.businessName,
        first_name: payload.firstName || "",
        last_name: payload.lastName || "",
        email: payload.email,
        social_media: payload.socialMedia || null,
        business_niche: payload.businessNiche,
        logo_filename: logoPath,
      });

      if (dbErr) {
        console.error("Error saving profile, but user was created:", dbErr);
        if (/duplicate key value|unique/i.test(dbErr.message)) {
          throw new Error("This email is already registered.");
        }
        throw dbErr;
      }

      let publicLogoUrl: string | null = null;
      if (logoPath) {
        const { data } = supabase.storage.from("logos").getPublicUrl(logoPath);
        publicLogoUrl = data.publicUrl;
      }

      setConfirmation({ email: payload.email, logoUrl: publicLogoUrl });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setErrors((prev) => ({ ...prev, submit: err.message || "Unexpected error. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={VenaLogo}
              alt="Vena logo"
              className="h-16 w-auto mb-4 select-none"
              draggable="false"
            />
            {!isSubmitted && (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-800 tracking-tight leading-tight">
                  Ready to take your Business to the next step?
                </h1>
                <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-md">
                  Start growing your wellness practice today – simplify scheduling, payments, and client engagement with Vena.
                </p>
              </>
            )}
          </div>
          {isSubmitted ? (
            <>
              <ConfirmationMessage email={confirmation?.email ?? ""} logoUrl={confirmation?.logoUrl ?? undefined} />
              <div className="mt-8 border-t pt-8">
                <IntegrationSettings />
              </div>
            </>
          ) : (
            <RegistrationForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
            />
          )}
          {!isSubmitted && errors.submit && (
            <p className="mt-4 text-sm text-red-600">{errors.submit}</p>
          )}
          {!isSubmitted && submitting && (
            <p className="mt-4 text-sm text-zinc-500">Submitting...</p>
          )}
        </div>
      </main>
    </div>
  );
};

// Main App with proper routing
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  );
};

export default App;
