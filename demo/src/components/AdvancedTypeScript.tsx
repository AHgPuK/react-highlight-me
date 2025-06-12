import React from 'react';

const AdvancedTypeScript = () => {
  return (
    <div style={{
      background: '#2d3748',
      color: '#e2e8f0',
      padding: '20px',
      borderRadius: '8px',
      fontFamily: 'Monaco, Consolas, monospace',
      fontSize: '13px'
    }}>
      <div style={{ color: '#68d391', marginBottom: '12px' }}>// Advanced TypeScript Example</div>
      <div style={{ lineHeight: '1.5' }}>
        <div><span style={{ color: '#f687b3' }}>interface</span> <span
          style={{ color: '#90cdf4' }}>User</span> {'{'}</div>
        <div style={{ marginLeft: '16px' }}>id: <span style={{ color: '#fbb6ce' }}>number</span>;</div>
        <div style={{ marginLeft: '16px' }}>name: <span style={{ color: '#fbb6ce' }}>string</span>;</div>
        <div style={{ marginLeft: '16px' }}>email: <span style={{ color: '#fbb6ce' }}>string</span>;</div>
        <div style={{ marginLeft: '16px' }}>isActive: <span style={{ color: '#fbb6ce' }}>boolean</span>;</div>
        <div>{'}'}</div>
        <br/>
        <div><span style={{ color: '#f687b3' }}>const</span> <span style={{ color: '#90cdf4' }}>users</span>:
          User[] = [
        </div>
        <div
          style={{ marginLeft: '16px' }}>{'{ id: 1, name: "Alice", email: "alice@example.com", isActive: true },'}</div>
        <div
          style={{ marginLeft: '16px' }}>{'{ id: 2, name: "Bob", email: "bob@test.org", isActive: false },'}</div>
        <div>];</div>
        <br/>
        <div><span style={{ color: '#f687b3' }}>function</span> <span
          style={{ color: '#90cdf4' }}>findActiveUsers</span>(users: User[]): User[] {'{'}</div>
        <div style={{ marginLeft: '16px' }}><span style={{ color: '#f687b3' }}>return</span> users.<span
          style={{ color: '#90cdf4' }}>filter</span>(user =&gt; user.isActive);
        </div>
        <div>{'}'}</div>
      </div>
    </div>
  )
}

export default AdvancedTypeScript;
