'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { MainLayout } from '@/components/layouts';
import { useApiRequest } from '@/hooks';
import { signinUrl } from '@/consts/paths';
import Toaster from '@/helpers/Toaster';
import { useRouter } from 'next/navigation';

const SigninPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    response: signinResponse,
    error: signinError,
    loading: signinLoading,
    sendRequest: sendSigninRequest,
  } = useApiRequest({
    endpoint: signinUrl,
    headers: {
      Accept: 'application/json',
    },
    method: 'POST',
    data: { email, password, rememberMe },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      Toaster.warning('Email field cannot be empty');
      return;
    }

    if (!password) {
      Toaster.warning('Password field cannot be empty');
      return;
    }

    sendSigninRequest();
  };

  useEffect(() => {
    if (signinError) Toaster.error(signinError.message || 'Something went wrong!');
  }, [signinError]);

  useEffect(() => {
    if (signinResponse) {
      Toaster.success(signinResponse?.data?.message);
      router.push('/dashboard');
    }
  }, [signinResponse]);

  return (
    <MainLayout>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-4 shadow rounded-2xl sm:px-10 border-[#D8D7D4] border-[1px]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <h1 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">Sign in to your account</h1>
              </div>
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#03053D] cursor-pointer hover:text-[#20254C]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="
                      appearance-none
                      h-4 w-4
                      border-2 border-gray-300
                      rounded
                      cursor-pointer
                      peer
                      checked:border-black
                      checked:bg-black"
                    />
                    <span
                      className="
                      absolute
                      left-1/2 top-1/2
                      -translate-x-1/2 -translate-y-1/2
                      text-white
                      opacity-0
                      peer-checked:opacity-100"
                    >
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </label>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me on this device
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-[#DE0707] hover:text-[#DE4040]">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={signinLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signinLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="mt-12">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to RiskPay?</span>
                  <Link
                    href="/signup"
                    className="flex justify-center items-center text-sm font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-sm text-gray-500">© RiskPay | Privacy & terms</footer>
      </div>
    </MainLayout>
  );
};

export default SigninPage;
