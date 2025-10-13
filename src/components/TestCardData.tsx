import React, { useState, useEffect } from 'react';
import { cardAPI } from '../utils/api';

const TestCardData: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<string>('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cardAPI.getCards();
      
      // Store raw response data for debugging
      setRawData(JSON.stringify(response, null, 2));
      
      setCards(response.cards || []);
    } catch (err: any) {
      setError('Failed to fetch card data: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors mr-4"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Card Data Debug</h1>
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4">Loading card data...</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p>Total cards: {cards.length}</p>
                {cards.length > 0 && (
                  <p>
                    Fields in first card: {Object.keys(cards[0]).filter(key => 
                      !['etag', 'partitionKey', 'rowKey', 'timestamp'].includes(key)
                    ).length}
                  </p>
                )}
              </div>
              
              {cards.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">First Card Data (Raw)</h3>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(cards[0], null, 2)}
                  </pre>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-2">Full API Response (Raw)</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {rawData}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Card Data Table */}
        {cards.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(cards[0])
                      .filter(key => !['etag', 'partitionKey', 'rowKey', 'timestamp'].includes(key))
                      .map((key) => (
                        <th 
                          key={key} 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cards.slice(0, 5).map((card, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {Object.keys(card)
                        .filter(key => !['etag', 'partitionKey', 'rowKey', 'timestamp'].includes(key))
                        .map((key) => (
                          <td 
                            key={key} 
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {String(card[key] || 'N/A')}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCardData;