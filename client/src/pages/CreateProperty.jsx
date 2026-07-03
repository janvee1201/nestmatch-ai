import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as propertyService from '../services/property.service.js';
import toast from 'react-hot-toast';

const CreateProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, we are in EDIT mode
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      propertyType: 'Apartment',
      address: '',
      city: '',
      locality: '',
      rent: '',
      securityDeposit: '',
      availableFrom: '',
      furnishing: 'Semi-Furnished',
      bedrooms: '',
      bathrooms: '',
      amenitiesInput: '',
      imagesInput: '',
      isAvailable: true,
    }
  });

  // Load property details if in edit mode
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!isEditMode) return;
      try {
        const res = await propertyService.getPropertyById(id);
        if (res && res.data) {
          const prop = res.data;
          setValue('title', prop.title || '');
          setValue('description', prop.description || '');
          setValue('propertyType', prop.propertyType || 'Apartment');
          setValue('address', prop.address || '');
          setValue('city', prop.city || '');
          setValue('locality', prop.locality || '');
          setValue('rent', prop.rent || '');
          setValue('securityDeposit', prop.securityDeposit || '');
          setValue('furnishing', prop.furnishing || 'Semi-Furnished');
          setValue('bedrooms', prop.bedrooms || '');
          setValue('bathrooms', prop.bathrooms || '');
          setValue('isAvailable', prop.isAvailable !== undefined ? prop.isAvailable : true);

          if (prop.availableFrom) {
            setValue('availableFrom', new Date(prop.availableFrom).toISOString().split('T')[0]);
          }

          if (prop.amenities) {
            setValue('amenitiesInput', prop.amenities.join(', '));
          }

          if (prop.images) {
            setValue('imagesInput', prop.images.join(', '));
          }
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        toast.error('Failed to load property details.');
        navigate('/owner-dashboard');
      } finally {
        setFetching(false);
      }
    };

    fetchPropertyDetails();
  }, [id, isEditMode, setValue, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format amenities and images from comma-separated strings
      const amenities = data.amenitiesInput
        ? data.amenitiesInput.split(',').map((val) => val.trim()).filter(Boolean)
        : [];
      
      const images = data.imagesInput
        ? data.imagesInput.split(',').map((val) => val.trim()).filter(Boolean)
        : [];

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        propertyType: data.propertyType,
        address: data.address.trim(),
        city: data.city.trim(),
        locality: data.locality.trim(),
        rent: Number(data.rent),
        securityDeposit: Number(data.securityDeposit),
        availableFrom: data.availableFrom,
        furnishing: data.furnishing,
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        amenities,
        images,
        isAvailable: data.isAvailable,
      };

      if (isEditMode) {
        await propertyService.updateProperty(id, payload);
        toast.success('Property listing updated successfully!');
      } else {
        await propertyService.createProperty(payload);
        toast.success('Property listing created successfully!');
      }
      navigate('/owner-dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to submit property listing.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {isEditMode ? 'Edit Property Listing' : 'List a New Property'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Fill in the details to list your flat, house, PG, or apartment.
          </p>
        </div>
        <Link 
          to="/owner-dashboard" 
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 border border-dark-700 hover:border-dark-600 rounded-lg transition-colors"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <fieldset disabled={loading} className="space-y-8 w-full border-none p-0 m-0">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">Property Description</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="title">
              Listing Title *
            </label>
            <input
              id="title"
              type="text"
              className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                errors.title ? 'border-red-500/50' : 'border-dark-700/60'
              }`}
              placeholder="e.g. Cozy 2BHK flat in Bandra with sea view"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters long',
                },
              })}
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="description">
              Property Description *
            </label>
            <textarea
              id="description"
              rows="4"
              className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                errors.description ? 'border-red-500/50' : 'border-dark-700/60'
              }`}
              placeholder="Provide a detailed description of the property, co-living rules, surroundings, etc..."
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long',
                },
              })}
            ></textarea>
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">Specifications & Cost</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="propertyType">
                Property Type *
              </label>
              <select
                id="propertyType"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('propertyType', { required: true })}
              >
                <option value="Apartment">Apartment</option>
                <option value="Flat">Flat</option>
                <option value="PG">PG</option>
                <option value="House">House</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="furnishing">
                Furnishing *
              </label>
              <select
                id="furnishing"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('furnishing', { required: true })}
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Rent */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="rent">
                Monthly Rent (₹) *
              </label>
              <input
                id="rent"
                type="number"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.rent ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('rent', {
                  required: 'Rent is required',
                  min: {
                    value: 1,
                    message: 'Rent must be a positive number',
                  },
                })}
              />
              {errors.rent && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.rent.message}</p>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="securityDeposit">
                Security Deposit (₹) *
              </label>
              <input
                id="securityDeposit"
                type="number"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.securityDeposit ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('securityDeposit', {
                  required: 'Security deposit is required',
                  min: {
                    value: 1,
                    message: 'Security deposit must be a positive number',
                  },
                })}
              />
              {errors.securityDeposit && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.securityDeposit.message}</p>
              )}
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="bedrooms">
                Bedrooms Count *
              </label>
              <input
                id="bedrooms"
                type="number"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.bedrooms ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('bedrooms', {
                  required: 'Bedrooms count is required',
                  min: {
                    value: 0,
                    message: 'Bedrooms cannot be negative',
                  },
                })}
              />
              {errors.bedrooms && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.bedrooms.message}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="bathrooms">
                Bathrooms Count *
              </label>
              <input
                id="bathrooms"
                type="number"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.bathrooms ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('bathrooms', {
                  required: 'Bathrooms count is required',
                  min: {
                    value: 0,
                    message: 'Bathrooms cannot be negative',
                  },
                })}
              />
              {errors.bathrooms && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.bathrooms.message}</p>
              )}
            </div>

            {/* Available From */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="availableFrom">
                Available From *
              </label>
              <input
                id="availableFrom"
                type="date"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.availableFrom ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                {...register('availableFrom', { required: 'Available from date is required' })}
              />
              {errors.availableFrom && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.availableFrom.message}</p>
              )}
            </div>

            {/* Availability Status (only in edit mode) */}
            {isEditMode && (
              <div className="flex items-center pt-8">
                <input
                  id="isAvailable"
                  type="checkbox"
                  className="h-5 w-5 bg-dark-950 border border-dark-700 rounded text-brand-500 focus:ring-brand-500 focus:ring-offset-dark-950"
                  {...register('isAvailable')}
                />
                <label className="ml-2.5 text-sm font-semibold text-slate-300" htmlFor="isAvailable">
                  This listing is currently Available
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Address and Images */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">Location & Media</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Locality */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="locality">
                Locality *
              </label>
              <input
                id="locality"
                type="text"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.locality ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                placeholder="e.g. Bandra West"
                {...register('locality', { required: 'Locality is required' })}
              />
              {errors.locality && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.locality.message}</p>
              )}
            </div>

            {/* City */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="city">
                City *
              </label>
              <input
                id="city"
                type="text"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.city ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                placeholder="e.g. Mumbai"
                {...register('city', { required: 'City is required' })}
              />
              {errors.city && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.city.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="address">
                Full Address *
              </label>
              <input
                id="address"
                type="text"
                className={`w-full bg-dark-950 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all ${
                  errors.address ? 'border-red-500/50' : 'border-dark-700/60'
                }`}
                placeholder="e.g. Flat 402, Sea Breeze Apts"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="amenitiesInput">
              Amenities (comma separated)
            </label>
            <input
              id="amenitiesInput"
              type="text"
              className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              placeholder="e.g. WiFi, AC, Gym, Swimming Pool, Parking"
              {...register('amenitiesInput')}
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5" htmlFor="imagesInput">
              Image URLs (comma separated)
            </label>
            <input
              id="imagesInput"
              type="text"
              className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              placeholder="e.g. https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
              {...register('imagesInput')}
            />
          </div>
        </div>

        {/* Submit */}
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
                Submitting listing...
              </>
            ) : (
              isEditMode ? 'Update Listing' : 'List Property'
            )}
          </button>
        </div>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateProperty;
