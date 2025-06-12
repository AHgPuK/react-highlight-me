import React from 'react';

const RegexPattern = () => {
  return (
    <div style={{
      background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '16px'
    }}>
      <h3 style={{ color: '#2d3748', marginBottom: '12px' }}>🔍 RegEx Pattern Examples</h3>
      <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
        <p>Test these patterns: Email addresses like user@example.com, phone numbers like 555-123-4567,
          dates like 2024-12-15, URLs like https://example.com, and various numbers like 42, 3.14159, or
          100%.</p>
        <p>JavaScript variables: const myVariable = 'value'; let counter = 0; var oldStyle = true;</p>
        <p>CSS properties: background-color: #ff6b6b; margin: 10px; padding: 5px 10px;</p>
      </div>
    </div>
  )
}

export default RegexPattern;
