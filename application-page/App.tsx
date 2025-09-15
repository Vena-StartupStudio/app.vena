// application-page/App.tsx
import React, { useState, useCallback } from "react";
import RegistrationForm from "./components/RegistrationForm";      
import ConfirmationMessage from "./components/ConfirmationMessage"; 

type FormData = {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  socialMedia: string;
  password: string;
  confirmPassword: string;
  businessNiche: string;
  logo: File | null;
};

const initialFormData: FormData = {
  businessName: "",
  firstName: "",        // If not used in your UI, can be left blank or removed
  lastName: "",         // Same as above
  email: "",
  password: "",
  confirmPassword: "",
  socialMedia: "",
  businessNiche: "",    // empty means "Choose your business niche"
  logo: null,
};

type FormErrors = Partial<Record<keyof FormData, string>> & { submit?: string };

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.businessNiche) {
      newErrors.businessNiche = "Please choose your business niche";
    }

    if (formData.socialMedia) {
      try {
        // Basic URL validation
        // eslint-disable-next-line no-new
        new URL(formData.socialMedia);
      } catch {
        newErrors.socialMedia = "Enter a valid URL (e.g., https://instagram.com/yourbusiness)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear field error on change
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setFormData((prev) => ({ ...prev, logo: file }));
      // Clear logo error on change (if you ever set one)
      if (errors.logo) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.logo;
          return copy;
        });
      }
    },
    [errors]
  );

  const handleSubmit = async (payload: FormData) => {
    setSubmitting(true);
    setErrors({});

    try {
      // Note: If you later want to actually upload the logo file,
      // use FormData() and multipart/form-data, not JSON.
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⚠️ Consider excluding `logo` from JSON if it might be a File.
        body: JSON.stringify({ ...payload, logo: null }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Registration failed:", data);
        setErrors((prev) => ({
          ...prev,
          submit: `Registration failed: ${data.message || "Unknown error"}`,
        }));
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Network error:", err);
      setErrors((prev) => ({ ...prev, submit: "Unexpected error. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 transition-all duration-500">
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
