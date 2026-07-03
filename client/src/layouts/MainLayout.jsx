import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MainLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomeActive = location.pathname === '/';
  const isBrowseActive = location.pathname.startsWith('/properties') && !location.pathname.includes('/my') && !location.pathname.includes('/create') && !location.pathname.includes('/edit');
  const isLoginActive = location.pathname === '/login';
  const isRegisterActive = location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      {/* Premium Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-dark-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold text-gradient">NestMatch AI</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium items-center">
              <Link 
                to="/" 
                className={`transition-colors pb-1 border-b-2 ${
                  isHomeActive 
                    ? 'text-white font-bold border-brand-500' 
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className={`transition-colors pb-1 border-b-2 ${
                  isBrowseActive 
                    ? 'text-white font-bold border-brand-500' 
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                Browse Properties
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to={user.role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} 
                    className="text-slate-300 hover:text-white transition-colors pb-1 border-b-2 border-transparent"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-4 border-l border-dark-800 pl-6">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">{user.role}</p>
                      <p className="text-sm font-medium text-white max-w-[120px] truncate">{user.fullName}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 hover:text-white border border-dark-700 transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex space-x-4 items-center">
                  <Link 
                    to="/login" 
                    className={`px-3 py-2 text-sm transition-colors pb-1 border-b-2 ${
                      isLoginActive 
                        ? 'text-white font-bold border-brand-500' 
                        : 'text-slate-300 hover:text-white border-transparent'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className={`bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-premium transition-all hover:translate-y-[-1px] ${
                      isRegisterActive ? 'ring-2 ring-brand-300' : ''
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Hamburger menu */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-400 hover:text-white p-2 rounded-md focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-950/95 border-b border-dark-800 px-4 pt-2 pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                isHomeActive 
                  ? 'text-white bg-dark-800 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                isBrowseActive 
                  ? 'text-white bg-dark-800 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              Browse Properties
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={user.role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-dark-800"
                >
                  Dashboard
                </Link>
                <div className="border-t border-dark-800 pt-4 mt-2">
                  <div className="px-3 mb-3">
                    <p className="text-xs text-brand-300 font-semibold uppercase">{user.role}</p>
                    <p className="text-base text-white">{user.fullName}</p>
                  </div>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="w-full text-center bg-dark-800 border border-dark-700 text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-dark-800">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-center py-2 rounded-md text-base font-medium transition-all ${
                    isLoginActive 
                      ? 'text-white bg-dark-800 font-semibold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-brand-500 text-white py-2 rounded-md text-base font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Premium Dark Footer */}
      <footer className="bg-dark-950 border-t border-dark-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-2xl font-bold text-gradient mb-2">NestMatch AI</p>
          <p className="text-sm text-slate-500">Connecting compatible tenants with owners using rule-based preferences.</p>
          <div className="mt-4 flex justify-center space-x-6 text-xs text-slate-600">
            <span>© 2026 NestMatch AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
