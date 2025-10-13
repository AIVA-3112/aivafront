import React, { useState } from 'react';
import { insertAdminRequest, verifyLicenseKey } from '../utils/adminDatabase';

const TestAdminDB: React.FC = () => {
  const [username, setUsername] = useState('testuser');
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResults('Testing connection...\n');
    
    try {
      setResults(prev => prev + '1. Submitting admin request...\n');
      const licenseKey = await insertAdminRequest({ username, email, password });
      setResults(prev => prev + `✅ Request submitted successfully!\nLicense Key: ${licenseKey}\n\n`);
      
      setResults(prev => prev + '2. Verifying license key...\n');
      const isValid = await verifyLicenseKey(email, licenseKey);
      setResults(prev => prev + `License Key Valid: ${isValid}\n`);
      
      if (isValid) {
        setResults(prev => prev + '✅ License key verification successful!\n');
      } else {
        setResults(prev => prev + '❌ License key verification failed!\n');
      }
      
      setResults(prev => prev + '\n🎉 All tests completed successfully!');
    } catch (error: any) {
      setResults(prev => prev + `❌ Error: ${error.message}\n`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Database Connection Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Admin Request Submission</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            <button 
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Submit Admin Request'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="whitespace-pre-wrap font-mono text-sm bg-gray-700 p-4 rounded">
            {results || 'Click "Submit Admin Request" to test the connection...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdminDB;