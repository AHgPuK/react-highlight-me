import React, { useCallback, useState } from 'react';

const InteractiveDemo = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
  const [newItem, setNewItem] = useState('');

  const addItem = useCallback(() => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  }, [items, newItem]);

  return (
    // Here key prop is required to force re-render when count changes
    // TextHighlighter changes the DOM structure dynamically, it would break reconciliation in DOM, so we need to force re-render
    <div
      key={count}
      style={{
      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '16px'
    }}>
      <h3 style={{ marginBottom: '16px' }}>Interactive React Component</h3>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>Counter: {count}</div>
        <button
          onClick={() => setCount(c => c + 1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          Increment
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div>
        <div style={{ marginBottom: '8px' }}>Dynamic List ({items.length} items):</div>
        <div style={{ marginBottom: '12px' }}>
          {items.map((item, index) => (
            <span
              key={index}
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 8px',
                borderRadius: '4px',
                marginRight: '8px',
                marginBottom: '4px',
                display: 'inline-block'
              }}
            >
              {item}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add new item..."
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              flex: 1
            }}
          />
          <button
            onClick={addItem}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
