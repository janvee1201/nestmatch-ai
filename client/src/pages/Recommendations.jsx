import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as matchingService from '../services/matching.service.js';
import toast from 'react-hot-toast';

const Recommendations = () => {
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
        setErrorMsg(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-dark-800 rounded-full mb-2"></div>
          <div className="h-4 w-[500px] bg-dark-800 rounded-full"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row border border-dark-700/50 animate-pulse h-52">
              <div className="w-full md:w-80 h-full bg-dark-800 flex-shrink-0"></div>
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="h-3 w-1/4 bg-dark-700 rounded-full mb-3"></div>
                  <div className="h-6 w-3/4 bg-dark-700 rounded-full mb-2"></div>
                  <div className="h-3 w-1/2 bg-dark-700 rounded-full mb-4"></div>
                  <div className="h-10 w-full bg-dark-700 rounded-xl"></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="h-6 w-24 bg-dark-700 rounded-full"></div>
                  <div className="h-10 w-36 bg-dark-700 rounded-xl"></div>
                </div>
              </div>
            </div>
          ))}
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
          <h2 className="text-2xl font-bold text-white mb-3">Complete Profile Required</h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            We require details like budget range, location, and lifestyle preferences in your profile to run co-living compatibility scoring.
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
      <div>
        <h1 className="text-3xl font-extrabold text-white">Co-living Compatibility Recommendations</h1>
        <p className="text-sm text-slate-400 mt-1">
          Our rule-based engine grades available property listings based on your location preferences, rent budget, move-in timelines, and lifestyle habits.
        </p>
      </div>

      {errorMsg ? (
        <div className="glass-panel p-8 text-center text-slate-400 rounded-3xl border border-dark-700/50">
          {errorMsg}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto border border-dark-700/50 shadow-glass">
          <div className="h-16 w-16 bg-brand-500/10 text-brand-400 flex items-center justify-center rounded-2xl mb-6 border border-brand-500/20 shadow-premium">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            No properties currently match your co-living preferences. You can adjust your budget limits, target city, or lifestyle habits to broaden matches.
          </p>
          <Link
            to="/profile/edit"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all shadow-premium"
          >
            Adjust Profile Preferences
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec, index) => {
            const prop = rec.property;
            const hasImages = prop.images && prop.images.length > 0;
            const cardImg = hasImages ? prop.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            return (
              <div key={prop._id} className="glass-panel rounded-3xl overflow-hidden flex flex-col md:flex-row border border-dark-700/50 hover:border-brand-500/30 transition-all group">
                
                {/* Number & Image Badge */}
                <div className="relative w-full md:w-80 h-52 bg-dark-850 flex-shrink-0 overflow-hidden">
                  <img 
                    src={cardImg} 
                    alt={prop.title} 
                    className="w-full h-full object-cover" 
                  />
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 bg-brand-600/90 text-white font-black text-sm h-8 w-8 rounded-lg flex items-center justify-center border border-brand-500/20 backdrop-blur-xs shadow-premium">
                    #{index + 1}
                  </div>
                </div>

                {/* Score & Reasons Details */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-300">
                        {prop.propertyType} • {prop.bedrooms} BHK • {prop.furnishing}
                      </span>
                      <h2 className="text-xl font-bold text-white mt-1 group-hover:text-brand-300 transition-colors">
                        {prop.title}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-1">
                        📍 {prop.locality}, {prop.city}
                      </p>
                    </div>

                    {/* Compatibility Score Radial/Badge */}
                    <div className="flex items-center space-x-3 bg-brand-500/5 border border-brand-500/20 rounded-2xl p-4 sm:ml-4">
                      <div className="text-center">
                        <span className="block text-2xl font-black text-brand-300">{rec.compatibilityScore}%</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Compatibility</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Reason Explanation */}
                  <div className="mt-4 p-4 rounded-xl bg-dark-950/80 border border-dark-800 text-sm text-slate-300 leading-normal">
                    <span className="block font-bold text-brand-400 text-xs uppercase tracking-wider mb-1.5">Compatibility Breakdown:</span>
                    {rec.compatibilityReason}
                  </div>

                  {/* Action row */}
                  <div className="mt-6 pt-4 border-t border-dark-800/80 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Monthly Rent</span>
                      <span className="text-lg font-bold text-white">₹{prop.rent.toLocaleString()}<span className="text-xs text-slate-500 font-normal"> / month</span></span>
                    </div>

                    <Link
                      to={`/properties/${prop._id}`}
                      className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-center text-sm font-bold shadow-premium transition-all"
                    >
                      View Property & Contact Owner
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

export default Recommendations;
