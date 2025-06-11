import React from 'react';

type Props = {
  children?: React.ReactElement | null;
  words?: string[] | string | RegExp | RegExp[];
  highlightStyle?: React.CSSProperties;
  caseSensitive?: boolean;
  isEscapePattern?: boolean;
  isWordBoundary?: boolean;
}

const TextHighlighter = ({ 
  children = '',
  words = [], 
  highlightStyle = { backgroundColor: 'yellow', fontWeight: 'bold' },
  caseSensitive = false,
  isEscapePattern = true,
  isWordBoundary = true,
}: Props) => {
  // Convert words to array if it's a string
  const wordsArray = Array.isArray(words) ? words : [words];
  
  // If no words to highlight, return original content
  if (!wordsArray.length || wordsArray.every(word => !word)) {
    return children;
  }

  // Function to escape regex special characters
  const escapeRegex = (term: string | RegExp) => {
    if (term instanceof RegExp) {
      return term.source
    }

    if (isEscapePattern) {
      term = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (isWordBoundary) {
      term = `\\b${term}\\b`;
    }

    return term
  };

  // Create a regex pattern for all words
  const pattern = wordsArray
    .filter(word => word)
    .map(word => escapeRegex(word))
    .join('|');
  
  if (!pattern) {
    return children;
  }

  const regex = new RegExp(`(${pattern})`, caseSensitive ? 'g' : 'gi');

  // Function to highlight text content
  const highlightText = (textContent) => {
    if (!textContent || typeof textContent !== 'string') {
      return textContent;
    }

    const parts = textContent.split(regex);

    return parts.map((part, index) => {
      const shouldHighlight = wordsArray.some(word => {
        if (word instanceof RegExp) {
          return word.test(part);
        }
        return caseSensitive
          ? part === word.trim()
          : part.toLowerCase() === word.trim().toLowerCase();
      });

      return shouldHighlight ? (
        <mark key={index} style={highlightStyle}>
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  // Function to recursively process React elements
  const processElement = (element) => {
    if (typeof element === 'string') {
      return highlightText(element);
    }
    
    if (typeof element === 'number') {
      return element;
    }

    if (!React.isValidElement(element)) {
      return element;
    }

    // Clone element and process its children
    const processedChildren = React.Children.map(element.props.children, (child) => {
      if (typeof child === 'string') {
        return highlightText(child);
      }
      return processElement(child);
    });

    return React.cloneElement(element, {}, processedChildren);
  };

  return processElement(children);
};

export default TextHighlighter;
