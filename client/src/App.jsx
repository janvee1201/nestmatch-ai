import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import EditProfile from './pages/EditProfile.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import CreateProperty from './pages/CreateProperty.jsx';
import MyProperties from './pages/MyProperties.jsx';
import BrowseProperties from './pages/BrowseProperties.jsx';
import Recommendations from './pages/Recommendations.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routing with MainLayout (Navbar & Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<BrowseProperties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
          </Route>

          {/* Protected Routes using DashboardLayout */}
          <Route element={<DashboardLayout />}>
            {/* Tenant specific routes */}
            <Route
              path="/tenant-dashboard"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute allowedRoles={['TENANT']}>
                  <Recommendations />
                </ProtectedRoute>
              }
            />

            {/* Owner specific routes */}
            <Route
              path="/owner-dashboard"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/my"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <MyProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/create"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <CreateProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <CreateProperty />
                </ProtectedRoute>
              }
            />

            {/* Common profile edit route (Tenant & Owner) */}
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Configuration */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(71, 85, 105, 0.4)',
              borderRadius: '12px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
