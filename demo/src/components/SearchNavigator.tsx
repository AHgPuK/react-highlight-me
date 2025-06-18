import React, { useState, useCallback } from 'react';

import TextHighlighter from '../../../src/index';

const SearchNavigator = ({ containerRef, highlightStyle, searchTerm, dependencies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<HTMLElement[]>([]);

  const getMatches = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const marks = containerRef.current.querySelectorAll(TextHighlighter.MARKS_IN_SCOPE_SELECTOR);
    return marks;
  }, [containerRef, searchTerm, ...dependencies]);

  const findMatches = useCallback(() => {
    if (!containerRef.current) {
      setMatches([]);
      setCurrentIndex(0);
      return;
    }

    const foundMatches = getMatches();

    setMatches(foundMatches);
    setCurrentIndex(0);

  }, [containerRef, searchTerm, ...dependencies]);

  React.useEffect(() => {
    findMatches();
  }, [findMatches]);

  const highlightElements = useCallback((matches, index) => {
    matches.forEach((mark, i) => {
      mark.style.backgroundColor = i === index ? '#ff6b6b' : highlightStyle.backgroundColor;
      mark.style.boxShadow = i === index ? '0 0 8px rgba(255, 107, 107, 0.6)' : 'none';
    });
  }, [searchTerm, containerRef, highlightStyle, ...dependencies]);

  const scrollToMatch = useCallback((index: number) => {
    // Highlight updates a content dynamically, so we need to get an updated list of DOM elements
    const matches = getMatches();
    if (matches.length === 0) return;

    // Reset all highlights
    highlightElements(matches, index);

    // Scroll to current match
    matches[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest'
    });

  }, [matches, highlightStyle]);

  const goNext = () => {
    if (matches.length === 0) return;
    const nextIndex = (currentIndex + 1) % matches.length;
    setCurrentIndex(nextIndex);
    scrollToMatch(nextIndex);
  };

  const goPrevious = () => {
    if (matches.length === 0) return;
    const prevIndex = currentIndex === 0 ? matches.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToMatch(prevIndex);
  };

  React.useEffect(() => {
    const matches = getMatches();
    if (matches.length > 0) {
      highlightElements(matches, currentIndex);
    }
  }, [currentIndex, matches, scrollToMatch, searchTerm]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#666'
    }}>
      <span>{matches.length > 0 ? `${currentIndex + 1} of ${matches.length}` : 'No matches'}</span>
      <button
        onClick={goPrevious}
        disabled={matches.length === 0}
        style={{
          padding: '4px 8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          background: matches.length > 0 ? '#f9f9f9' : '#e9ecef',
          cursor: matches.length > 0 ? 'pointer' : 'not-allowed',
          opacity: matches.length > 0 ? 1 : 0.5
        }}
      >
        ↑ Prev
      </button>
      <button
        onClick={goNext}
        disabled={matches.length === 0}
        style={{
          padding: '4px 8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          background: matches.length > 0 ? '#f9f9f9' : '#e9ecef',
          cursor: matches.length > 0 ? 'pointer' : 'not-allowed',
          opacity: matches.length > 0 ? 1 : 0.5
        }}
      >
        ↓ Next
      </button>
    </div>
  );
};

export default SearchNavigator;
