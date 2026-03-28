import { LoginForm } from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - LuxeCart',
  description: 'Sign in to your LuxeCart account to access your orders, wishlist, and personalized shopping experience.',
  keywords: ['login', 'sign in', 'account', 'ecommerce', 'online shopping'],
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  );
}
