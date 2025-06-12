import React from 'react';

const CodeExample = () => (
  <div style={{
    background: '#1a202c',
    color: '#e2e8f0',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: '14px',
    overflow: 'auto'
  }}>
    <div style={{ color: '#68d391', marginBottom: '8px' }}>// React Hook Example</div>
    <div>
      <span style={{ color: '#f687b3' }}>const</span>{' '}
      <span style={{ color: '#90cdf4' }}>useCounter</span> = () =&gt; &#123;
    </div>
    <div style={{ marginLeft: '16px' }}>
      <span style={{ color: '#f687b3' }}>const</span>{' '}
      [count, setCount] = <span style={{ color: '#90cdf4' }}>useState</span>(0);
    </div>
    <div style={{ marginLeft: '16px' }}>
      <span style={{ color: '#f687b3' }}>return</span> {'{ count, increment: () => setCount(c => c + 1) };'}
    </div>
    <div>{'};'}</div>
  </div>
);

export default CodeExample;
