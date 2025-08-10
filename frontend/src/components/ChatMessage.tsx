import React from 'react';
import { Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex gap-4 mb-8 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && (
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/25 dark:shadow-violet-400/20 ring-2 ring-white/20 dark:ring-gray-700/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Bot className="w-6 h-6 text-white" />
        </div>
      )}
      
      <div className={`max-w-sm lg:max-w-2xl ${isUser ? 'order-1' : 'order-2'} transform transition-all duration-500 group-hover:scale-[1.02]`}>
        <div
          className={`px-6 py-5 rounded-3xl backdrop-blur-xl border transition-all duration-500 relative overflow-hidden ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-400 dark:via-blue-500 dark:to-purple-500 text-white rounded-br-xl shadow-2xl shadow-blue-500/25 dark:shadow-blue-400/20 border-white/20 dark:border-blue-400/30'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 rounded-bl-xl shadow-2xl shadow-gray-500/10 dark:shadow-gray-900/20 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/95 dark:hover:bg-gray-800/95'
          }`}
        >
          {/* Animated background gradient for bot messages */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-blue-500/5 dark:from-violet-400/10 dark:via-purple-400/10 dark:to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          )}
          
          <div className="relative z-10">
            {!isUser && (
              <div className="flex items-center gap-2 mb-3 opacity-70">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold tracking-wide uppercase">AI Assistant</span>
              </div>
            )}
            <p className="text-sm leading-relaxed font-medium">{message}</p>
          </div>
        </div>
        
        {/* Message actions */}
        <div className={`flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span>{timestamp}</span>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <span>Just now</span>
          </div>
          
          {!isUser && (
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
                <ThumbsUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95">
                <ThumbsDown className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 dark:from-gray-500 dark:via-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-500/25 dark:shadow-gray-700/20 ring-2 ring-white/20 dark:ring-gray-600/30 backdrop-blur-sm order-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          <User className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
};