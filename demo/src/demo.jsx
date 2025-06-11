// import TextHighlighter from 'react-highlight-me';
import TextHighlighter from '../../dist/esm/index';

// Demo component
const Demo = () => {
  const sampleText = "This is a sample text with React and JavaScript words to highlight.";
  const sampleComponent = (
    <div>
      <h3>Sample Component</h3>
      <p>This paragraph contains <strong>React</strong> and <em>JavaScript</em> terms.</p>
      <ul>
        <li>First item with React</li>
        <li>Second item with JavaScript</li>
      </ul>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '896px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
        Text Highlighter Component
      </h1>
      
      {/* Basic text highlighting */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Basic Text Highlighting
        </h2>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Original text:</p>
          <p style={{ marginBottom: '16px' }}>{sampleText}</p>
          
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Highlighted (single word):</p>
          <TextHighlighter 
            words={'React'}
            highlightStyle={{ backgroundColor: '#fef3c7', padding: '2px 4px', borderRadius: '3px', color: 'red' }}
          >
            {'react React ReactReact'}
          </TextHighlighter>
        </div>
      </div>

      {/* Multiple words highlighting */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Multiple Words
        </h2>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <TextHighlighter
            words={['React', 'JavaScript', 'text']}
            highlightStyle={{ backgroundColor: '#ddd6fe', padding: '2px 4px', borderRadius: '3px', fontWeight: 'bold' }}
          >
            {sampleText}
          </TextHighlighter>
        </div>
      </div>

      {/* Component highlighting */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Component Highlighting
        </h2>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>Original component:</p>
          <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            {sampleComponent}
          </div>

          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>With highlighting:</p>
          <div style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
            <TextHighlighter
              words={['React', 'JavaScript']}
              highlightStyle={{ backgroundColor: '#fca5a5', padding: '2px 4px', borderRadius: '3px' }}
            >
              {sampleComponent}
            </TextHighlighter>
          </div>
        </div>
      </div>

      {/* Different styles */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Different Styles
        </h2>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Yellow background:</p>
            <TextHighlighter
              words="sample"
              highlightStyle={{ backgroundColor: 'yellow' }}
            >
              {sampleText}
            </TextHighlighter>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Blue background with white text:</p>
            <TextHighlighter
              words="text"
              highlightStyle={{ backgroundColor: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px' }}
            >
              {sampleText}
            </TextHighlighter>
          </div>

          <div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Green border style:</p>
            <TextHighlighter
              words="words"
              highlightStyle={{
                backgroundColor: 'transparent',
                border: '2px solid #10b981',
                padding: '1px 4px',
                borderRadius: '4px',
                fontWeight: 'bold',
                color: '#059669'
              }}
            >
              {sampleText}
            </TextHighlighter>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>
          Props
        </h2>
        <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '8px' }}>
              <code style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px' }}>children</code> - React element or text to highlight
            </div>
            <div style={{ marginBottom: '8px' }}>
              <code style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px' }}>words</code> - String or array of strings to highlight
            </div>
            <div style={{ marginBottom: '8px' }}>
              <code style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px' }}>highlightStyle</code> - CSS style object for the mark element
            </div>
            <div>
              <code style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px' }}>caseSensitive</code> - Boolean for case-sensitive matching (default: false)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
