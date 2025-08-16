import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile?: (file: File) => void; // 👈 new prop for handling uploads
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onUploadFile,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) {
      onUploadFile(file); // send file to parent
    }
    e.target.value = ''; // reset so same file can be re-selected
  };

  return (
    <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        
        {/* File Upload */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileClick}
            className="w-11 h-11 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm group"
          >
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:rotate-12 transition-transform duration-300" />
          </button>
        </div>

        {/* Message Input */}
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
      </form>
    </div>
  );
};
