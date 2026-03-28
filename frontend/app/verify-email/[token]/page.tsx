"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type VerificationStatus = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [error, setError] = useState<string>('');
  const [isResending, setIsResending] = useState(false);

  const token = params.token as string;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Verification token is missing');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setStatus('loading');
      setError('');

      const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);

      if (response.data.status === 'success') {
        setStatus('success');
      } else {
        setStatus('error');
        setError(response.data.message || 'Email verification failed');
      }
    } catch (error: any) {
      setStatus('error');
      setError(
        error.response?.data?.message || 
        'Invalid or expired verification token. Please request a new verification email.'
      );
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // You might need to implement this endpoint in your backend
      await axios.post(`${API_URL}/api/auth/resend-verification`, {
        email: '' // You might want to store this in localStorage or get from user
      });
      
      // For now, just show a message
      alert('If your email is in our system, a new verification link has been sent.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        variants={cardVariants}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              variants={iconVariants}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verification
            </h1>
            <p className="text-gray-600 text-sm">
              {status === 'loading' && 'Verifying your email address...'}
              {status === 'success' && 'Verification complete!'}
              {status === 'error' && 'Verification failed'}
            </p>
          </div>

          {/* Loading State */}
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="mx-auto w-16 h-16 mb-4">
                <Loading size="lg" />
              </div>
              <p className="text-gray-600 animate-pulse">
                Please wait while we verify your email...
              </p>
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Email Successfully Verified!
              </h2>
              <p className="text-gray-600 mb-6">
                Your email address has been successfully verified. You can now log in to your account.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Login
              </Button>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </motion.div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-red-600 text-sm mb-6 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  {isResending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Back to Login
                </Button>
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
