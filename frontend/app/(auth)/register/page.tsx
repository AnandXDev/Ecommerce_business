import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';
import axios from 'axios';

export const metadata: Metadata = {
  title: 'Create Account - LuxeCart',
  description: 'Create your LuxeCart account to start shopping, track orders, and get personalized recommendations.',
  keywords: ['register', 'sign up', 'create account', 'ecommerce', 'online shopping'],
};

const sendOtp = async (email: string) => {
  try {
    const res = await axios.post('/api/auth/send-otp', { email });
    alert(res.data.message);
  } catch (err) {
    console.log(err);
  }
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
}
