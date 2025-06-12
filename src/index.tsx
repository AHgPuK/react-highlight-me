import React, { useLayoutEffect, useRef, useCallback, useState } from 'react';

type Props = {
  children?: React.ReactNode;
  words?: string[] | string | RegExp | RegExp[];
  highlightStyle?: React.CSSProperties;
  caseSensitive?: boolean;
  isWordBoundary?: boolean;
}

const TextHighlighter = ({
  children,
  words = [],
  highlightStyle = { backgroundColor: 'yellow', fontWeight: 'bold' },
  caseSensitive = false,
  isWordBoundary = true,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const isHighlightingRef = useRef(false);
  const [isInitiallyReady, setIsInitiallyReady] = useState(false);

  // Memoize the highlighting function to prevent unnecessary re-renders
  const highlightTextInElement = useCallback((element: HTMLElement) => {
    const wordsArray = Array.isArray(words) ? words : [words];
    if (!wordsArray.length || wordsArray.every(word => !word)) return;

    // Prevent infinite loops
    if (isHighlightingRef.current) return;
    isHighlightingRef.current = true;

    // Temporarily disconnect observer during highlighting
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    try {
      // Get all text nodes
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        // Skip nodes that are already inside <mark> tags
        const parentMark = (node as Text).parentElement?.closest('mark');
        if (!parentMark) {
          textNodes.push(node as Text);
        }
      }

      // Process each text node
      textNodes.forEach(textNode => {
        const text = textNode.textContent || '';
        if (!text.trim()) return;

        // Create regex pattern - handle mixed string/RegExp array
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
                const testRegex = new RegExp(word.source, caseSensitive ? word.flags : word.flags + 'i');
                return testRegex.test(part);
              }
              return caseSensitive
                ? part === word.trim()
                : part.toLowerCase() === word.trim().toLowerCase();
            });

            if (shouldHighlight) {
              const mark = document.createElement('mark');
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
    } finally {
      isHighlightingRef.current = false;

      // Reconnect observer after highlighting
      if (observerRef.current && containerRef.current) {
        observerRef.current.observe(containerRef.current, {
          childList: true,
          subtree: true,
          characterData: true
        });
      }
    }
  }, [words, highlightStyle, caseSensitive, isWordBoundary]);

  // Initial highlighting with useLayoutEffect (prevents flicker)
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    highlightTextInElement(containerRef.current);
    setIsInitiallyReady(true);

    // Set up mutation observer for dynamic changes
    observerRef.current = new MutationObserver((mutations) => {
      // Only process if we're not currently highlighting
      if (isHighlightingRef.current) return;

      const hasRelevantChanges = mutations.some(mutation => {
        // Check for text content changes
        if (mutation.type === 'characterData') return true;

        // Check for added/removed nodes (but ignore our own <mark> elements)
        if (mutation.type === 'childList') {
          const hasNonMarkChanges = Array.from(mutation.addedNodes).some(node =>
            node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE && !(node as Element).matches('mark'))
          ) || Array.from(mutation.removedNodes).some(node =>
            node.nodeType === Node.TEXT_NODE ||
            (node.nodeType === Node.ELEMENT_NODE && !(node as Element).matches('mark'))
          );
          return hasNonMarkChanges;
        }

        return false;
      });

      if (hasRelevantChanges && containerRef.current) {
        // Small delay to batch multiple rapid changes
        setTimeout(() => {
          if (containerRef.current && !isHighlightingRef.current) {
            highlightTextInElement(containerRef.current);
          }
        }, 0);
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
  }, [highlightTextInElement]);

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
