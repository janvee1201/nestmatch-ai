import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  // Determine sidebar navigation links based on user role
  const isOwner = user.role === 'OWNER';
  const navLinks = isOwner
    ? [
        { name: 'Dashboard', path: '/owner-dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
        { name: 'Create Property', path: '/properties/create', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'My Properties', path: '/properties/my', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Edit Profile', path: '/profile/edit', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ]
    : [
        { name: 'Dashboard', path: '/tenant-dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
        { name: 'Browse Properties', path: '/properties', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { name: 'Recommendations', path: '/recommendations', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { name: 'Edit Profile', path: '/profile/edit', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      ];

  return (
    <div className="min-h-screen flex bg-dark-950 text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-dark-800">
        {/* Brand/Logo */}
        <div className="h-16 flex items-center px-6 border-b border-dark-800">
          <Link to="/" className="text-xl font-extrabold text-gradient">NestMatch AI</Link>
        </div>

        {/* User Mini Profile */}
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-white uppercase">
              {user.fullName.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-300 uppercase mt-0.5 border border-brand-500/20">
                {user.role}
              </span>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-400">Profile Completion</span>
              <span className={user.profileCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                {user.profileCompleted ? '100%' : 'Incomplete'}
              </span>
            </div>
            <div className="w-full bg-dark-850 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${user.profileCompleted ? 'bg-emerald-500' : 'bg-amber-500 w-[50%]'}`}
                style={{ width: user.profileCompleted ? '100%' : '50%' }}
              ></div>
            </div>
            {!user.profileCompleted && (
              <p className="text-[10px] text-amber-300 mt-1.5">
                Please complete your profile to enable all features.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-premium'
                    : 'text-slate-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-dark-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors group"
          >
            <svg
              className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Toggle Menu */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          <aside className="relative flex flex-col w-64 max-w-xs bg-dark-900 border-r border-dark-800">
            <div className="h-16 flex items-center justify-between px-6 border-b border-dark-800">
              <span className="text-xl font-extrabold text-gradient">NestMatch AI</span>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 border-b border-dark-800">
              <p className="text-sm font-semibold text-white">{user.fullName}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-300 uppercase mt-0.5 border border-brand-500/20">
                {user.role}
              </span>
            </div>

            <nav className="flex-grow px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-premium'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                    </svg>
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-dark-800">
              <button
                onClick={() => { setMobileSidebarOpen(false); handleLogout(); }}
                className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
              >
                <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-dark-900 border-b border-dark-800 sticky top-0 z-40">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="text-sm font-semibold hidden md:block text-slate-400">
            Welcome back, <span className="text-white">{user.fullName}</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/properties" 
              className="text-xs font-semibold text-brand-300 hover:text-white border border-brand-500/30 bg-brand-500/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              Browse Flats
            </Link>
            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xs uppercase text-white shadow-premium">
              {user.fullName.substring(0, 2)}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
