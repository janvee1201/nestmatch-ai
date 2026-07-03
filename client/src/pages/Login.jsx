import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Calculate redirect destination
  const from = location.state?.from?.pathname || null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const loggedUser = await login(data.email, data.password);
      toast.success('Successfully logged in!');
      
      // Determine redirection path based on role
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'OWNER') {
        navigate('/owner-dashboard', { replace: true });
      } else {
        navigate('/tenant-dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative Blob */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Sign in to NestMatch</h2>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              create a new account
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email field */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              disabled={loading}
              className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all disabled:opacity-50 ${
                errors.email ? 'border-red-500/50' : 'border-dark-700/60'
              }`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-300" htmlFor="password">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              disabled={loading}
              className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all disabled:opacity-50 ${
                errors.password ? 'border-red-500/50' : 'border-dark-700/60'
              }`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold py-3.5 px-4 rounded-xl shadow-premium hover:shadow-premium-hover hover:translate-y-[-1px] transition-all flex justify-center items-center text-sm cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
