import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Local loading state for login button
  const { login } = useAuth(); // Removed isAuthenticated, userRole as redirection is handled by AppContent's useEffect
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Trim email to remove accidental spaces
    const success = await login(email.trim(), password);
    setLoading(false);

    if (success) {
      // AuthContext useEffect will handle setting isAuthenticated and userRole,
      // and the AppContent's useEffect handles redirection.
    } else {
      setError('Invalid email or password.');
    }
  };

  const fillDemoCreds = (role: string) => {
      if (role === 'user') {
          setEmail('user@example.com');
          setPassword('password123');
      } else if (role === 'vendor') {
          setEmail('vendor@example.com');
          setPassword('password123');
      } else if (role === 'admin') {
          setEmail('admin@example.com');
          setPassword('password123');
      }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login to BANTConfirm</h2>
        
        {/* Demo Credentials Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="font-bold text-blue-700 text-sm mb-2">Demo Credentials:</p>
            <div className="flex gap-2 justify-center text-xs">
                <button type="button" onClick={() => fillDemoCreds('user')} className="bg-blue-200 hover:bg-blue-300 text-blue-800 px-2 py-1 rounded">User</button>
                <button type="button" onClick={() => fillDemoCreds('vendor')} className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-2 py-1 rounded">Vendor</button>
                <button type="button" onClick={() => fillDemoCreds('admin')} className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-2 py-1 rounded">Admin</button>
            </div>
            <p className="text-xs text-blue-600 mt-2 text-center">Password: <strong>password123</strong> (for all)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-live="polite"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account? <a href="#/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;