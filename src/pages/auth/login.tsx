import { useState } from 'react';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Login() {
  const { navigate } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    setError('Please enter your email and password.');
    return;
  }

  try {
    setError('');

    await signInWithEmailAndPassword(auth, email, password);
    // AppContext routes after the authenticated profile has loaded.
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';

    switch (code) {
      case 'auth/invalid-credential':
        setError('Invalid email or password.');
        break;

      case 'auth/user-not-found':
        setError('No account found with this email.');
        break;

      case 'auth/wrong-password':
        setError('Incorrect password.');
        break;

      case 'auth/invalid-email':
        setError('Please enter a valid email address.');
        break;

      case 'auth/too-many-requests':
        setError('Too many failed attempts. Please try again later.');
        break;

      default:
        setError('Unable to log in. Please try again.');
    }
  }
};

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('login')}
            className="flex items-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-leaf-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>

            <span className="text-2xl font-bold text-gray-900">
              Eco<span className="text-leaf-600">Spark</span>
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back 🌱
            </h1>

            <p className="text-gray-500">
              Continue your EcoSpark journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setError('Password reset will be available soon.');
                  }}
                  className="text-sm font-medium text-leaf-600 hover:text-leaf-700"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-leaf-600 text-white font-semibold hover:bg-leaf-700 transition-all shadow-md hover:shadow-lg"
            >
              Log In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}

            <button
              onClick={() => navigate('signup')}
              className="font-semibold text-leaf-600 hover:text-leaf-700"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate('signup')}
          className="block mx-auto mt-6 text-sm text-gray-400 hover:text-leaf-600 transition"
        >
          ← Back to signup
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Learn · Act · Grow 🌍
        </p>

      </div>
    </div>
  );
}