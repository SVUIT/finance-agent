import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your advanced AI assistant powered by cutting-edge technology. I'm here to help you with anything you need. What would you like to explore today?",
    isUser: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useChat = () => {
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

    // Simulate AI response with more sophisticated responses
    setTimeout(() => {
      const responses = [
        "That's a fascinating question! I've analyzed your request and here's my comprehensive response. Let me break this down for you in a way that's both informative and actionable.",
        "Excellent point! Based on the latest data and trends, I can provide you with some valuable insights that should help guide your decision-making process.",
        "I appreciate you bringing this up! This is actually a complex topic that deserves a thoughtful response. Let me share some key perspectives and recommendations.",
        "Great question! I've processed your request using advanced reasoning capabilities. Here's what I've found, along with some practical next steps you might consider.",
        "Thank you for that detailed question! I can see you're looking for a comprehensive answer. Let me provide you with a thorough analysis and some actionable recommendations.",
        "This is an interesting challenge! I've analyzed multiple approaches to this problem. Here's my recommended solution along with the reasoning behind it.",
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      }));
    }, 2000 + Math.random() * 1500);
  }, []);

  return {
    messages: chatState.messages,
    isTyping: chatState.isTyping,
    sendMessage,
  };
};