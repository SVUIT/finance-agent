import React from 'react';
import { Bot, MoreVertical, Zap, Shield, Sparkles, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ChatHeader: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-14 h-14 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/25 dark:shadow-violet-400/20 ring-2 ring-white/30 dark:ring-gray-700/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">Finance Agent</h3>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        
        <button
          onClick={toggleTheme}
          className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm group"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform duration-300" />
          )}
        </button>
          
        <button className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};