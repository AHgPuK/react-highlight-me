import React from 'react';
import NewsCard from './NewsCard';

const News = () => {
  return <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  }}>
    <NewsCard
      title="React 18.3 Released with Performance Improvements"
      content="The latest React version includes automatic batching, concurrent features, and improved TypeScript support. Developers can now use Suspense for data fetching more effectively."
      date="December 15, 2024"
    />
    <NewsCard
      title="JavaScript Runtime Benchmarks 2024"
      content="Node.js 21 shows significant performance gains over previous versions. Bun and Deno continue to challenge traditional JavaScript runtimes with innovative approaches."
      date="December 12, 2024"
    />
  </div>
};

export default News;
