import React from 'react';
import type { FormData, FormErrors } from '../types';
import { BUSINESS_NICHES } from '../constants';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SelectField from './SelectField';
import FileUploadField from './FileUploadField';

interface RegistrationFormProps {
  formData: FormData;
  errors: FormErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  errors,
  onInputChange,
  onFileChange,
  onSubmit,
}) => {
  // Custom validation for business niche
  const isBusinessNicheValid = formData.businessNiche !== '';

  // Ensure default value is '' for businessNiche
  if (formData.businessNiche === undefined) {
    formData.businessNiche = '';
  }
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">Ready to take your Business to the next step?</h1>
        <p className="mt-3 text-base text-zinc-600">
          Start growing your wellness practice today - simplify scheduling, payments, and client engagement with Vena.
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <InputField
          label="Business Name"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={onInputChange}
          error={errors.businessName}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            error={errors.firstName}
            required
          />
          <InputField
            label="Last Name"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            error={errors.lastName}
            required
          />
        </div>

        <InputField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          error={errors.email}
          required
        />

        <PasswordField
          label="Password"
          id="password"
          name="password"
          value={(formData as any).password || ''}
          onChange={onInputChange}
          error={errors.password}
          required
        />
        <PasswordField
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          value={(formData as any).confirmPassword || ''}
          onChange={onInputChange}
          error={errors.confirmPassword}
          required
        />

        <InputField
          label="Link to Social Media Page (Optional)"
          id="socialMedia"
          name="socialMedia"
          value={formData.socialMedia || ''}
          onChange={onInputChange}
          placeholder="https://instagram.com/yourbusiness"
          error={errors.socialMedia}
        />

        <div className="flex flex-col md:flex-row gap-6 items-start justify-between w-full">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">What's your business niche? <span className="text-red-500">*</span></label>
            <div className="border border-zinc-300 rounded-lg p-0">
              <SelectField
                label=""
                id="businessNiche"
                name="businessNiche"
                value={formData.businessNiche}
                onChange={onInputChange}
                options={BUSINESS_NICHES}
                error={errors.businessNiche}
                required
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">Tap to select your business niche.</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <FileUploadField
              label="Add your logo"
              id="logo"
              name="logo"
              fileName={formData.logo?.name}
              onChange={onFileChange}
              error={errors.logo}
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-300 disabled:opacity-50"
            disabled={!isBusinessNicheValid}
          >
            Create My Vena Account
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;