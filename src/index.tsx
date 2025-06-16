import React, { useLayoutEffect, useRef, useCallback, useState } from 'react';

type Props = {
  children?: React.ReactNode;
  words?: string[] | string | RegExp | RegExp[];
  highlightStyle?: React.CSSProperties;
  caseSensitive?: boolean;
  isWordBoundary?: boolean;
  isDebug?: boolean;
}
// Alternative approach: Use a single observer that never disconnects
const TextHighlighter = ({
  children,
  words = [],
  highlightStyle = { backgroundColor: 'yellow', fontWeight: 'bold' },
  caseSensitive = false,
  isWordBoundary = false,
  isDebug = false,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const lastHighlightSignature = useRef<string>('');
  const [isInitiallyReady, setIsInitiallyReady] = useState(false);

  const propsRef = useRef({ words, highlightStyle, caseSensitive, isWordBoundary });
  propsRef.current = { words, highlightStyle, caseSensitive, isWordBoundary };

  const getTextSignature = useCallback((element: HTMLElement): string => {
    // Create a signature of all text content to detect real changes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textParts: string[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!(node as Text).parentElement?.hasAttribute('data-highlighter')) {
        textParts.push((node as Text).textContent || '');
      }
    }

    return textParts.join('|');
  }, []);

  const highlightTextInElement = useCallback((element: HTMLElement) => {
    const { words, highlightStyle, caseSensitive, isWordBoundary } = propsRef.current;
    const wordsArray = Array.isArray(words) ? words : [words];

    isDebug && console.log('Highlighting with words:', wordsArray);

    // Remove existing highlights
    const existingMarks = element.querySelectorAll('mark[data-highlighter="true"]');
    existingMarks.forEach(mark => {
      const textContent = mark.textContent || '';
      const textNode = document.createTextNode(textContent);
      mark.parentNode?.replaceChild(textNode, mark);
    });

    element.normalize(); // Ensure text nodes are merged

    if (!wordsArray.length || wordsArray.every(word => !word)) {
      lastHighlightSignature.current = getTextSignature(element);
      return;
    }

    // Apply highlighting (same logic as before)
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      if (!text.trim()) return;

      const pattern = wordsArray
        .filter(word => word)
        .map(word => {
          if (word instanceof RegExp) {
            return word.source;
          }
          let term = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (isWordBoundary) {
            term = `\\b${term}\\b`;
          }
          return term;
        })
        .join('|');

      if (!pattern) return;

      const regex = new RegExp(`(${pattern})`, caseSensitive ? 'g' : 'gi');
      const parts = text.split(regex);

      if (parts.length > 1) {
        const fragment = document.createDocumentFragment();

        parts.forEach(part => {
          if (!part) return;

          const shouldHighlight = wordsArray.some(word => {
            if (word instanceof RegExp) {
              const flags = caseSensitive ? word.flags : [...new Set([...word.flags.split(''), 'i'])].join('');
              const testRegex = new RegExp(word.source, flags);
              return testRegex.test(part);
            }
            return caseSensitive
              ? part === word.trim()
              : part.toLowerCase() === word.trim().toLowerCase();
          });

          if (shouldHighlight) {
            const mark = document.createElement('mark');
            mark.setAttribute('data-highlighter', 'true');
            Object.assign(mark.style, highlightStyle);
            mark.textContent = part;
            fragment.appendChild(mark);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        textNode.parentNode?.replaceChild(fragment, textNode);
      }
    });

    // Update signature after highlighting
    lastHighlightSignature.current = getTextSignature(element);
  }, [getTextSignature]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    isDebug && console.log('Setting up persistent MutationObserver');

    highlightTextInElement(containerRef.current);
    setIsInitiallyReady(true);

    observerRef.current = new MutationObserver((mutations) => {
      if (!containerRef.current) return;

      // Check if the text signature has actually changed
      const currentSignature = getTextSignature(containerRef.current);

      if (currentSignature !== lastHighlightSignature.current) {
        isDebug && console.log('Text signature changed, re-highlighting');
        isDebug && console.log('Old:', lastHighlightSignature.current);
        isDebug && console.log('New:', currentSignature);

        highlightTextInElement(containerRef.current);
      } else {
        isDebug && console.log('Text signature unchanged, ignoring mutation');
      }
    });

    observerRef.current.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [words, highlightStyle, caseSensitive, isWordBoundary, highlightTextInElement, getTextSignature]);

  return (
    <div
      ref={containerRef}
      style={{
        visibility: isInitiallyReady ? 'visible' : 'hidden',
        minHeight: isInitiallyReady ? 'auto' : '1em'
      }}
    >
      {children}
    </div>
  );
};

export default TextHighlighter;
