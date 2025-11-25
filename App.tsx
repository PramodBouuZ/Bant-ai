
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import AboutUsPage from './pages/AboutUsPage';
import FAQPage from './pages/FAQPage';
import ContactUsPage from './pages/ContactUsPage';
import SignupPage from './pages/SignupPage';
import PostRequirementPage from './pages/PostRequirementPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import { UserRole } from './types';

// ProtectedRoute component for role-based access control
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but role not allowed for this route, redirect
  if (userRole && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case UserRole.ADMIN:
        return <Navigate to="/admin-dashboard" replace />;
      case UserRole.VENDOR:
        return <Navigate to="/vendor-dashboard" replace />;
      case UserRole.USER:
      default:
        return <Navigate to="/" replace />; // Default user dashboard (HomePage)
    }
  }

  return <>{children}</>;
};

// Component to handle redirection after authentication
const AppContent: React.FC = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Redirect after login if user is authenticated and not on their specific dashboard route
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const currentHash = window.location.hash;
      let targetPath = '/'; // Default target for USER role

      if (userRole === UserRole.ADMIN) {
        targetPath = '/admin-dashboard';
      } else if (userRole === UserRole.VENDOR) {
        targetPath = '/vendor-dashboard';
      }
      // For UserRole.USER, targetPath remains '/', which is HomePage.

      // Redirect if currently on login/signup page OR if admin/vendor is not on their dashboard
      if (currentHash.startsWith('#/login') || currentHash.startsWith('#/signup') || 
          (targetPath !== '/' && !currentHash.startsWith(`#${targetPath}`))) {
        window.location.hash = targetPath;
      }
    }
  }, [isAuthenticated, userRole, loading]);


  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Publicly accessible routes */}
          <Route path="/" element={<HomePage />} /> {/* HomePage is now the default public dashboard */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactUsPage />} />

          {/* Protected Routes (for specific dashboards) */}
          <Route path="/post-requirement" element={<ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]}><PostRequirementPage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/vendor-dashboard" element={<ProtectedRoute allowedRoles={[UserRole.VENDOR]}><VendorDashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
