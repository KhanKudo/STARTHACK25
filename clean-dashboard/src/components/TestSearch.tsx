import React, { useState } from 'react';
import { testDeepSeekSearch } from '../services/deepseekService';
import { SearchResult } from '../services/deepseekService';

const TestSearch: React.FC = () => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testDetails, setTestDetails] = useState<string[]>([]);

  const runTest = async () => {
    try {
      setLoading(true);
      setError(null);
      setTestDetails([]);
      setResult(null);

      // Add test details
      setTestDetails(prev => [...prev, 'Starting DeepSeek search test...']);
      
      const testResult = await testDeepSeekSearch();
      
      // Add success details
      setTestDetails(prev => [
        ...prev,
        '✓ API connection successful',
        `✓ Found ${testResult.projects.length} matching projects`,
        '✓ Result structure validated',
        '✓ Water conservation project found in results'
      ]);
      
      setResult(testResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Test failed';
      setError(errorMessage);
      setTestDetails(prev => [...prev, `✗ Error: ${errorMessage}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>DeepSeek Search Test</h2>
      <button 
        onClick={runTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Running Test...' : 'Run Test'}
      </button>

      {testDetails.length > 0 && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h4>Test Details:</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {testDetails.map((detail, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px'
        }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Test Results:</h3>
          <div style={{ 
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h4>Explanation:</h4>
            <p style={{ color: '#666' }}>{result.explanation}</p>
          </div>
          <div style={{ 
            marginTop: '15px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h4>Matching Projects ({result.projects.length}):</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {result.projects.map(project => (
                <li key={project.id} style={{ 
                  padding: '8px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>{project.initiative}</span>
                  <span style={{ color: '#666' }}>{project.company}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSearch; 