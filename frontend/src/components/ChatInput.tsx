import React, { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      alert("Only CSV files are allowed!");
      e.target.value = "";
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/categorize`, {
    method: "POST",
    body: formData,
    credentials: "include", 
});


      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("File upload failed!");
    } finally {
      e.target.value = ""; // reset input
    }
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
            accept=".csv"
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
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full px-6 py-4 pr-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl resize-none focus:outline-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-3 bottom-3 w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-white rounded-2xl flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
