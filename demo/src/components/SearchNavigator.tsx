import React, { useState, useCallback } from 'react';

const SearchNavigator = ({ containerRef, highlightStyle, searchTerm, dependencies = [] }) => {
 const [currentIndex, setCurrentIndex] = useState(0);
 const [matches, setMatches] = useState([]);

 const findMatches = useCallback(() => {
   if (!containerRef.current) {
     setMatches([]);
     setCurrentIndex(0);
     return;
   }

   const foundMatches = containerRef.current.querySelectorAll('mark[data-highlighter="true"]');

   setMatches(foundMatches);
   setCurrentIndex(0);
 }, [containerRef, searchTerm, ...dependencies]);

 React.useEffect(() => {
   findMatches();
 }, [findMatches]);

 const scrollToMatch = useCallback((index) => {
   if (matches.length === 0) return;

   // Reset all highlights
   matches.forEach((mark, i) => {
     mark.style.backgroundColor = i === index ? '#ff6b6b' : highlightStyle.backgroundColor;
     mark.style.boxShadow = i === index ? '0 0 8px rgba(255, 107, 107, 0.6)' : 'none';
   });

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

 // React.useEffect(() => {
 //   if (matches.length > 0) {
 //     scrollToMatch(currentIndex);
 //   }
 // }, [currentIndex, matches, scrollToMatch, searchTerm]);

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
