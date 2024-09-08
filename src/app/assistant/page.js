'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

export default function AssistancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  const currentRequestId = useRef(null);
  const sessionId = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (status === "authenticated") {
      // Load chat history when component mounts and user is authenticated
      const loadChatHistory = async () => {
        try {
          const res = await fetch('/api/chat-history');
          if (res.ok) {
            const data = await res.json();
            setMessages(data.messages);
            sessionId.current = data.sessionId;
          } else {
            console.error('Failed to load chat history');
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      };
      loadChatHistory();
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !session) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId: sessionId.current }),
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      currentRequestId.current = res.headers.get('X-Request-ID');
      sessionId.current = res.headers.get('X-Session-ID');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage.content += chunk;

        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...assistantMessage }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'An error occurred while processing your request.' }
      ]);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      currentRequestId.current = null;
    }
  };

  const handleStop = async () => {
    if (currentRequestId.current) {
      try {
        await fetch('/api/ollama', {
          method: 'DELETE',
          headers: { 'X-Request-ID': currentRequestId.current },
        });
      } catch (error) {
        console.error('Error stopping generation:', error);
      }
    }
    setIsGenerating(false);
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen bg-gray-800 text-white">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="mb-6">Please login to chat with your personal mental well-being assistant.</p>
        <button
          onClick={() => signIn('google')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="flex-1 overflow-y-auto py-6">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                  <h1 className="text-3xl font-bold mb-4">VibeFlow Psychology Assistance</h1>
                  <p>How can I assist you today?</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]} 
                        className="markdown-content"
                        components={{
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2" {...props} />,
                          code: ({node, inline, ...props}) => 
                            inline ? (
                              <code className="bg-gray-800 px-1 rounded" {...props} />
                            ) : (
                              <code className="block bg-gray-800 p-2 rounded mb-2" {...props} />
                            ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 bg-gray-700 text-white rounded-l-lg focus:outline-none"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            {isGenerating ? (
              <button
                type="button"
                onClick={handleStop}
                className="p-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600 focus:outline-none"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none disabled:bg-gray-500"
              >
                {isLoading ? 'Thinking...' : 'Send'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}