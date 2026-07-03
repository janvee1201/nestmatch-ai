import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      gender: '',
      age: '',
      occupation: '',
      bio: '',
      preferredLocation: '',
      budgetMin: '',
      budgetMax: '',
      moveInDate: '',
      lifestyle: {
        smoking: '',
        drinking: '',
        pets: '',
        sleepSchedule: '',
        cleanliness: '',
      }
    }
  });

  const watchBudgetMin = watch('budgetMin');
  const watchBudgetMax = watch('budgetMax');

  // Pre-populate form with user details
  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('phone', user.phone || '');
      setValue('gender', user.gender || '');
      setValue('age', user.age || '');
      setValue('occupation', user.occupation || '');
      setValue('bio', user.bio || '');
      setValue('preferredLocation', user.preferredLocation || '');
      setValue('budgetMin', user.budgetMin !== null ? user.budgetMin : '');
      setValue('budgetMax', user.budgetMax !== null ? user.budgetMax : '');
      
      if (user.moveInDate) {
        setValue('moveInDate', new Date(user.moveInDate).toISOString().split('T')[0]);
      } else {
        setValue('moveInDate', '');
      }

      if (user.lifestyle) {
        setValue('lifestyle.smoking', user.lifestyle.smoking || '');
        setValue('lifestyle.drinking', user.lifestyle.drinking || '');
        setValue('lifestyle.pets', user.lifestyle.pets || '');
        setValue('lifestyle.sleepSchedule', user.lifestyle.sleepSchedule || '');
        setValue('lifestyle.cleanliness', user.lifestyle.cleanliness || '');
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Parse numbers and clean empty strings
      const cleanedData = {
        fullName: data.fullName.trim(),
        phone: data.phone.trim() || null,
        gender: data.gender || null,
        age: data.age !== '' ? Number(data.age) : null,
        occupation: data.occupation.trim() || null,
        bio: data.bio.trim() || null,
        preferredLocation: data.preferredLocation.trim() || null,
        budgetMin: data.budgetMin !== '' ? Number(data.budgetMin) : null,
        budgetMax: data.budgetMax !== '' ? Number(data.budgetMax) : null,
        moveInDate: data.moveInDate || null,
        lifestyle: {
          smoking: data.lifestyle.smoking || null,
          drinking: data.lifestyle.drinking || null,
          pets: data.lifestyle.pets || null,
          sleepSchedule: data.lifestyle.sleepSchedule || null,
          cleanliness: data.lifestyle.cleanliness || null,
        }
      };

      // Client-side budget validation
      if (
        cleanedData.budgetMin !== null &&
        cleanedData.budgetMax !== null &&
        cleanedData.budgetMin > cleanedData.budgetMax
      ) {
        toast.error('Minimum budget cannot be greater than maximum budget.');
        setLoading(false);
        return;
      }

      await updateProfile(cleanedData);
      // Force refresh of user profile in context
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white">Edit Profile</h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep your preferences up to date to get matching co-living listing recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={loading} className="space-y-8 w-full border-none p-0 m-0">
          {/* Core Profile Section */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">Personal Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="fullName">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.fullName ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('phone')}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('gender')}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="age">
                Age
              </label>
              <input
                id="age"
                type="number"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.age ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('age', {
                  min: {
                    value: 18,
                    message: 'You must be at least 18 years old',
                  },
                })}
              />
              {errors.age && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.age.message}</p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="occupation">
                Occupation
              </label>
              <input
                id="occupation"
                type="text"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('occupation')}
              />
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="preferredLocation">
                Preferred Location
              </label>
              <input
                id="preferredLocation"
                type="text"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                placeholder="e.g. Bandra, Mumbai"
                {...register('preferredLocation')}
              />
            </div>

            {/* Min Budget */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="budgetMin">
                Minimum Budget (Monthly Rent)
              </label>
              <input
                id="budgetMin"
                type="number"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('budgetMin')}
              />
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="budgetMax">
                Maximum Budget (Monthly Rent)
              </label>
              <input
                id="budgetMax"
                type="number"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('budgetMax')}
              />
            </div>

            {/* Move-in Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="moveInDate">
                Target Move-in Date
              </label>
              <input
                id="moveInDate"
                type="date"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('moveInDate')}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="bio">
              Short Bio
            </label>
            <textarea
              id="bio"
              rows="3"
              className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              placeholder="Tell other co-living flatmates a bit about yourself..."
              {...register('bio')}
            ></textarea>
          </div>
        </div>

        {/* Co-living Lifestyle Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">Lifestyle & Habits</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Smoking */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="lifestyle.smoking">
                Smoking Preference
              </label>
              <select
                id="lifestyle.smoking"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('lifestyle.smoking')}
              >
                <option value="">Select Option</option>
                <option value="NEVER">Never</option>
                <option value="SOMETIMES">Sometimes</option>
                <option value="REGULAR">Regular</option>
              </select>
            </div>

            {/* Drinking */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="lifestyle.drinking">
                Drinking Preference
              </label>
              <select
                id="lifestyle.drinking"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('lifestyle.drinking')}
              >
                <option value="">Select Option</option>
                <option value="NEVER">Never</option>
                <option value="SOMETIMES">Sometimes</option>
                <option value="REGULAR">Regular</option>
              </select>
            </div>

            {/* Pets */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="lifestyle.pets">
                Pet Preference
              </label>
              <select
                id="lifestyle.pets"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('lifestyle.pets')}
              >
                <option value="">Select Option</option>
                <option value="NO">No Pets</option>
                <option value="DOG">Have Dog(s)</option>
                <option value="CAT">Have Cat(s)</option>
                <option value="YES">Open to Pets</option>
              </select>
            </div>

            {/* Sleep Schedule */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="lifestyle.sleepSchedule">
                Sleep Schedule
              </label>
              <select
                id="lifestyle.sleepSchedule"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('lifestyle.sleepSchedule')}
              >
                <option value="">Select Option</option>
                <option value="EARLY_BIRD">Early Bird</option>
                <option value="NIGHT_OWL">Night Owl</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
            </div>

            {/* Cleanliness */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="lifestyle.cleanliness">
                Cleanliness Level
              </label>
              <select
                id="lifestyle.cleanliness"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('lifestyle.cleanliness')}
              >
                <option value="">Select Option</option>
                <option value="VERY_CLEAN">Very Clean / Neat</option>
                <option value="MODERATE">Moderate / Average</option>
                <option value="FLEXIBLE">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-bold py-3.5 px-8 rounded-xl shadow-premium hover:shadow-premium-hover transition-all flex items-center text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Profile...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditProfile;
