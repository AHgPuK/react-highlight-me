import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';

import TextHighlighter from '../../src/index';

import SearchNavigator from './components/SearchNavigator';
import BlogPost from './components/BlogPost';
import CodeExample from './components/CodeExample';
import NewsCard from './components/NewsCard';
import InteractiveDemo from './components/InteractiveDemo';


// Main Demo Component
const Demo = () => {
  const [inputWords, setInputWords] = useState('React, JavaScript, TypeScript');
  const [highlightStyle, setHighlightStyle] = useState({
    backgroundColor: '#ffeb3b',
    color: '#000',
    padding: '2px 4px',
    borderRadius: '3px',
    fontWeight: 'bold'
  });
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [isWordBoundary, setIsWordBoundary] = useState(true);
  const [isDebug, setIsDebug] = useState(false);
  const [activePreset, setActivePreset] = useState('default');

  const contentRef = useRef(null);

  // Parse words from input (handles strings and regex)
  const parseWords = (input) => {
    if (!input.trim()) return [];

    return input.split(',').map(word => {
      const trimmed = word.trim();
      // Check if it's a regex pattern
      if (trimmed.startsWith('/') && trimmed.endsWith('/')) {
        try {
          return new RegExp(trimmed.slice(1, -1), 'g');
        } catch {
          return trimmed;
        }
      }
      return trimmed;
    }).filter(Boolean);
  };

  const words = parseWords(inputWords);

  const presets = {
    default: {
      style: { backgroundColor: '#ffeb3b', color: '#000', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' },
      words: 'React, JavaScript, TypeScript'
    },
    error: {
      style: {
        backgroundColor: '#ff5252',
        color: 'white',
        padding: '3px 6px',
        borderRadius: '4px',
        fontWeight: 'bold',
        textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
      },
      words: 'error, bug, issue, problem'
    },
    success: {
      style: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '20px',
        fontWeight: 'normal',
        border: '2px solid #388e3c'
      },
      words: 'success, complete, done, finished'
    },
    tech: {
      style: {
        backgroundColor: 'transparent',
        color: '#1976d2',
        padding: '1px 4px',
        borderRadius: '4px',
        border: '2px solid #1976d2',
        fontWeight: 'bold'
      },
      words: 'React, Vue, Angular, Node, Express'
    },
    regex: {
      style: {
        backgroundColor: '#9c27b0',
        color: 'white',
        padding: '2px 4px',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '14px'
      },
      words: '/\\d+/, /[A-Z]{2,}/, /\\b\\w{8,}\\b/'
    }
  };

  const applyPreset = (presetName) => {
    const preset = presets[presetName];
    setHighlightStyle(preset.style);
    setInputWords(preset.words);
    setActivePreset(presetName);
  };

  const styleOptions = [
    { label: 'Background Color', key: 'backgroundColor', type: 'color' },
    { label: 'Text Color', key: 'color', type: 'color' },
    { label: 'Padding', key: 'padding', type: 'text' },
    { label: 'Border Radius', key: 'borderRadius', type: 'text' },
    { label: 'Font Weight', key: 'fontWeight', type: 'select', options: ['normal', 'bold', '500', '600', '700'] }
  ];

  return (
    <div style={{
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      height: '100vh',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{
          width: '100%',
          // borderRadius: '16px',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          backgroundColor: 'wheat',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 0,
        }}>
          <h1 style={{
            textAlign: 'center',
            margin: '15px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '2.5rem',
            fontWeight: 'bold',
          }}>
            ✨ TextHighlighter Demo
          </h1>

          {/* Search */}
          <div style={{
            marginBottom: '16px',
          }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
              🔍 Search & Navigate:
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <SearchNavigator
                containerRef={contentRef}
                searchTerm={inputWords}
                highlightStyle={highlightStyle}
              />
            </div>
          </div>
        </div>

        <div style={{
          minHeight: 0,
          height: '100%',
          overflow: 'auto',
          flex: 1,
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}>
          {/* Control Panel */}
          <div style={{
            background: '#f8f9fa',
            padding: '0 24px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #e9ecef',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#495057' }}>🎛️ Controls</h2>

            {/* Words Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                Highlight Words (comma-separated, supports regex like /\\d+/):
              </label>
              <input
                type="text"
                value={inputWords}
                onChange={(e) => setInputWords(e.target.value)}
                placeholder="React, JavaScript, /\\d+/, TypeScript"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #dee2e6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
              />
              <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                Current: {words.length} term{words.length !== 1 ? 's' : ''} ({words.map(w => w instanceof RegExp ? `/${w.source}/` : w).join(', ')})
              </div>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                🎨 Style Presets:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.keys(presets).map(preset => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    style={{
                      padding: '8px 16px',
                      border: `2px solid ${activePreset === preset ? '#667eea' : '#dee2e6'}`,
                      borderRadius: '20px',
                      background: activePreset === preset ? '#667eea' : 'white',
                      color: activePreset === preset ? 'white' : '#495057',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: 'bold', color: '#495057' }}>Case Sensitive</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isWordBoundary}
                  onChange={(e) => setIsWordBoundary(e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: 'bold', color: '#495057' }}>Word Boundary</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDebug}
                  onChange={(e) => setIsDebug(e.target.checked)}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span style={{ fontWeight: 'bold', color: '#495057' }}>Debug Mode</span>
              </label>
            </div>

            {/* Style Customization */}
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: '#495057' }}>
                🎨 Custom Styling:
              </label>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {styleOptions.map(option => (
                  <div key={option.key}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                      {option.label}:
                    </label>
                    {option.type === 'color' ? (
                      <input
                        type="color"
                        value={highlightStyle[option.key] || '#ffeb3b'}
                        onChange={(e) => setHighlightStyle(prev => ({
                          ...prev,
                          [option.key]: e.target.value
                        }))}
                        style={{ width: '100%', height: '32px', border: 'none', borderRadius: '4px' }}
                      />
                    ) : option.type === 'select' ? (
                      <select
                        value={highlightStyle[option.key] || ''}
                        onChange={(e) => setHighlightStyle(prev => ({
                          ...prev,
                          [option.key]: e.target.value
                        }))}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px'
                        }}
                      >
                        {option.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={highlightStyle[option.key] || ''}
                        onChange={(e) => setHighlightStyle(prev => ({
                          ...prev,
                          [option.key]: e.target.value
                        }))}
                        placeholder={option.key}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #dee2e6',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div ref={contentRef} style={{ position: 'relative' }}>
            <h2 style={{ marginBottom: '20px', color: '#495057' }}>📄 Sample Content</h2>

            <TextHighlighter
              words={words}
              highlightStyle={highlightStyle}
              caseSensitive={caseSensitive}
              isWordBoundary={isWordBoundary}
              isDebug={isDebug}
            >
              <BlogPost/>

              <div style={{
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

              <CodeExample/>

              <InteractiveDemo/>

              <div style={{
                background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <h3 style={{ color: '#2d3748', marginBottom: '12px' }}>🔍 RegEx Pattern Examples</h3>
                <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
                  <p>Test these patterns: Email addresses like user@example.com, phone numbers like 555-123-4567,
                    dates like 2024-12-15, URLs like https://example.com, and various numbers like 42, 3.14159, or
                    100%.</p>
                  <p>JavaScript variables: const myVariable = 'value'; let counter = 0; var oldStyle = true;</p>
                  <p>CSS properties: background-color: #ff6b6b; margin: 10px; padding: 5px 10px;</p>
                </div>
              </div>

              <div style={{
                background: 'white',
                border: '2px dashed #e2e8f0',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                <h4 style={{ color: '#718096', marginBottom: '8px' }}>Dynamic Content Area</h4>
                <p style={{ color: '#a0aec0', fontSize: '14px' }}>
                  Type new words above to see real-time highlighting. Try regex patterns like /\d+/ for numbers,
                  /[A-Z]&#123;2,&#125;/ for uppercase sequences, or /\b\w&#123;8,&#125;\b/ for long words.
                </p>
                <div style={{
                  background: '#f7fafc',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '12px',
                  fontSize: '13px',
                  color: '#4a5568'
                }}>
                  <strong>Quick Test:</strong> React components use TypeScript for type safety.
                  The useState hook manages state in functional components. Error handling
                  prevents bugs and improves user experience. Success metrics help measure
                  application performance and user satisfaction.
                </div>
              </div>

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
            </TextHighlighter>
          </div>

          {/* Statistics */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '16px' }}>📊 Highlighting Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{words.length}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Words</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {words.filter(w => w instanceof RegExp).length}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>RegEx Patterns</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {caseSensitive ? 'ON' : 'OFF'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Case Sensitive</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {isWordBoundary ? 'ON' : 'OFF'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Word Boundary</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '24px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#495057', marginBottom: '12px' }}>🚀 How to Use</h3>
            <ul style={{ color: '#6c757d', lineHeight: '1.6', paddingLeft: '20px' }}>
              <li><strong>Words:</strong> Enter comma-separated words or regex patterns (e.g., /\d+/ for numbers)</li>
              <li><strong>Search:</strong> Use the search box to find and navigate through specific terms</li>
              <li><strong>Presets:</strong> Try different style presets for various highlighting themes</li>
              <li><strong>Options:</strong> Toggle case sensitivity and word boundary matching</li>
              <li><strong>Styling:</strong> Customize colors, padding, borders, and fonts in real-time</li>
              <li><strong>Interactive:</strong> Click buttons and type in the interactive demo to see dynamic
                highlighting
              </li>
            </ul>
          </div>

          {/* Debug Info */}
          {isDebug && (
            <div style={{
              background: '#1a202c',
              color: '#e2e8f0',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '12px'
            }}>
              <div style={{ color: '#68d391', marginBottom: '8px' }}>🐛 Debug Information</div>
              <div>Active Words: {JSON.stringify(words.map(w => w instanceof RegExp ? `/${w.source}/` : w))}</div>
              <div>Current Style: {JSON.stringify(highlightStyle, null, 2)}</div>
              <div>Options: Case Sensitive: {caseSensitive}, Word Boundary: {isWordBoundary}</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Demo;
