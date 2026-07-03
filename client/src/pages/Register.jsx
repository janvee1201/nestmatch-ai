import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'TENANT', // Default role
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Create an Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              disabled={loading}
              className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all disabled:opacity-50 ${
                errors.fullName ? 'border-red-500/50' : 'border-dark-700/60'
              }`}
              placeholder="Janvee Sahu"
              {...register('fullName', {
                required: 'Full name is required',
              })}
            />
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="password">
              Password
            </label>
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
                  value: 8,
                  message: 'Password must be at least 8 characters long',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="role">
              I want to join as a
            </label>
            <select
              id="role"
              disabled={loading}
              className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all disabled:opacity-50"
              {...register('role', { required: true })}
            >
              <option value="TENANT">Tenant (Looking for a flat/flatmate)</option>
              <option value="OWNER">Owner (Looking to list properties)</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold py-3.5 px-4 rounded-xl shadow-premium hover:shadow-premium-hover hover:translate-y-[-1px] transition-all flex justify-center items-center text-sm mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
