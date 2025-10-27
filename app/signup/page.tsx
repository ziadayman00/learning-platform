'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/auth-client';

export default function SignUpPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.success) throw new Error();

      setStep('verify');
    } catch {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/send-otp?email=${email}&otp=${code}`);
      const data = await res.json();

      if (!data.success) {
        setError('Invalid code. Please try again.');
        setLoading(false);
        return;
      }

      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) throw new Error(result.error.message);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {step === 'form' && (
          <div>
            <h2 className="text-center text-4xl font-black">Create account</h2>
            <p className="mt-2 text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="font-medium text-black hover:text-gray-700">
                Sign in
              </Link>
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                {loading ? 'Sending code...' : 'Send verification code'}
              </Button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-6">
            <h2 className="text-center text-3xl font-black">Verify your email</h2>
            <p className="text-center text-gray-600">
              Enter the 6-digit code sent to <span className="font-medium">{email}</span>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/, '');
                      const newOtp = [...otp];
                      newOtp[i] = val;
                      setOtp(newOtp);
                      if (val && i < 5) {
                        const next = document.getElementById(`otp-${i + 1}`);
                        (next as HTMLInputElement)?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                ))}
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                {loading ? 'Verifying...' : 'Verify & Sign up'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
