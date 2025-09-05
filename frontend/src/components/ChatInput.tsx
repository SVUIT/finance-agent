import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Plus, FileText, Edit3 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile?: (file: File) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onUploadFile,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      alert("Chỉ cho phép file CSV!");
      e.target.value = "";
      return;
    }

    if (onUploadFile) {
      onUploadFile(file);
    }
    
    e.target.value = ""; // reset input
  };

  const handlePlusClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCsvUpload = () => {
    fileInputRef.current?.click();
    setShowDropdown(false);
  };

  const handleManualInput = () => {
    setShowManualInput(true);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
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

  return (
    <div className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 transition-colors duration-300">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        
        {/* Action Buttons */}
        <div className="flex gap-2 relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          
          {/* Plus Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handlePlusClick}
              className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg shadow-violet-500/25 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-900/10 dark:shadow-black/20 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50 animate-dropdown">
                <button
                  type="button"
                  onClick={handleCsvUpload}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-200 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleManualInput}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-200 flex items-center gap-3 border-t border-gray-200/50 dark:border-gray-700/50"
                >
                  <Edit3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nhập tay dữ liệu</span>
                </button>
              </div>
            )}
          </div>

          {/* File Upload Button */}
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

      {/* Manual Input Modal */}
      {showManualInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/20 dark:shadow-black/40 border border-gray-200/50 dark:border-gray-700/50 w-full max-w-md animate-modal">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Nhập dữ liệu tài chính</h3>
                <button
                  onClick={() => setShowManualInput(false)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-gray-500 dark:text-gray-400">×</span>
                </button>
              </div>
              
              <ManualInputForm onClose={() => setShowManualInput(false)} onSendMessage={onSendMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Manual Input Form Component
interface ManualInputFormProps {
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onClose, onSendMessage }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'Incoming' | 'Outgoing'>('Outgoing');
  const [transferNote, setTransferNote] = useState('');

  const currencies = ['VND', '$', '€', '¥', '£', '₩'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) return;

    // Tạo JSON theo format mới
    const transactionData = {
      name: name,
      amount: parseFloat(amount),
      currency: currency,
      created_at: new Date(date).toISOString(),
      transaction_type: transactionType,
      transfer_note: transferNote || ""
    };

    const message = `Thêm giao dịch:\n\`\`\`json\n${JSON.stringify(transactionData, null, 2)}\n\`\`\``;
    onSendMessage(message);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tên người nhận/gửi
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Restaurant AAC, John Doe..."
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
          required
        />
      </div>

      {/* Transaction Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loại giao dịch
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTransactionType('Incoming')}
            className={`flex-1 px-4 py-2 rounded-xl transition-colors duration-200 ${
              transactionType === 'Incoming'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Incoming (Nhận tiền)
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('Outgoing')}
            className={`flex-1 px-4 py-2 rounded-xl transition-colors duration-200 ${
              transactionType === 'Outgoing'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Outgoing (Chuyển tiền)
          </button>
        </div>
      </div>

      {/* Amount and Currency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số tiền
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Đơn vị tiền tệ
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>{curr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transfer Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nội dung chuyển tiền (tùy chọn)
        </label>
        <input
          type="text"
          value={transferNote}
          onChange={(e) => setTransferNote(e.target.value)}
          placeholder="Ví dụ: Business lunch, Mua sắm, Lương tháng..."
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ngày
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors duration-200"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!amount || !name}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Thêm giao dịch
        </button>
      </div>
    </form>
  );
};
