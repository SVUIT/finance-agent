import { useState, ChangeEvent, FormEvent } from 'react';

interface ManualInputFormProps {
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const ManualInputForm = ({ onClose, onSendMessage }: ManualInputFormProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('VND');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'Incoming' | 'Outgoing'>('Outgoing');
  const [transferNote, setTransferNote] = useState('');
  const currencies = ['VND', '$', '€', '¥', '£', '₩'];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || !name) return;
    
    const transactionData = {
      name,
      amount: parseFloat(amount),
      currency,
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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tên người nhận/gửi</label>
        <input
          type="text"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
            className={`flex-1 px-4 py-2 rounded-xl ${
              transactionType === 'Incoming'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Incoming (Nhận tiền)
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('Outgoing')}
            className={`flex-1 px-4 py-2 rounded-xl ${
              transactionType === 'Outgoing'
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
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Đơn vị tiền tệ</label>
          <select
            value={currency}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nội dung chuyển tiền (tùy chọn)</label>
        <input
          type="text"
          value={transferNote}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTransferNote(e.target.value)}
          placeholder="Ví dụ: Business lunch, Mua sắm, Lương tháng..."
          className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ngày</label>
        <input
          type="date"
          value={date}
          onChange={handleChange}
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
  );
};

export { ManualInputForm };
export default ManualInputForm;
