# Simple React Chat App

A simple React chat application with a reusable Chat component that persists messages in the browser's localStorage.

## Features

- Simple, clean interface
- Message persistence using localStorage
- Reusable Chat component
- Auto-scrolling to the newest messages
- Timestamp display for each message

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Using the Chat Component in Other Projects

The `Chat` component is designed to be reusable in other React applications. Here's how to use it:

1. Copy the `Chat.tsx` and `Chat.css` files from the `src/components` directory to your project.
2. Import and use the component in your React application:

```tsx
import React from 'react';
import Chat from './path/to/components/Chat';

function App() {
  return (
    <div className="App">
      {/* You can customize the storage key to use different chat histories */}
      <Chat storageKey="my-custom-chat" />
    </div>
  );
}

export default App;
```

### Props

The Chat component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | string | 'chat-messages' | The key used to store messages in localStorage. Use different keys for different chat instances. |

## How It Works

- Messages are stored in the browser's localStorage
- Each message includes text content and a timestamp
- The component handles input, display, and persistence automatically
- The chat view scrolls to the newest message automatically

## License

MIT
