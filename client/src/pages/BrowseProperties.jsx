import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as propertyService from '../services/property.service.js';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const BrowseProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Read URL search params for initial form values
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      city: searchParams.get('city') || '',
      locality: searchParams.get('locality') || '',
      propertyType: searchParams.get('propertyType') || '',
      furnishing: searchParams.get('furnishing') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      minRent: searchParams.get('minRent') || '',
      maxRent: searchParams.get('maxRent') || '',
    }
  });

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    try {
      const res = await propertyService.searchProperties(filters);
      if (res && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  // Re-run search on mount or when URL search parameters change
  useEffect(() => {
    const filters = {
      city: searchParams.get('city') || undefined,
      locality: searchParams.get('locality') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      furnishing: searchParams.get('furnishing') || undefined,
      bedrooms: searchParams.get('bedrooms') || undefined,
      minRent: searchParams.get('minRent') || undefined,
      maxRent: searchParams.get('maxRent') || undefined,
    };
    fetchProperties(filters);
  }, [searchParams]);

  const onSubmit = (data) => {
    const params = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== '') {
        params[key] = data[key];
      }
    });
    setSearchParams(params);
  };

  const handleClear = () => {
    reset({
      city: '',
      locality: '',
      propertyType: '',
      furnishing: '',
      bedrooms: '',
      minRent: '',
      maxRent: '',
    });
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Browse Properties</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore all available listings and apply smart filters to find your next home.
        </p>
      </div>

      {/* Filters Form */}
      <div className="glass-panel p-6 rounded-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                placeholder="e.g. Mumbai"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('city')}
              />
            </div>

            {/* Locality */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="locality">
                Locality
              </label>
              <input
                id="locality"
                type="text"
                placeholder="e.g. Bandra West"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('locality')}
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="propertyType">
                Property Type
              </label>
              <select
                id="propertyType"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('propertyType')}
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Flat">Flat</option>
                <option value="PG">PG</option>
                <option value="House">House</option>
              </select>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="furnishing">
                Furnishing
              </label>
              <select
                id="furnishing"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('furnishing')}
              >
                <option value="">All Furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="bedrooms">
                Bedrooms (BHK)
              </label>
              <input
                id="bedrooms"
                type="number"
                placeholder="e.g. 2"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('bedrooms')}
              />
            </div>

            {/* Min Rent */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="minRent">
                Min Rent (₹)
              </label>
              <input
                id="minRent"
                type="number"
                placeholder="Min"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('minRent')}
              />
            </div>

            {/* Max Rent */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5" htmlFor="maxRent">
                Max Rent (₹)
              </label>
              <input
                id="maxRent"
                type="number"
                placeholder="Max"
                className="w-full bg-dark-950 border border-dark-700/60 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                {...register('maxRent')}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-dark-800 border border-dark-700 text-slate-300 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-[420px]">
              <div className="h-48 w-full bg-dark-800"></div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="h-3 w-1/4 bg-dark-700 rounded-full mb-3"></div>
                  <div className="h-5 w-3/4 bg-dark-700 rounded-full mb-2"></div>
                  <div className="h-3 w-1/2 bg-dark-700 rounded-full mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-dark-700 rounded-full"></div>
                    <div className="h-3 w-5/6 bg-dark-700 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-dark-800 flex items-center justify-between">
                  <div>
                    <div className="h-2.5 w-8 bg-dark-700 rounded-full mb-1"></div>
                    <div className="h-5 w-16 bg-dark-700 rounded-full"></div>
                  </div>
                  <div className="h-8 w-20 bg-dark-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto border border-dark-700/50 shadow-glass">
          <div className="h-16 w-16 bg-brand-500/10 text-brand-400 flex items-center justify-center rounded-2xl mb-6 border border-brand-500/20 shadow-premium">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            No properties match your current search criteria. Try modifying your filters or clearing them to explore all listings.
          </p>
          <button
            onClick={handleClear}
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all shadow-premium cursor-pointer"
          >
            Clear Search Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const hasImages = prop.images && prop.images.length > 0;
            const cardImg = hasImages ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            return (
              <div key={prop._id} className="glass-panel glass-panel-hover flex flex-col rounded-2xl overflow-hidden group">
                <div className="h-48 w-full bg-dark-850 relative overflow-hidden">
                  <img 
                    src={cardImg} 
                    alt={prop.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 right-4 bg-dark-950/80 text-brand-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-brand-500/20 backdrop-blur-xs">
                    {prop.propertyType}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {prop.furnishing} • {prop.bedrooms} BHK
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-brand-300 transition-colors truncate">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                      📍 {prop.locality}, {prop.city}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-dark-800/80 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rent</p>
                      <p className="text-base font-bold text-white">₹{prop.rent.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span></p>
                    </div>
                    <Link
                      to={`/properties/${prop._id}`}
                      className="px-4 py-2 bg-brand-500/10 hover:bg-brand-500 text-brand-300 hover:text-white border border-brand-500/20 hover:border-brand-500 rounded-xl text-xs font-semibold shadow-premium transition-all"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseProperties;
