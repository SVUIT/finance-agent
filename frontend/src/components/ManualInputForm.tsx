import * as React from 'react';

interface ManualInputFormProps {
  onClose: () => void;
  onSendMessage: (message: string) => void;
}

const ManualInputForm = ({ onClose, onSendMessage }: ManualInputFormProps) => {
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('VND');
  const [date, setDateValue] = React.useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = React.useState<'Incoming' | 'Outgoing'>('Outgoing');
  const [transferNote, setTransferNote] = React.useState('');
  const currencies = ['VND', '$', '€', '¥', '£', '₩'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'date') setDateValue(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center">
      <div className="fixed top-3 left-1/2 -translate-x-1/2 w-full max-w-sm animate-slideUp">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-md shadow p-3 space-y-2 text-sm">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Nhập dữ liệu
          </h2>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Loại</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTransactionType('Incoming')}
                className={`flex-1 px-2 py-1 rounded text-xs ${
                  transactionType === 'Incoming'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Nhận
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('Outgoing')}
                className={`flex-1 px-2 py-1 rounded text-xs ${
                  transactionType === 'Outgoing'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Chuyển
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Số tiền</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Đơn vị</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nội dung</label>
            <input
              type="text"
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              className="w-full px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ngày</label>
            <input
              type="date"
              value={date}
              onChange={handleChange}
              className="w-full px-2 py-1 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!amount || !name}
              className="flex-1 px-2 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 disabled:opacity-50 text-xs"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ManualInputForm };
export default ManualInputForm;
