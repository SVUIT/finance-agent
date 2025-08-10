import React from 'react';
import { Bot, Sparkles, Brain } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 mb-8 group animate-fade-in">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/25 dark:shadow-violet-400/20 ring-2 ring-white/20 dark:ring-gray-700/30 backdrop-blur-sm animate-pulse">
        <Bot className="w-6 h-6 text-white" />
      </div>
      
      <div className="max-w-sm lg:max-w-2xl">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl rounded-bl-xl px-6 py-5 shadow-2xl shadow-gray-500/10 dark:shadow-gray-900/20 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-blue-500/10 dark:from-violet-400/20 dark:via-purple-400/20 dark:to-blue-400/20 animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 opacity-70">
              <Brain className="w-4 h-4 animate-pulse text-violet-500 dark:text-violet-400" />
              <span className="text-xs font-bold tracking-wide uppercase text-gray-600 dark:text-gray-300">AI is thinking...</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-400 dark:from-violet-300 dark:to-purple-300 rounded-full animate-bounce shadow-lg"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 dark:from-purple-300 dark:to-blue-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.15s'}}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-300 dark:to-cyan-300 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.3s'}}></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 opacity-60">
          <Sparkles className="w-3 h-3 text-violet-500 dark:text-violet-400 animate-spin" />
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Processing your request...</span>
        </div>
      </div>
    </div>
  );
};