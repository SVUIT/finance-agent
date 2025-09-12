import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';
import { apiRequestWithRetry } from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Xin chào! Tôi là trợ lý AI tài chính thông minh. Tôi có thể giúp bạn phân loại giao dịch tài chính từ file CSV. Hãy upload file CSV của bạn để bắt đầu!",
    isUser: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useChat = () => {
  const { token } = useAuth();
  const [chatState, setChatState] = useState<ChatState>({
    messages: initialMessages,
    isTyping: false,
  });

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      const result = await apiRequestWithRetry('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: text }),
      }, 2);

      if (result.success && result.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.data.reply || 'Tôi đã nhận được tin nhắn của bạn. Vui lòng upload file CSV để tôi có thể giúp bạn phân loại giao dịch.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false,
        }));
      } else {
        throw new Error(result.error || 'Lỗi kết nối đến server');
      }
    } catch (error) {
      console.error('Error sending message:', error);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, tôi không thể kết nối đến server lúc này. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    }
  }, [token]);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setChatState(prev => ({
      ...prev,
      isTyping: true,
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/categorize`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.status === 'successed' 
            ? `✅ File "${file.name}" đã được xử lý thành công! Tôi đã phân loại các giao dịch trong file của bạn.`
            : `❌ Có lỗi xảy ra khi xử lý file "${file.name}". Vui lòng thử lại.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false,
        }));
      } else {
        throw new Error('Lỗi xử lý file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `❌ Không thể xử lý file "${file.name}". Vui lòng kiểm tra định dạng file và thử lại.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    }
  }, [token]);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage,
    uploadFile,
  };
};
