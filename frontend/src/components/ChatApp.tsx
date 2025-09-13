import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatContainer } from './ChatContainer';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

const ChatApp: React.FC = () => {
  const { messages, isTyping, sendMessage, uploadFile } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-600/20 dark:from-violet-300/30 dark:to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 dark:from-blue-300/30 dark:to-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/10 to-violet-600/10 dark:from-pink-300/20 dark:to-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="w-full max-w-6xl h-[800px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-gray-900/10 dark:shadow-black/20 overflow-hidden flex flex-col border border-white/30 dark:border-gray-700/30 relative z-10 transition-colors duration-500">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 dark:from-gray-800/40 dark:via-gray-800/20 dark:to-gray-800/10 pointer-events-none transition-colors duration-500" />
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-[2rem] shadow-inner shadow-violet-500/10 dark:shadow-violet-400/20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          <ChatHeader />
          <ChatContainer messages={messages} isTyping={isTyping} />
          <ChatInput onSendMessage={sendMessage} onUploadFile={uploadFile} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
