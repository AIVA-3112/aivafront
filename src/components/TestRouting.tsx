import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestRouting: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigateToLogin = () => {
    console.log('Navigating to login...');
    navigate('/login');
  };
  
  const handleNavigateToSignup = () => {
    console.log('Navigating to signup...');
    navigate('/signup');
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Test Routing Component</h1>
      <button 
        onClick={handleNavigateToLogin}
        style={{ padding: '10px 20px', margin: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to Login
      </button>
      <button 
        onClick={handleNavigateToSignup}
        style={{ padding: '10px 20px', margin: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Go to Signup
      </button>
    </div>
  );
};

export default TestRouting;