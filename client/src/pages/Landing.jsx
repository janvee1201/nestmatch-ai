import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] translate-x-[-50%] translate-y-[-50%] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase tracking-widest mb-6">
            Introducing NestMatch AI
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Find Your Perfect Flat & <span className="text-gradient">Compatible Housemate</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 font-medium mb-8 leading-relaxed">
            NestMatch AI connects tenants and property owners using smart rule-based matching. Discover listings that fit your location, budget, and lifestyle preferences.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link
                to={user.role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'}
                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-base font-bold shadow-premium hover:shadow-premium-hover transition-all text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-base font-bold shadow-premium hover:shadow-premium-hover transition-all text-center"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/properties"
                  className="px-8 py-4 bg-dark-800 border border-dark-700 hover:bg-dark-700 text-white rounded-xl text-base font-bold transition-all text-center"
                >
                  Browse Properties
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 sm:mt-24">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Rule-Based Compatibility</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our advanced algorithm grades matches based on exact location, rent bounds, timeline alignment, and lifestyle behaviors (smoking, drinking, pets).
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Filters</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Target your ideal space by filtering on property type (PG, Flat, Apartment, House), location, exact rent brackets, and furnishing choices.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover p-8 rounded-2xl">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure Verification</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Verify your credentials, manage property listings as an owner, or explore detailed matching profiles safely with authenticated JWT routes.
            </p>
          </div>
        </div>

        {/* Co-living section / Callout */}
        <div className="mt-24 sm:mt-32 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/30 to-purple-900/10 border border-brand-500/20 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Are you a Property Owner?</h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Register as an owner to list your properties, manage availability, specify amenities, and get connected with highly compatible tenants immediately.
            </p>
          </div>
          <Link
            to="/register"
            className="w-full md:w-auto px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-center shadow-premium whitespace-nowrap transition-all"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
