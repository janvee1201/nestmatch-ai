import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as matchingService from '../services/matching.service.js';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.profileCompleted) {
        setLoading(false);
        return;
      }
      try {
        const res = await matchingService.getRecommendations();
        if (res && res.data) {
          setRecommendations(res.data);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        setErrorMsg(err.message || 'Failed to retrieve recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 animate-pulse">
          <div>
            <div className="h-8 w-48 bg-dark-800 rounded-full mb-2"></div>
            <div className="h-4 w-72 bg-dark-800 rounded-full"></div>
          </div>
          <div className="h-10 w-36 bg-dark-800 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
          <div className="glass-panel p-6 rounded-2xl h-24"></div>
          <div className="glass-panel p-6 rounded-2xl h-24"></div>
          <div className="glass-panel p-6 rounded-2xl h-24"></div>
        </div>
        <div className="space-y-6">
          <div className="h-6 w-48 bg-dark-800 rounded-full animate-pulse mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-[420px]">
                <div className="h-48 w-full bg-dark-800"></div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="h-3 w-1/4 bg-dark-700 rounded-full mb-3"></div>
                    <div className="h-5 w-3/4 bg-dark-700 rounded-full mb-2"></div>
                    <div className="h-3 w-1/2 bg-dark-700 rounded-full mb-4"></div>
                    <div className="h-10 w-full bg-dark-700 rounded-xl"></div>
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
        </div>
      </div>
    );
  }

  // If user profile is not complete, show call to action
  if (!user?.profileCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center py-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/20 shadow-glass">
          <div className="h-16 w-16 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-2xl mx-auto mb-6 border border-amber-500/20 shadow-premium">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Profile Incomplete</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            We need a bit more details about your preferred location, budget, target move-in date, and lifestyle habits to find compatible listings for you.
          </p>
          <Link
            to="/profile/edit"
            className="inline-block px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-premium hover:shadow-premium-hover hover:translate-y-[-1px] transition-all text-sm"
          >
            Complete Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse co-living compatibility recommendations matching your profile preferences.
          </p>
        </div>
        <Link
          to="/properties"
          className="px-5 py-2.5 bg-dark-800 border border-dark-700 hover:bg-dark-700 text-white rounded-xl text-sm font-semibold transition-all text-center cursor-pointer"
        >
          Browse All Properties
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Matching Listings</p>
          <p className="text-3xl font-bold text-white mt-1">{recommendations.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preferred City</p>
          <p className="text-3xl font-bold text-white mt-1 capitalize">{user.preferredLocation || 'Not Set'}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget Limit</p>
          <p className="text-3xl font-bold text-white mt-1">
            {user.budgetMax ? `₹${user.budgetMax.toLocaleString()}/mo` : 'Open'}
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Top Co-living Recommendations</h2>
        
        {errorMsg ? (
          <div className="glass-panel p-6 text-center text-slate-400 rounded-2xl border border-dark-700/50">
            {errorMsg}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-dark-700/50 shadow-glass flex flex-col items-center justify-center max-w-lg mx-auto py-10">
            <div className="h-14 w-14 bg-brand-500/10 text-brand-300 flex items-center justify-center rounded-2xl mb-4 border border-brand-500/20">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-white mb-1">No Matching Listings Found</h4>
            <p className="text-slate-400 text-xs mb-4 text-center max-w-xs leading-normal">
              Try adjusting your profile requirements to see more matches or browse all flats manually.
            </p>
            <Link to="/properties" className="text-brand-400 font-semibold text-xs hover:underline mt-2 inline-block">
              Browse all flats manually
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => {
              const prop = rec.property;
              const hasImages = prop.images && prop.images.length > 0;
              const cardImg = hasImages ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
              return (
                <div key={prop._id} className="glass-panel glass-panel-hover flex flex-col rounded-2xl overflow-hidden group">
                  {/* Property Image Placeholder */}
                  <div className="h-48 w-full bg-dark-850 relative overflow-hidden">
                    <img 
                      src={cardImg} 
                      alt={prop.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {/* Compatibility Badge */}
                    <div className="absolute top-4 right-4 bg-brand-500 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-premium backdrop-blur-xs flex items-center">
                      <span className="mr-1">★</span> {rec.compatibilityScore}% Match
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-300 mb-2">
                        {prop.propertyType} • {prop.furnishing}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                        📍 {prop.locality}, {prop.city}
                      </p>

                      {/* Score description explanation */}
                      <div className="mt-4 p-3 rounded-lg bg-dark-950 border border-dark-800 text-[11px] text-slate-400 leading-normal">
                        <strong className="text-brand-300 font-semibold block mb-0.5">Matching Reason:</strong>
                        {rec.compatibilityReason}
                      </div>
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
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
