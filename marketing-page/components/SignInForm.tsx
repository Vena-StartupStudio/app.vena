import React, { useState } from 'react';

interface Props {
  onSuccess?: (email: string) => void;
}

const SignInForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setInfo('Sign in successful!');
      onSuccess?.(email);
    }, 1000);
  };

  const handleResetPassword = () => {
    if (!email) {
      setError('Enter your email first.');
      return;
    }
    setError(null);
    setInfo('Password reset email sent.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="current-password"
            onKeyDown={e => setCapsLock(e.getModifierState && e.getModifierState('CapsLock'))}
            onKeyUp={e => setCapsLock(e.getModifierState && e.getModifierState('CapsLock'))}
            onBlur={() => setCapsLock(false)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.58 10.58a2 2 0 002.84 2.84" />
                <path d="M9.88 5.51A9.64 9.64 0 0112 5c7 0 10 7 10 7a13.2 13.2 0 01-1.67 2.68m-2.71 2.3A9.86 9.86 0 0112 19c-7 0-10-7-10-7a18.7 18.7 0 013.95-4.94" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {capsLock && !showPassword && password.length > 0 && (
          <p className="mt-1 text-xs text-amber-600">Caps Lock is on.</p>
        )}
        <div className="mt-2 text-right">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {info && !error && <p className="text-sm text-green-600">{info}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded py-2 font-medium hover:from-purple-500 hover:to-indigo-500 transition disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm;
