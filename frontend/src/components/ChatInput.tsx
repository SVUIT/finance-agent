import React, { useState } from 'react';
import { Send, Mic, Paperclip, Smile, Image, Code, Zap } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            className="w-11 h-11 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm group"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform duration-300" />
          </button>
          <button
            type="button"
            className="w-11 h-11 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm group"
          >
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button
            type="button"
            className="w-11 h-11 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm group"
          >
            <Code className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full px-6 py-4 pr-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:focus:ring-violet-400/50 focus:border-violet-300 dark:focus:border-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-gray-500/5 dark:shadow-gray-900/10 placeholder-gray-500 dark:placeholder-gray-400 font-medium text-gray-900 dark:text-gray-100"
            rows={1}
            style={{
              minHeight: '56px',
              maxHeight: '140px',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '56px';
              target.style.height = Math.min(target.scrollHeight, 140) + 'px';
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-3 bottom-3 w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 text-white rounded-2xl flex items-center justify-center hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 dark:hover:from-violet-500 dark:hover:via-purple-500 dark:hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl shadow-violet-500/25 dark:shadow-violet-400/20 disabled:hover:scale-100 group"
          >
            <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleRecording}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl group ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-500 shadow-red-500/25 dark:shadow-red-400/20 animate-pulse'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 hover:from-emerald-600 hover:to-teal-700 dark:hover:from-emerald-500 dark:hover:to-teal-600 shadow-emerald-500/25 dark:shadow-emerald-400/20'
          }`}
        >
          <Mic className={`w-5 h-5 text-white transition-transform duration-300 ${isRecording ? 'scale-110' : 'group-hover:scale-110'}`} />
        </button>
      </form>
      
      {/* Quick actions */}
      <div className="flex items-center justify-between mt-4 opacity-60 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200 font-medium">
            <Zap className="w-3 h-3" />
            Quick Reply
          </button>
          <button className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200 font-medium">
            <Smile className="w-3 h-3" />
            Suggestions
          </button>
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};