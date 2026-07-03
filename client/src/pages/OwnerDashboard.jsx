import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as propertyService from '../services/property.service.js';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    try {
      const res = await propertyService.getMyProperties();
      if (res && res.data) {
        setProperties(res.data);
      }
    } catch (err) {
      console.error('Failed to load owned properties:', err);
      toast.error('Failed to fetch property listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) {
      return;
    }

    try {
      await propertyService.deleteProperty(id);
      toast.success('Property listing deleted successfully!');
      // Filter out deleted property
      setProperties(properties.filter((prop) => prop._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete listing.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 animate-pulse">
          <div>
            <div className="h-8 w-56 bg-dark-800 rounded-full mb-2"></div>
            <div className="h-4 w-96 bg-dark-800 rounded-full"></div>
          </div>
          <div className="h-10 w-36 bg-dark-800 rounded-xl"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl h-24 flex flex-col justify-between">
              <div className="h-3 w-1/3 bg-dark-700 rounded-full"></div>
              <div className="h-8 w-12 bg-dark-700 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="glass-panel rounded-3xl overflow-hidden animate-pulse">
          <div className="px-6 py-5 border-b border-dark-800/60 flex justify-between items-center bg-dark-900/40">
            <div className="h-5 w-40 bg-dark-850 rounded-full"></div>
            <div className="h-5 w-16 bg-dark-850 rounded-full"></div>
          </div>
          <div className="divide-y divide-dark-800/60">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 w-40 bg-dark-800 rounded-full"></div>
                  <div className="h-3 w-28 bg-dark-800 rounded-full"></div>
                </div>
                <div className="h-4 w-20 bg-dark-800 rounded-full"></div>
                <div className="h-4 w-12 bg-dark-800 rounded-full"></div>
                <div className="h-4 w-16 bg-dark-800 rounded-full"></div>
                <div className="h-6 w-24 bg-dark-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeListings = properties.filter((p) => p.isAvailable).length;
  const inactiveListings = properties.length - activeListings;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Owner Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your registered property listings and view co-living occupancy status.
          </p>
        </div>
        <Link
          to="/properties/create"
          className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-premium hover:shadow-premium-hover hover:translate-y-[-1px] transition-all text-center"
        >
          Add New Property
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-3xl font-bold text-white mt-1">{properties.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Listings</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{activeListings}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rented / Inactive</p>
          <p className="text-3xl font-bold text-slate-400 mt-1">{inactiveListings}</p>
        </div>
      </div>

      {/* Listings Table / Summary */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-dark-700/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Your Listed Properties</h2>
          <span className="text-xs text-slate-400 font-semibold bg-dark-950 px-3 py-1 rounded-full">
            {properties.length} Listings
          </span>
        </div>

        {properties.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="mb-4">You have not listed any properties yet.</p>
            <Link 
              to="/properties/create" 
              className="text-brand-400 font-semibold hover:underline text-sm"
            >
              List your first property now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-950/60 border-b border-dark-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Rent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {properties.map((prop) => (
                  <tr key={prop._id} className="hover:bg-dark-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white text-sm max-w-[240px] truncate">{prop.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">📍 {prop.locality}, {prop.city}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-300">
                      {prop.propertyType} • {prop.bedrooms} BHK
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      ₹{prop.rent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        prop.isAvailable 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}>
                        {prop.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <Link 
                        to={`/properties/${prop._id}`} 
                        className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/properties/edit/${prop._id}`} 
                        className="text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(prop._id)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
