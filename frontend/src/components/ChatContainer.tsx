import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/chat';
import { Sparkles, Zap } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 relative transition-colors duration-300">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 0), radial-gradient(circle at 75px 75px, #8b5cf6 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-purple-600/10 dark:from-violet-300/20 dark:to-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 dark:from-blue-300/20 dark:to-cyan-500/20 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-violet-600/10 dark:from-pink-300/20 dark:to-violet-500/20 rounded-full blur-3xl animate-float-slow"></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-5xl mx-auto">
          {messages.length === 1 && (
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-8 py-4 rounded-3xl shadow-xl shadow-gray-500/10 dark:shadow-gray-900/20 border border-gray-200/50 dark:border-gray-700/50 mb-6 transition-colors duration-300">
                <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 tracking-wide">Chat Session Started</span>
                <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400 animate-pulse" />
              </div>
              
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  <span className="font-medium">Ultra-fast responses</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">AI-powered assistance</span>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={message.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ChatMessage
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};