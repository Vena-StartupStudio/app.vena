// application-page/App.tsx
import React, { useState, useCallback, useEffect } from "react"; // Add useEffect
import { supabase } from "./lib/supabaseClient";
import RegistrationForm from "./components/RegistrationForm";
import ConfirmationMessage from "./components/ConfirmationMessage";
import { IntegrationSettings } from "./components/IntegrationSettings";
import type { FormData as RegistrationFormData } from "./types";
import VenaLogo from './components/icons/VenaLogo.png';

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

const App: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ new: keep what to show on the success screen
  const [confirmation, setConfirmation] = useState<{ email: string; logoUrl?: string | null } | null>(null);

  // This effect will run when `isSubmitted` becomes true
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        // Redirect to the sign-in page after 3 seconds
        window.location.href = 'https://vena.software/signin.html';
      }, 3000); // 3000 milliseconds = 3 seconds

      // Cleanup the timer if the component unmounts
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
      // password validations (client-side safeguard; server should also enforce)
      if (!payload.password || payload.password.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters.' }));
        return;
      }
      if (payload.password !== payload.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
        return;
      }

      // 1. Sign up the user with Supabase Auth
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

      // 2. Upload logo if it exists
      let logoPath: string | null = null;
      if (payload.logo) {
        const ext = payload.logo.name.split(".").pop() || "bin";
        const fileName = `registrations/${user.id}.${ext}`; // Use user ID for filename
        const { data: up, error: upErr } = await supabase
          .storage
          .from("logos")
          .upload(fileName, payload.logo, { 
            contentType: payload.logo.type,
            upsert: true, // Overwrite if a file with the same name exists
          });
        if (upErr) throw upErr;
        logoPath = up.path;
      }

      // 3. Insert public profile data into the 'registrations' table
      const { error: dbErr } = await supabase.from("registrations").insert({
        id: user.id, // Link to the auth.users table
        business_name: payload.businessName,
        first_name: payload.firstName || "",
        last_name: payload.lastName || "",
        email: payload.email,
        social_media: payload.socialMedia || null,
        business_niche: payload.businessNiche,
        logo_filename: logoPath,
      });

      if (dbErr) {
        // If there's a DB error, it's good practice to clean up the created user
        // This is an advanced topic, but for now, we'll just log the error
        console.error("Error saving profile, but user was created:", dbErr);
        if (/duplicate key value|unique/i.test(dbErr.message)) {
          throw new Error("This email is already registered.");
        }
        throw dbErr;
      }

      // 4. Get public URL for the logo to show on confirmation
      let publicLogoUrl: string | null = null;
      if (logoPath) {
        const { data } = supabase.storage.from("logos").getPublicUrl(logoPath);
        publicLogoUrl = data.publicUrl;
      }

      setConfirmation({ email: payload.email, logoUrl: publicLogoUrl });
      setIsSubmitted(true); // This line will now trigger the useEffect above
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
            // ✅ pass confirmation props
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

export default App;
