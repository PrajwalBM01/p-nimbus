'use client';

import { useChat } from '@ai-sdk/react';
import { CodeExecutor } from 'react-exe';
import Markdown from 'react-markdown';
import { useTheme } from "./ThemeContext";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status, error, reload, data } = useChat();
  const { theme, setTheme } = useTheme();

  return (
    <div className='bg-backBackground h-screen p-2 flex justify-center items-center relative text-textColor'>
      <div className='h-full border border-borderColor w-full bg-background rounded-2xl overflow-auto'>
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
          {message.annotations && message.annotations.length>0 && 
          <div>
            {message.annotations.map((annotion, i) => {
              if (
                !annotion ||
                typeof annotion !== "object" ||
                Array.isArray(annotion) ||
                !("type" in annotion) ||
                !("value" in annotion)
              ) {
                return <div key={i}> no values </div>;
              }
              const codeString = annotion.value;
              if (typeof codeString !== "string") {
                return <div key={i}>invalid code</div>;
              }
              const cleanCode = codeString.replace(/^```tsx*\n?/, '').replace(/\n?```$/, '');
              console.log(codeString)
              console.log(cleanCode)
              console.log(typeof(cleanCode))
              return (
                  <CodeExecutor key={i} code={`${cleanCode}`} />
              );
            })}
            
          </div>
          }
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
          <textarea
            className="fixed field-sizing-content bottom-0 w-full max-w-2xl p-2 mb-8 border border-borderColor bg-background rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </form>
      </div>
      </div>
 </div>
    
  );
}