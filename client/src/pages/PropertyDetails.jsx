import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as propertyService from '../services/property.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [compatInfo, setCompatInfo] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await propertyService.getPropertyById(id);
        if (res && res.data) {
          setProperty(res.data);
          
          // Calculate compatibility score on the fly in the frontend if user is a Tenant
          if (isAuthenticated && user && user.role === 'TENANT' && user.profileCompleted) {
            calculateCompatibility(res.data, user);
          }
        }
      } catch (err) {
        toast.error('Failed to load property details.');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, isAuthenticated, user, navigate]);

  const calculateCompatibility = (prop, tenant) => {
    let score = 0;
    const reasons = [];

    // Location
    const tenantLoc = (tenant.preferredLocation || '').trim().toLowerCase();
    const propCity = (prop.city || '').trim().toLowerCase();
    const propLocality = (prop.locality || '').trim().toLowerCase();
    if (tenantLoc && (propCity === tenantLoc || propLocality === tenantLoc)) {
      score += 30;
      reasons.push('Location matches');
    }

    // Budget
    const minBudget = tenant.budgetMin !== null && tenant.budgetMin !== undefined ? tenant.budgetMin : 0;
    const maxBudget = tenant.budgetMax !== null && tenant.budgetMax !== undefined ? tenant.budgetMax : Infinity;
    if (prop.rent >= minBudget && prop.rent <= maxBudget) {
      score += 25;
      reasons.push('Rent is within budget');
    }

    // Move-in Date
    if (tenant.moveInDate && prop.availableFrom) {
      const diffTime = Math.abs(new Date(prop.availableFrom) - new Date(tenant.moveInDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        score += 15;
        reasons.push('Available within 30 days of move-in');
      }
    }

    // Lifestyle
    if (tenant.lifestyle && prop.owner && prop.owner.lifestyle) {
      const tenantLife = tenant.lifestyle;
      const ownerLife = prop.owner.lifestyle;
      const lifestyleMatches = [];

      if (tenantLife.smoking && ownerLife.smoking && tenantLife.smoking === ownerLife.smoking) {
        score += 5;
        lifestyleMatches.push('smoking');
      }
      if (tenantLife.drinking && ownerLife.drinking && tenantLife.drinking === ownerLife.drinking) {
        score += 5;
        lifestyleMatches.push('drinking');
      }
      if (tenantLife.pets && ownerLife.pets && tenantLife.pets === ownerLife.pets) {
        score += 5;
        lifestyleMatches.push('pets');
      }

      if (lifestyleMatches.length > 0) {
        reasons.push(`Matching lifestyle preferences (${lifestyleMatches.join(', ')})`);
      }
    }

    setCompatInfo({
      score: Math.min(score, 100),
      reason: reasons.length > 0 ? reasons.join('. ') + '.' : 'No significant matches.'
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-4 space-y-6">
        <div className="h-6 w-32 bg-dark-800 rounded-full animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-8 rounded-3xl animate-pulse h-32"></div>
            <div className="glass-panel p-4 rounded-3xl animate-pulse h-[350px]"></div>
            <div className="glass-panel p-8 rounded-3xl animate-pulse h-60"></div>
          </div>
          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-3xl animate-pulse h-36"></div>
            <div className="glass-panel p-8 rounded-3xl animate-pulse h-28"></div>
            <div className="glass-panel p-8 rounded-3xl animate-pulse h-60"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) return null;

  const hasImages = property.images && property.images.length > 0;
  const owner = property.owner || {};

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/properties" 
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
        >
          <span>← Back to all properties</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details (Col 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Location Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brand-300 mb-2">
              {property.propertyType} • {property.furnishing}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {property.title}
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1.5 flex items-center">
              📍 {property.address}, {property.locality}, {property.city}
            </p>
          </div>

          {/* Media Images Banner */}
          <div className="glass-panel p-4 rounded-3xl">
            <div className="h-[350px] w-full bg-dark-850 rounded-2xl overflow-hidden relative group">
              {hasImages ? (
                <>
                  <img 
                    src={property.images[activeImageIndex]} 
                    alt={`${property.title} - ${activeImageIndex + 1}`} 
                    className="w-full h-full object-cover transition-all duration-300" 
                  />
                  {property.images.length > 1 && (
                    <>
                      {/* Navigation arrows */}
                      <button 
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-950/70 hover:bg-brand-500 text-white rounded-full p-2.5 transition-colors border border-dark-700/60 shadow-premium cursor-pointer"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-950/70 hover:bg-brand-500 text-white rounded-full p-2.5 transition-colors border border-dark-700/60 shadow-premium cursor-pointer"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Dots indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-dark-950/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        {property.images.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`h-2 w-2 rounded-full transition-all cursor-pointer ${
                              idx === activeImageIndex ? 'bg-brand-400 w-4' : 'bg-slate-500 hover:bg-slate-350'
                            }`}
                          ></button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" 
                  alt="Default property placeholder" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
          </div>

          {/* Details & Description */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50">About this property</h2>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bedrooms</span>
                <p className="text-base font-bold text-white mt-0.5">{property.bedrooms} BHK</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bathrooms</span>
                <p className="text-base font-bold text-white mt-0.5">{property.bathrooms}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Security Deposit</span>
                <p className="text-base font-bold text-white mt-0.5">₹{property.securityDeposit.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Available From</span>
                <p className="text-base font-bold text-white mt-0.5">{new Date(property.availableFrom).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-gradient pb-2 border-b border-dark-700/50 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, index) => (
                  <span 
                    key={index}
                    className="px-3.5 py-1.5 bg-dark-950 border border-dark-800 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info - Match Score & Contact (Col 1/3) */}
        <div className="space-y-6">
          {/* 1. Compatibility Display (Tenants only) */}
          {compatInfo && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border-brand-500/20 bg-brand-950/10">
              <span className="inline-block px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[10px] font-bold uppercase rounded-full tracking-wider mb-4">
                Co-living Score
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">{compatInfo.score}%</span>
                <span className="text-xs text-slate-400 font-medium">Match Score</span>
              </div>
              <div className="w-full bg-dark-850 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-brand-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${compatInfo.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-300 leading-normal mt-4 bg-dark-950/60 p-3 rounded-lg border border-dark-800">
                {compatInfo.reason}
              </p>
            </div>
          )}

          {/* 2. Rent Cost Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Monthly Rent</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-3xl font-black text-white">₹{property.rent.toLocaleString()}</span>
              <span className="text-sm text-slate-400">/ month</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mt-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {property.isAvailable ? 'Available Now' : 'Occupied'}
            </span>
          </div>

          {/* 3. Owner details / Contact Info */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-gradient pb-2 border-b border-dark-700/50 mb-4">Contact Owner</h3>
            
            <div className="space-y-4">
              {/* Owner details */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-white uppercase flex-shrink-0">
                  {owner.fullName ? owner.fullName.substring(0, 2) : 'OW'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{owner.fullName || 'Landlord'}</p>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Property Owner</p>
                </div>
              </div>

              {/* Real contact parameters (only visible if logged in) */}
              {isAuthenticated ? (
                <div className="space-y-2 pt-3 border-t border-dark-800 text-sm">
                  <p className="text-slate-300 truncate">
                    <strong>✉ Email:</strong> {owner.email || 'N/A'}
                  </p>
                  <p className="text-slate-300">
                    <strong>📞 Phone:</strong> {owner.phone || 'No phone listed'}
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-dark-800 text-center">
                  <p className="text-xs text-slate-400 mb-3 leading-normal">
                    Sign in to view owner contact details and verify co-living compatibility scores.
                  </p>
                  <Link 
                    to="/login"
                    className="inline-block w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                  >
                    Sign In to Contact
                  </Link>
                </div>
              )}

              {/* Owner Lifestyle preferences */}
              {owner.lifestyle && (
                <div className="pt-4 border-t border-dark-800">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Owner's Habits</p>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p>🚬 Smoking: <span className="font-semibold text-white capitalize">{owner.lifestyle.smoking || 'N/A'}</span></p>
                    <p>🍺 Drinking: <span className="font-semibold text-white capitalize">{owner.lifestyle.drinking || 'N/A'}</span></p>
                    <p>🐾 Pets: <span className="font-semibold text-white capitalize">{owner.lifestyle.pets || 'N/A'}</span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetails;
