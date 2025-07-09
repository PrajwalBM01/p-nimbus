'use client';

import { useChat } from '@ai-sdk/react';
import Markdown from 'react-markdown';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload } = useChat();
  return (
    <div className="flex flex-col w-full max-w-2xl py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className={`${message.role === "user" && 'flex justify-end items-end text-end'} whitespace-pre-wrap`}>
          <div>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <Markdown key={`${message.id}-${i}`}>{part.text}</Markdown>;
              }
            })}
        </div>
        </div>
      ))}

      {(status === 'submitted' || status === 'streaming') && (
        <div className="text-center py-2 text-gray-500">
          Generating...
        </div>
      )}

      {error && (
        <div className="text-center py-2 text-red-500">
          An error occurred.
          <button type="button" onClick={() => reload()} className="ml-2 px-3 py-1 bg-red-600 text-white rounded">
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-2xl p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}