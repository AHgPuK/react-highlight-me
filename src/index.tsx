import React, { useLayoutEffect, useRef, useCallback, useState, forwardRef, useMemo } from 'react';

type Props = {
  children?: React.ReactNode;
  words?: string[] | string | RegExp | RegExp[];
  highlightStyle?: React.CSSProperties;
  caseSensitive?: boolean;
  isWordBoundary?: boolean;
  isDebug?: boolean;
  escapeRegex?: RegExp;
}

const ROOT_ELEMENT_ID = 'react-highlight-me';
const ROOT_ELEMENT_ATTR = 'data-id';
const ROOT_ELEMENT_SELECTOR = `[${ROOT_ELEMENT_ATTR}="${ROOT_ELEMENT_ID}"]`;
const MARK_ATTRIBUTE = 'data-highlighter';
export const MARK_SELECTOR = `mark[${MARK_ATTRIBUTE}="true"]`;
export const MARKS_IN_SCOPE_SELECTOR = `:scope ${MARK_SELECTOR}:not(:scope ${ROOT_ELEMENT_SELECTOR} ${MARK_SELECTOR})`;

interface TextHighlighterComponent extends React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>> {
  MARKS_IN_SCOPE_SELECTOR: string;
  MARK_SELECTOR: string;
  ROOT_ELEMENT_SELECTOR: string;
}

const TextHighlighter = forwardRef<HTMLDivElement, Props>(({
  children,
  words = [],
  highlightStyle = { backgroundColor: 'yellow', fontWeight: 'bold' },
  caseSensitive = false,
  isWordBoundary = false,
  isDebug = false,
  escapeRegex = /[.*+?^${}()|[\]\\]/g,
}, ref) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const lastHighlightSignature = useRef<string>('');
  const [isInitiallyReady, setIsInitiallyReady] = useState(false);

  const currentProps = { words, highlightStyle, caseSensitive, isWordBoundary, escapeRegex };
  const propsRef = useRef(currentProps);
  propsRef.current = currentProps;

  const nodeFilter = useMemo(() => {
    return {
      acceptNode: (node: Node) => {
        if (!containerRef.current) return NodeFilter.FILTER_SKIP;

        return isInMyScope(containerRef.current, node, ROOT_ELEMENT_SELECTOR)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    }
  }, [containerRef?.current]);

  const getTextSignature = useCallback((element: HTMLElement): string => {
    // Create a signature of all text content to detect real changes
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      nodeFilter,
    );

    const textParts: string[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!(node as Text).parentElement?.hasAttribute(MARK_ATTRIBUTE)) {
        textParts.push((node as Text).textContent || '');
      }
    }

    return textParts.join('|');
  }, [nodeFilter]);

  const highlightTextInElement = useCallback((element: HTMLElement) => {
    const { words, highlightStyle, caseSensitive, isWordBoundary, escapeRegex } = propsRef.current;
    const wordsArray = Array.isArray(words) ? words : [words];

    isDebug && console.log('Highlighting with words:', wordsArray);

    // Remove existing highlights
    const existingMarks = element.querySelectorAll(TextHighlighter.MARKS_IN_SCOPE_SELECTOR);
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

    isDebug && console.log('Text signature:', getTextSignature(element));

    // Apply highlighting (same logic as before)
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      nodeFilter,
    );

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      if (!text) return;

      const pattern = wordsArray
      .filter(word => word)
      .map(word => {
        if (word instanceof RegExp) {
          return word.source;
        }
        let term = escapeRegex ? word.replace(escapeRegex, '\\$&') : word;
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
              ? part === word
              : part.toLowerCase() === word.toLowerCase();
          });

          if (shouldHighlight) {
            const mark = document.createElement('mark');
            mark.setAttribute(MARK_ATTRIBUTE, 'true');
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
    const currentRef = ref && 'current' in ref ? ref.current : containerRef.current;
    if (!currentRef) return;

    isDebug && console.log('Setting up persistent MutationObserver');

    highlightTextInElement(currentRef);
    setIsInitiallyReady(true);

    observerRef.current = new MutationObserver((mutations) => {
      if (!currentRef) return;

      const myMutations = mutations.filter((mutation) => {
        if (isInMyScope(currentRef, mutation.target, ROOT_ELEMENT_SELECTOR)) {
          // This mutation is in my scope - process it
          isDebug && console.log('Processing mutation in my scope:', currentRef.getAttribute(ROOT_ELEMENT_ATTR));
          return true;
        }
        // Otherwise ignore - it's either from outer scope or nested scope
        return false;
      });

      if (myMutations.length === 0) {
        isDebug && console.log('No relevant mutations in my scope, skipping');
        return;
      }

      // Check if the text signature has actually changed
      const currentSignature = getTextSignature(currentRef);

      if (currentSignature !== lastHighlightSignature.current) {
        isDebug && console.log('Text signature changed, re-highlighting');
        isDebug && console.log('Old:', lastHighlightSignature.current);
        isDebug && console.log('New:', currentSignature);

        highlightTextInElement(currentRef);
      } else {
        isDebug && console.log('Text signature unchanged, ignoring mutation');
      }
    });

    observerRef.current.observe(currentRef, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [words, highlightStyle, caseSensitive, isWordBoundary, highlightTextInElement, getTextSignature, ref, escapeRegex]);

  return (
    <div
      {...{ [ROOT_ELEMENT_ATTR]: ROOT_ELEMENT_ID }}
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      style={{
        visibility: isInitiallyReady ? 'visible' : 'hidden',
        minHeight: isInitiallyReady ? 'auto' : '1em',
        display: 'contents',
      }}
    >
      {children}
    </div>
  );
}) as TextHighlighterComponent;

TextHighlighter.MARK_SELECTOR = MARK_SELECTOR;
TextHighlighter.ROOT_ELEMENT_SELECTOR = ROOT_ELEMENT_SELECTOR;
TextHighlighter.MARKS_IN_SCOPE_SELECTOR = MARKS_IN_SCOPE_SELECTOR;

export default TextHighlighter;

function isInMyScope(rootElem: Element, target: Node, rootSelector: string): boolean {
  // Type guard: handle non-Element nodes
  const targetElement = target instanceof Element ? target : target.parentElement;
  if (!targetElement) {
    return false;
  }

  // First check if target is within my root
  if (!rootElem.contains(targetElement)) {
    return false;
  }

  // Select only direct nested roots using :scope
  const directNestedRootsSelector = `:scope ${rootSelector}:not(:scope ${rootSelector} ${rootSelector})`;
  const directNestedRoots = rootElem.querySelectorAll(directNestedRootsSelector);

  // Check if target is NOT within any direct nested root
  return !Array.from(directNestedRoots).some(nestedRoot =>
    nestedRoot.contains(targetElement)
  );
}