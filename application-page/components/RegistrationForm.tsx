import React, { useState, useMemo } from "react";
import type { FormData as RegistrationFormData } from "../types";

type Props = {
  formData: RegistrationFormData;
  errors: Partial<Record<keyof RegistrationFormData, string>> & { submit?: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (payload: RegistrationFormData) => void;
};

export default function RegistrationForm({
  formData,
  errors,
  onInputChange,
  onFileChange,
  onSubmit,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Simple strength scoring: length + character variety
  const passwordStrength = useMemo(() => {
    const pwd = formData.password || '';
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 5);
  }, [formData.password]);

  const strengthLabel = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Excellent"][passwordStrength];
  // ✅ Prevent native navigation; call App.tsx handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return; // block submit if required fields not satisfied
    onSubmit(formData);
  };

  // Enforce required fields + password policy before allowing submit
  const MIN_PWD = 8;
  const passwordsMatch = !!formData.password && formData.password === formData.confirmPassword;
  const passwordLongEnough = formData.password.trim().length >= MIN_PWD;
  const allRequiredFilled = (
    formData.businessName.trim() !== '' &&
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.confirmPassword.trim() !== '' &&
    formData.businessNiche.trim() !== ''
  );
  const canSubmit = allRequiredFilled && passwordsMatch && passwordLongEnough;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-3">
      {/* Business name */}
      <label className="grid gap-1">
        <span className="text-sm text-zinc-700">Business name *</span>
        <input
          className="border rounded px-3 py-2"
          name="businessName"
          value={formData.businessName}
          onChange={onInputChange}
          placeholder="Acme Wellness"
          required
        />
        {errors.businessName && <p className="text-red-600 text-sm">{errors.businessName}</p>}
      </label>

      {/* First / Last (required) */}
      <div className="grid md:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-zinc-700">First name *</span>
          <input
            className="border rounded px-3 py-2"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            placeholder="First name"
            required
          />
          {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-zinc-700">Last name *</span>
          <input
            className="border rounded px-3 py-2"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            placeholder="Last name"
            required
          />
          {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
        </label>
      </div>

      {/* Email */}
      <label className="grid gap-1">
        <span className="text-sm text-zinc-700">Email *</span>
        <input
          className="border rounded px-3 py-2"
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          placeholder="you@example.com"
          required
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </label>

      {/* Password (required) with show/hide & strength */}
      <div className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-zinc-700 flex items-center justify-between">
            <span>Password *</span>
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="text-xs text-indigo-600 hover:text-indigo-700 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </span>
          <input
            className="border rounded px-3 py-2"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onInputChange}
            placeholder="********"
            required
            aria-describedby="password-strength"
          />
          {/* Strength meter */}
          {formData.password && formData.password.length > 0 && (
            <div className="mt-2" id="password-strength">
              <div className="flex gap-1 mb-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => {
                  const filled = i < passwordStrength;
                  // color palette from weak->strong
                  const colors = [
                    'bg-red-500',        // very weak
                    'bg-orange-500',     // weak
                    'bg-yellow-500',     // fair
                    'bg-lime-500',       // good
                    'bg-green-500'       // strong/excellent
                  ];
                  const barColor = filled ? colors[Math.min(passwordStrength - 1, colors.length - 1)] : 'bg-zinc-300';
                  return (
                    <span
                      key={i}
                      className={`h-2 flex-1 rounded-md transition-colors duration-300 ${barColor}`}
                    />
                  );
                })}
              </div>
              <p className={`text-xs font-medium ${
                passwordStrength <= 1 ? 'text-red-600' :
                passwordStrength === 2 ? 'text-yellow-600' :
                passwordStrength === 3 ? 'text-lime-600' :
                'text-green-600'
              }`}>Strength: {strengthLabel}</p>
            </div>
          )}
          {formData.password && formData.password.length > 0 && formData.password.length < 8 && (
            <p className="text-xs text-amber-600 mt-1">Minimum 8 characters required.</p>
          )}
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-zinc-700 flex items-center justify-between">
            <span>Confirm password *</span>
            <button
              type="button"
              onClick={() => setShowConfirm(c => !c)}
              className="text-xs text-indigo-600 hover:text-indigo-700 focus:outline-none"
            >
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </span>
          <input
            className="border rounded px-3 py-2"
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            placeholder="********"
            required
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
        </label>
      </div>

      {/* Social + Niche */}
      <label className="grid gap-1">
        <span className="text-sm text-zinc-700">Social media (optional)</span>
        <input
          className="border rounded px-3 py-2"
          name="socialMedia"
          value={formData.socialMedia}
          onChange={onInputChange}
          placeholder="https://instagram.com/yourbusiness"
        />
        {errors.socialMedia && <p className="text-red-600 text-sm">{errors.socialMedia}</p>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-zinc-700">Business niche *</span>
        <input
          className="border rounded px-3 py-2"
          name="businessNiche"
          value={formData.businessNiche}
          onChange={onInputChange}
          placeholder="Physiotherapy, Yoga, Nutrition…"
          required
        />
        {errors.businessNiche && <p className="text-red-600 text-sm">{errors.businessNiche}</p>}
      </label>

      {/* Logo (optional) */}
      <label className="grid gap-1">
        <span className="text-sm text-zinc-700">Logo (optional)</span>
        <input className="border rounded px-3 py-2" type="file" accept="image/*" onChange={onFileChange} />
        {errors.logo && <p className="text-red-600 text-sm">{errors.logo}</p>}
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 rounded px-4 py-2 font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed focus: outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 transition-colors bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary"
        aria-disabled={!canSubmit}
      >
        {canSubmit ? 'Register' : 'Complete required fields'}
      </button>
    </form>
  );
}
