import React from 'react';

const NewsCard = ({ title, content, date }) => (
  <div style={{
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  }}
       onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-2px)';
         e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
       }}>
    <h3 style={{ color: '#2d3748', marginBottom: '8px', fontSize: '18px' }}>{title}</h3>
    <p style={{ color: '#4a5568', lineHeight: '1.5', marginBottom: '8px' }}>{content}</p>
    <div style={{ color: '#718096', fontSize: '12px' }}>{date}</div>
  </div>
);

export default NewsCard;
