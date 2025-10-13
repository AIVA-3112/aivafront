import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminSignUpRequest from './components/AdminSignUpRequest';
import AdminDashboard from './components/AdminDashboard';
import OAuthCallback from './components/OAuthCallback';
import CardScanning from './components/CardScanning';
import WorkspacesPage from './components/WorkspacesPage';
import HistoryPage from './components/HistoryPage';
import BookmarksPage from './components/BookmarksPage';
import LikedMessagesPage from './components/LikedMessagesPage';
import DislikedMessagesPage from './components/DislikedMessagesPage';
import FeedbackPage from './components/FeedbackPage';
import AboutAIVA from './components/AboutAIVA';
import AIVAPresentation from './components/AIVAPresentation';
import DataQueryPanel from './components/DataQueryPanel';
import TestAdminDB from './components/TestAdminDB';
import TestRouting from './components/TestRouting';

// Wrapper component for AdminSignUpRequest to use useNavigate hook
const AdminSignUpRequestWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin/login');
  };
  
  const handleSignUpRequested = () => {
    navigate('/admin/login');
  };
  
  return <AdminSignUpRequest onBack={handleBack} onSignUpRequested={handleSignUpRequested} />;
};

// Wrapper component for HomePage to use useNavigate hook
const HomePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToLogin = () => {
    console.log('HomePage: Navigating to login...');
    navigate('/login');
  };
  
  const handleNavigateToSignUp = () => {
    console.log('HomePage: Navigating to signup...');
    navigate('/signup');
  };
  
  const handleNavigateToDashboard = () => {
    console.log('HomePage: Navigating to dashboard...');
    navigate('/dashboard');
  };
  
  // Get user from localStorage if available
  const [storedUser, setStoredUser] = useState<any>(null);
  
  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      try {
        setStoredUser(JSON.parse(userFromStorage));
      } catch (e) {
        console.error('Error parsing user data:', e);
        setStoredUser(null);
      }
    }
  }, []);
  
  return (
    <HomePage 
      user={storedUser}
      onNavigateToLogin={handleNavigateToLogin}
      onNavigateToSignUp={handleNavigateToSignUp}
      onNavigateToDashboard={handleNavigateToDashboard}
    />
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check authentication status on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedAdminAuth = localStorage.getItem('adminAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    if (storedAdminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleAdminLogin = (adminData: any) => {
    setIsAdminAuthenticated(true);
    setUser(adminData);
    localStorage.setItem('adminAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(adminData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminLicenseVerified');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('currentAdminRequest');
  };

  // Wrapper components for pages that need navigation
  const LoginPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate('/');
    };
    
    const handleNavigateToSignUp = () => {
      navigate('/signup');
    };
    
    const handleNavigateToHome = () => {
      navigate('/');
    };
    
    const handleNavigateToAdminLogin = () => {
      navigate('/admin/login');
    };
    
    // Modified login success handler that also navigates to dashboard
    const handleLoginSuccess = (userData: any) => {
      handleLogin(userData);
      navigate('/dashboard');
    };
    
    return (
      <LoginPage 
        onBack={handleBack}
        onLoginSuccess={handleLoginSuccess}
        onNavigateToSignUp={handleNavigateToSignUp}
        onNavigateToHome={handleNavigateToHome}
        onNavigateToAdminLogin={handleNavigateToAdminLogin}
      />
    );
  };
  
  const SignUpPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate('/');
    };
    
    const handleSignUpSuccess = (userData: any) => {
      handleLogin(userData);
      navigate('/dashboard');
    };
    
    const handleNavigateToLogin = () => {
      navigate('/login');
    };
    
    const handleNavigateToHome = () => {
      navigate('/');
    };
    
    return (
      <SignUpPage 
        onBack={handleBack}
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToHome={handleNavigateToHome}
      />
    );
  };
  
  const AdminLoginWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate('/');
    };
    
    const handleAdminLoginSuccess = (adminData: any) => {
      handleAdminLogin(adminData);
      navigate('/admin/dashboard');
    };
    
    const handleNavigateToAdminSignUp = () => {
      navigate('/admin/signup-request');
    };
    
    return (
      <AdminLogin 
        onBack={handleBack}
        onAdminLoginSuccess={handleAdminLoginSuccess}
        onNavigateToAdminSignUp={handleNavigateToAdminSignUp}
      />
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePageWrapper />} />
          <Route path="/test-routing" element={<TestRouting />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/signup" element={<SignUpPageWrapper />} />
          <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard user={user} onLogout={handleLogout} onSwitchAccount={() => {}} onNavigateToHome={() => {}} onNavigateHome={() => {}} onNavigateToDashboard={() => {}} /> : <Navigate to="/login" />} />
          <Route path="/admin/login" element={<AdminLoginWrapper />} />
          <Route path="/admin/signup-request" element={<AdminSignUpRequestWrapper />} />
          <Route path="/admin/dashboard" element={isAdminAuthenticated ? <AdminDashboard admin={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
          <Route path="/auth/microsoft/callback" element={<OAuthCallback provider="microsoft" />} />
          <Route path="/card-scanning" element={<CardScanning onBack={() => {}} />} />
          <Route path="/workspaces" element={<WorkspacesPage onBack={() => {}} workspaces={[]} onSelectWorkspace={() => {}} />} />
          <Route path="/history" element={<HistoryPage onBack={() => {}} chatHistory={[]} onLoadChat={() => {}} onNavigateToMessage={() => {}} />} />
          <Route path="/bookmarks" element={<BookmarksPage onBack={() => {}} bookmarkedMessages={[]} onNavigateToMessage={() => {}} />} />
          <Route path="/liked" element={<LikedMessagesPage onBack={() => {}} likedMessages={[]} onNavigateToMessage={() => {}} />} />
          <Route path="/disliked" element={<DislikedMessagesPage onBack={() => {}} dislikedMessages={[]} onNavigateToMessage={() => {}} />} />
          <Route path="/feedback" element={<FeedbackPage user={user} onNavigateToDashboard={() => {}} />} />
          <Route path="/about" element={<AboutAIVA onBack={() => {}} />} />
          <Route path="/presentation" element={<AIVAPresentation isOpen={false} onClose={() => {}} />} />
          <Route path="/data-query" element={<DataQueryPanel />} />
          <Route path="/test-admin-db" element={<TestAdminDB />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;