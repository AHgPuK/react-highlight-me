import React from "react";

// Sample Content Components
const BlogPost = () => (
  <article style={{
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}>
    <h2 style={{ color: '#2d3748', marginBottom: '16px' }}>
      Advanced JavaScript Techniques for Modern Web Development
    </h2>
    <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>
      JavaScript has evolved significantly over the years. From ES6 to ES2023, we've seen incredible
      improvements in syntax, performance, and functionality. React has become the dominant library
      for building user interfaces, while TypeScript adds type safety to our JavaScript applications.
    </p>
    <p style={{ lineHeight: '1.6', marginBottom: '12px' }}>
      Modern web development requires understanding of async/await patterns, module systems,
      and component-based architectures. The ecosystem includes tools like Webpack, Vite,
      and various testing frameworks that make development more efficient.
    </p>
    <div style={{
      background: 'rgba(255,255,255,0.7)',
      padding: '16px',
      borderRadius: '8px',
      borderLeft: '4px solid #4299e1'
    }}>
      <strong>Key Technologies:</strong> React, TypeScript, Node.js, Express, MongoDB, GraphQL
    </div>
  </article>
);

export default BlogPost;
