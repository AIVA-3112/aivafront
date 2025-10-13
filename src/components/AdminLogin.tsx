import React, { useState, useEffect } from 'react';
import { ChevronLeft, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
// Use dynamic imports only to avoid conflicts

interface AdminLoginProps {
  onBack: () => void;
  onAdminLoginSuccess: (admin: any) => void;
  onNavigateToAdminSignUp?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onAdminLoginSuccess, onNavigateToAdminSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [productKey, setProductKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingMicrosoft, setIsLoadingMicrosoft] = useState(false);
  const [socialLoginError, setSocialLoginError] = useState<string | null>(null);

  const handleMicrosoftAdminLogin = async () => {
    setIsLoadingMicrosoft(true);
    setSocialLoginError(null);
    
    try {
      console.log('Starting Microsoft admin login with role verification...');
      
      // Import and use the new admin login function with role checking
      const { handleMicrosoftAdminLogin: adminLogin, msalInstance, isLoggedInWithMicrosoft, getCurrentMicrosoftUser } = await import('../utils/auth');
      const user = await adminLogin();
      
      console.log('Microsoft admin login user data received:', user);
      
      // Validate user data
      if (!user) {
        throw new Error('No user data received from Microsoft authentication');
      }
      
      if (!user.email && !user.name) {
        throw new Error('Incomplete user information received. Please try again.');
      }
      
      // Check if the user is from the authorized tenant
      if (!user.tenantId) {
        throw new Error('User is not from the authorized organization.');
      }
      
      // Send data to backend for validation
      const response = await fetch('/api/auth/microsoft/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: 'placeholder', // Backend expects a code parameter
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          provider: 'microsoft'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Microsoft authentication failed');
      }
      
      const data = await response.json();
      
      // Store JWT token from backend
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      localStorage.setItem('adminAuthenticated', 'true');
      
      const adminData = {
        email: data.user.email || 'admin@microsoft.com',
        firstName: data.user.firstName || user.name?.split(' ')[0] || 'Admin',
        lastName: data.user.lastName || user.name?.split(' ')[1] || 'User',
        provider: 'microsoft',
        tenantId: user.tenantId,
        roles: user.roles || ['AI Administrator']
      };
      
      console.log('Calling onAdminLoginSuccess with adminData:', adminData);
      onAdminLoginSuccess(adminData);
    } catch (error) {
      console.error('Microsoft admin login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Set more specific error messages
      if (errorMessage.includes('Popup blocked') || errorMessage.includes('popup')) {
        setSocialLoginError('Please allow pop-ups for this site and try again. Check your browser\'s address bar for a pop-up blocker icon.');
      } else if (errorMessage.includes('cancelled')) {
        setSocialLoginError('Microsoft login was cancelled.');
      } else if (errorMessage.includes('consent_required')) {
        setSocialLoginError('Additional permissions required. Please contact your administrator.');
      } else if (errorMessage.includes('interaction_required')) {
        setSocialLoginError('User interaction required. Please try logging in again.');
      } else if (errorMessage.includes('AI Administrator')) {
        setSocialLoginError('Access denied. You must have the "AI Administrator" role to access the admin portal.');
      } else {
        setSocialLoginError(`Microsoft admin login failed: ${errorMessage}`);
      }
    } finally {
      setIsLoadingMicrosoft(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    // Check if this is a license key verification
    if (localStorage.getItem('adminLicenseVerified') === 'true' && 
        localStorage.getItem('adminEmail') === email) {
      // License already verified, proceed to admin dashboard
      localStorage.setItem('adminAuthenticated', 'true');
      onAdminLoginSuccess({ 
        email, 
        firstName: 'Admin', 
        lastName: 'User' 
      });
      setLoading(false);
      return;
    }

    // Check for valid license key in localStorage (simulated database)
    const validLicenseKey = 'ADMIN-KEY-2025';
    if (productKey === validLicenseKey) {
      // Verify if this user has a pending request
      const adminRequests = JSON.parse(localStorage.getItem('adminRequests') || '[]');
      const userRequest = adminRequests.find((req: any) => req.email === email);
      
      if (userRequest) {
        // Mark as authenticated
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminUsername', userRequest.username);
        
        onAdminLoginSuccess({ 
          email, 
          firstName: 'Admin', 
          lastName: 'User' 
        });
        setLoading(false);
        return;
      }
    }

    try {
      // Make API call to backend for admin login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, adminLogin: true }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Invalid email or password');
        setLoading(false);
        return;
      }
      
      // Check if user has admin role
      if (data.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }
      
      // Store JWT token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('adminAuthenticated', 'true');
      
      onAdminLoginSuccess({ 
        email: data.user.email, 
        firstName: data.user.firstName || 'Admin', 
        lastName: data.user.lastName || 'User' 
      });
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize MSAL instance when component mounts
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        const { msalInstance } = await import('../utils/auth');
        await msalInstance.initialize();
      } catch (error) {
        console.error('MSAL initialization error:', error);
      }
    };
    
    initializeMSAL();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-slate-300 hover:text-white mb-8 transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-blue-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Sign in to your admin account</p>
          </div>

          {/* Social Login Error */}
          {socialLoginError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{socialLoginError}</p>
            </div>
          )}

          {/* Microsoft Login Button */}
          <button
            onClick={handleMicrosoftAdminLogin}
            disabled={isLoadingMicrosoft}
            className="w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl py-3 px-4 mb-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMicrosoft ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#0078D4" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
            )}
            <span className="text-white font-medium">
              {isLoadingMicrosoft ? 'Signing in with Microsoft...' : 'Sign in with Microsoft'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Product Key */}
            <div>
              <label htmlFor="productKey" className="block text-sm font-medium text-white mb-2">
                Product Key
              </label>
              <input
                id="productKey"
                type="text"
                value={productKey}
                onChange={(e) => setProductKey(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your product key"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4 text-white font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Admin Signup Link */}
          <div className="mt-6 text-center">
            <button
              onClick={onNavigateToAdminSignUp}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Don't have admin access? Request access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;