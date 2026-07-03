import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as propertyService from '../services/property.service.js';
import toast from 'react-hot-toast';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await propertyService.getMyProperties();
      if (res && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      toast.error('Failed to load your property listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    try {
      await propertyService.deleteProperty(id);
      toast.success('Property deleted successfully!');
      setProperties(properties.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete property.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 animate-pulse">
          <div>
            <div className="h-8 w-48 bg-dark-800 rounded-full mb-2"></div>
            <div className="h-4 w-72 bg-dark-800 rounded-full"></div>
          </div>
          <div className="h-10 w-36 bg-dark-800 rounded-xl"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-[380px]">
              <div className="h-44 w-full bg-dark-800"></div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="h-3 w-1/4 bg-dark-700 rounded-full mb-3"></div>
                  <div className="h-5 w-3/4 bg-dark-700 rounded-full mb-2"></div>
                  <div className="h-3 w-1/2 bg-dark-700 rounded-full"></div>
                </div>
                <div className="mt-6 pt-4 border-t border-dark-800 flex items-center justify-between">
                  <div>
                    <div className="h-2.5 w-8 bg-dark-700 rounded-full mb-1"></div>
                    <div className="h-5 w-16 bg-dark-700 rounded-full"></div>
                  </div>
                  <div className="h-8 w-28 bg-dark-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Properties</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track your active property listings.</p>
        </div>
        <Link
          to="/properties/create"
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-premium hover:shadow-premium-hover hover:translate-y-[-1px] transition-all text-center"
        >
          Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl max-w-lg mx-auto border border-dark-700/50 shadow-glass">
          <div className="h-16 w-16 bg-brand-500/10 text-brand-400 flex items-center justify-center rounded-2xl mx-auto mb-6 border border-brand-500/20 shadow-premium">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Properties Listed</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Start getting tenant requests by listing your flats, rooms, PGs, or houses.
          </p>
          <Link
            to="/properties/create"
            className="inline-block px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-premium transition-all text-sm"
          >
            Create First Listing
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => {
            const hasImages = prop.images && prop.images.length > 0;
            const cardImg = hasImages ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            return (
              <div key={prop._id} className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group">
                <div>
                  {/* Media Banner */}
                  <div className="h-44 w-full bg-dark-850 relative overflow-hidden">
                    <img 
                      src={cardImg} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        prop.isAvailable
                          ? 'bg-emerald-500/80 text-white shadow-premium'
                          : 'bg-slate-700/80 text-slate-300'
                      }`}>
                        {prop.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                      {prop.propertyType} • {prop.bedrooms} BHK
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-brand-300 transition-colors truncate">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      📍 {prop.locality}, {prop.city}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Available from: {new Date(prop.availableFrom).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 pb-6 pt-4 border-t border-dark-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rent</p>
                    <p className="text-base font-bold text-white">₹{prop.rent.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span></p>
                  </div>
                  <div className="flex space-x-3 text-xs">
                    <Link
                      to={`/properties/${prop._id}`}
                      className="px-3 py-1.5 bg-dark-850 hover:bg-dark-800 text-slate-300 border border-dark-700 rounded-lg transition-colors font-medium"
                    >
                      View
                    </Link>
                    <Link
                      to={`/properties/edit/${prop._id}`}
                      className="px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500 text-brand-300 hover:text-white border border-brand-500/20 rounded-lg transition-colors font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(prop._id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-colors font-semibold"
                    >
                      Delete
                    </button>
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

export default MyProperties;
