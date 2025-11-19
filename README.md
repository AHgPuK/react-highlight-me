# TextHighlighter

A flexible React component for highlighting specific words or phrases within text content or React components.

## Features

- 🎯 **Flexible Input**: Works with both plain text and React components
- 🔍 **Multiple Words**: Highlight single words, arrays of words, regex patterns, or arrays of regex patterns
- 🎨 **Custom Styling**: Fully customizable highlight styles
- 📝 **Case Sensitivity**: Optional case-sensitive or case-insensitive matching
- 🔧 **TypeScript Support**: Written in TypeScript with proper type definitions
- 🚀 **Zero Dependencies**: Uses only React built-in functionality
- 🌳 **Deep Processing**: Recursively processes nested React components

## Installation

| npm                              | yarn                          | pnpm *                        |
|----------------------------------|-------------------------------|-------------------------------|
| `npm install react-highlight-me` | `yarn add react-highlight-me` | `pnpm add react-highlight-me` |

*) pnpm is a preferable package manager for me at the moment.

## [Demo](https://ahgpuk.github.io/react-highlight-me/)


## Usage

### Basic Text Highlighting

```jsx
import TextHighlighter from 'react-highlight-me';

function App() {
  return (
    <TextHighlighter words="React">
      Hello React world!
    </TextHighlighter>
  );
}
```

### Multiple Words

```jsx
<TextHighlighter 
  words={['React', 'TypeScript', 'JavaScript']}
  highlightStyle={{ backgroundColor: '#fef3c7', padding: '2px 4px' }}
>
  Learning React and TypeScript for JavaScript development
</TextHighlighter>
```

### Component Highlighting

```jsx
<TextHighlighter 
  words={['important', 'notice']}
  highlightStyle={{ backgroundColor: '#fca5a5', fontWeight: 'bold' }}
>
  <div>
    <h2>Important Notice</h2>
    <p>This is an important message about our service.</p>
    <ul>
      <li>First important point</li>
      <li>Another notice for users</li>
    </ul>
  </div>
</TextHighlighter>
```

### Custom Styling

```jsx
// Yellow background with rounded corners
<TextHighlighter 
  words="highlight"
  highlightStyle={{ 
    backgroundColor: 'yellow',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold'
  }}
>
  Text to highlight here
</TextHighlighter>

// Blue background with white text
<TextHighlighter 
  words="special"
  highlightStyle={{ 
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '6px'
  }}
>
  This is special content
</TextHighlighter>

// Border style instead of background
<TextHighlighter 
  words="outlined"
  highlightStyle={{ 
    backgroundColor: 'transparent',
    border: '2px solid #10b981',
    padding: '1px 4px',
    borderRadius: '4px',
    color: '#059669',
    fontWeight: 'bold'
  }}
>
  Text with outlined highlights
</TextHighlighter>
```

### Case Sensitivity

```jsx
// Case-insensitive (default)
<TextHighlighter words="react">
  REACT and React and react will all be highlighted
</TextHighlighter>

// Case-sensitive
<TextHighlighter words="React" caseSensitive={true}>
  Only React will be highlighted, not REACT or react
</TextHighlighter>
```

### Gettting highlighted words

```jsx
import TextHighlighter from 'react-highlight-me';
function App() {
  const highlightedWords = ['React', 'JavaScript'];

  return (
    <>
      <TextHighlighter words={highlightedWords}>
        <div>
          React is a JavaScript library for building user interfaces.
        </div>
      </TextHighlighter>
      <div>
        <h2>Highlighted Words:</h2>
        <ul>
          {Array.from(document.querySelectorAll(TextHighlighter.MARKS_IN_SCOPE_SELECTOR)).map((mark, index) => (
            <li key={index}>{mark.textContent}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
```

## Props

| Prop              | Type                                       | Default                                             | Description                                |
|-------------------|--------------------------------------------|-----------------------------------------------------|--------------------------------------------|
| `children`        | `React.ReactElement \| null`               | `''`                                                | The content to process for highlighting    |
| `words`           | `string[] \| string \| RegExp \| RegExp[]` | `[]`                                                | Word or array of words to highlight        |
| `highlightStyle`  | `React.CSSProperties`                      | `{ backgroundColor: 'yellow', fontWeight: 'bold' }` | CSS styles to apply to highlighted text    |
| `caseSensitive`   | `boolean`                                  | `false`                                             | Whether to perform case-sensitive matching |
| `isWordBoundary`  | `boolean`                                  | `false`                                             | Match words only at word boundaries        |
| `escapeRegex`     | `RegExp`                                   | `/[.*+?^${}()\|[\]\\]/g`                            | Escape special regex characters            |

## Examples

### Search Results Highlighting

```jsx
function SearchResults({ results, searchTerm }) {
  return (
    <div>
      {results.map((result, index) => (
        <div key={index} className="search-result">
          <TextHighlighter 
            words={searchTerm}
            highlightStyle={{ backgroundColor: '#fbbf24' }}
          >
            <div>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </div>
          </TextHighlighter>
        </div>
      ))}
    </div>
  );
}
```

### Documentation Highlighting

```jsx
function Documentation({ content, keywords }) {
  return (
    <TextHighlighter 
      words={keywords}
      highlightStyle={{ 
        backgroundColor: '#ddd6fe',
        padding: '2px 4px',
        borderRadius: '3px',
        fontWeight: 'bold'
      }}
    >
      <article>
        <h1>API Documentation</h1>
        <p>{content}</p>
      </article>
    </TextHighlighter>
  );
}
```

### Multi-language Support

```jsx
function MultiLanguageHighlight() {
  return (
    <TextHighlighter 
      words={['JavaScript', 'React', 'TypeScript']}
      highlightStyle={{ backgroundColor: '#c7d2fe' }}
    >
      <div>
        <p>JavaScript is a programming language</p>
        <p>React est une bibliothèque JavaScript</p>
        <p>TypeScript adds static typing to JavaScript</p>
      </div>
    </TextHighlighter>
  );
}
```

## Technical Details

### How It Works

1. **Text Processing**: The component recursively traverses React elements and their children
2. **Pattern Matching**: Uses regular expressions to find and match specified words
3. **Safe Rendering**: Escapes regex special characters to prevent injection issues
4. **Element Cloning**: Preserves original component structure while adding highlights

### Performance Considerations

- The component processes content recursively, so very deep component trees may impact performance
- Regex compilation happens on each render - consider memoization for frequently changing props
- Large amounts of text with many highlight words may benefit from virtualization

### Browser Support

Works in all modern browsers that support:
- React 16.8+
- ES6 Regular Expressions
- Array methods (map, filter, some)

## Development & Debugging

This package includes TypeScript source files for easier debugging and development:
```typescript
// For production (compiled):
import { Highlighter } from 'react-highlight-me';

// For debugging (source):
import { Highlighter } from 'react-highlight-me/src';
```

Source maps are included to map compiled code back to TypeScript sources in your debugger.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the component.

## License

ISC License - see [LICENSE](LICENSE) file for details.
