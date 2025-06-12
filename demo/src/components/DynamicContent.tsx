import React from 'react';

const DynamicContent = () => {
  return (
    <div style={{
      background: 'white',
      border: '2px dashed #e2e8f0',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      marginBottom: '16px'
    }}>
      <h4 style={{ color: '#718096', marginBottom: '8px' }}>Dynamic Content Area</h4>
      <p style={{ color: '#a0aec0', fontSize: '14px' }}>
        Type new words above to see real-time highlighting. Try regex patterns like /\d+/ for numbers,
        /[A-Z]&#123;2,&#125;/ for uppercase sequences, or /\b\w&#123;8,&#125;\b/ for long words.
      </p>
      <div style={{
        background: '#f7fafc',
        padding: '12px',
        borderRadius: '6px',
        marginTop: '12px',
        fontSize: '13px',
        color: '#4a5568'
      }}>
        <strong>Quick Test:</strong> React components use TypeScript for type safety.
        The useState hook manages state in functional components. Error handling
        prevents bugs and improves user experience. Success metrics help measure
        application performance and user satisfaction.
      </div>
    </div>
  )
}

export default DynamicContent;
