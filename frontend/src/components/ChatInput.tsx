import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Send, Plus, Edit3 } from 'lucide-react';
import { ManualInputForm } from './ManualInputForm';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile: (file: File) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = memo(({ 
  onSendMessage, 
  onUploadFile,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  }, [message, disabled, onSendMessage]);

  const handlePlusClick = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  const handleManualInput = useCallback(() => {
    setShowManualInput(true);
    setShowDropdown(false);
  }, []);

  const closeManualInput = useCallback(() => {
    setShowManualInput(false);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        <div className="flex gap-2 relative">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handlePlusClick}
              className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-violet-500/25 group"
              aria-label="Show options"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            {showDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-900/10 dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50 animate-dropdown">
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-200 flex items-center gap-3"
                >
                  <Edit3 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">Nhập tay dữ liệu</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full px-6 py-4 pr-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-200"
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-3 bottom-3 w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity duration-200"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showManualInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/20 dark:shadow-black/40 border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md animate-modal">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Nhập dữ liệu tài chính</h3>
                <button
                  onClick={closeManualInput}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Close dialog"
                >
                  <span className="text-gray-500 dark:text-gray-400">×</span>
                </button>
              </div>
              <ManualInputForm onClose={closeManualInput} onSendMessage={onSendMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ChatInput.displayName = 'ChatInput';

export { ChatInput };

interface ManualInputFormProps {
  onClose: () => void
  onSendMessage: (message: string) => void
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onClose, onSendMessage }) => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('VND')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [transactionType, setTransactionType] = useState<'Incoming' | 'Outgoing'>('Outgoing')
  const [transferNote, setTransferNote] = useState('')
  const currencies = ['VND', '$', '€', '¥', '£', '₩']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !name) return
    const transactionData = {
      name,
      amount: parseFloat(amount),
      currency,
      created_at: new Date(date).toISOString(),
      transaction_type: transactionType,
      transfer_note: transferNote || ""
    }
    const message = `Thêm giao dịch:\n\`\`\`json\n${JSON.stringify(transactionData, null, 2)}\n\`\`\``
    onSendMessage(message)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên người nhận/gửi</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Restaurant AAC, John Doe..."
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Loại giao dịch</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTransactionType('Incoming')}
            className={`flex-1 px-4 py-2 rounded-xl ${transactionType === 'Incoming'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Incoming (Nhận tiền)
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('Outgoing')}
            className={`flex-1 px-4 py-2 rounded-xl ${transactionType === 'Outgoing'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Outgoing (Chuyển tiền)
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Số tiền</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Đơn vị tiền tệ</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nội dung chuyển tiền (tùy chọn)</label>
        <input
          type="text"
          value={transferNote}
          onChange={(e) => setTransferNote(e.target.value)}
          placeholder="Ví dụ: Business lunch, Mua sắm, Lương tháng..."
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ngày</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!amount || !name}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm giao dịch
        </button>
      </div>
    </form>
  )
}
