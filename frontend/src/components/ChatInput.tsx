import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { Send, Plus, Edit3 } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadFile?: (file: File) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = memo(
  ({ onSendMessage, onUploadFile, disabled = false }) => {
    const [message, setMessage] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const barRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
          onSendMessage(message.trim());
          setMessage("");
        }
      },
      [message, disabled, onSendMessage]
    );

    const handlePlusClick = useCallback(() => {
      setShowDropdown((s) => !s);
    }, []);

    const handleManualInput = useCallback(() => {
      setShowManualInput(true);
      setShowDropdown(false);
    }, []);

    const closeManualInput = useCallback(() => {
      setShowManualInput(false);
    }, []);

    useEffect(() => {
      const onDocClick = (ev: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(ev.target as Node)
        ) {
          setShowDropdown(false);
        }
      };
      if (showDropdown) document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [showDropdown]);

    useEffect(() => {
      const t = textareaRef.current;
      if (t) {
        t.style.height = "0px";
        t.style.height = `${t.scrollHeight}px`;
      }
    }, [message]);

    return (
      <div
        ref={barRef}
        className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 transition-colors duration-300 relative z-20"
      >
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
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999]">
                  <button
                    type="button"
                    onClick={handleManualInput}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3"
                  >
                    <Edit3 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      Nhập tay dữ liệu
                    </span>
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
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              disabled={disabled}
              className="w-full px-6 py-4 pr-16 bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
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

        {showManualInput && barRef.current && (
          <ManualInputPortal
            anchorEl={barRef.current}
            onClose={closeManualInput}
            onSendMessage={onSendMessage}
          />
        )}
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
export { ChatInput };

/* ---------- Bottom-sheet portal component ---------- */

interface ManualInputPortalProps {
  anchorEl: HTMLElement; // the chat bar element to measure
  onClose: () => void;
  onSendMessage: (msg: string) => void;
}

const ManualInputPortal: React.FC<ManualInputPortalProps> = ({
  anchorEl,
  onClose,
  onSendMessage,
}) => {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [bottomOffset, setBottomOffset] = useState<number>(20);
  const [maxH, setMaxH] = useState<number>(window.innerHeight * 0.8);

  useLayoutEffect(() => {
    const update = () => {
      const rect = anchorEl.getBoundingClientRect();
      // place sheet above the chat bar by the chat bar height + margin (12px)
      const offset = rect.height + 12;
      setBottomOffset(offset);
      // max height available for sheet
      const available = window.innerHeight - offset - 40; // keep some space at top
      setMaxH(Math.max(320, Math.min(available, window.innerHeight * 0.9)));
    };
    update();
    // re-run on resize (mobile keyboard triggers resize)
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [anchorEl]);

  // close when click overlay (but not when clicking inside sheet)
  const onOverlayDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const sheet = (
    <div
      className="fixed inset-0 z-[99999] flex items-end justify-center"
      onMouseDown={onOverlayDown}
      aria-hidden={false}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md mx-4 rounded-t-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl transform transition-transform duration-280 ease-out"
        style={{
          bottom: bottomOffset,
          position: "fixed",
          // animate from translateY(100%) -> translateY(0)
          transform: "translateY(0)",
          maxHeight: `${maxH}px`,
          overflow: "auto",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Nhập dữ liệu tài chính
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-gray-500 dark:text-gray-400">×</span>
            </button>
          </div>

          <ManualInputForm onClose={onClose} onSendMessage={onSendMessage} />
        </div>
      </div>

      <style>{`
        /* slide-up entrance */
        .transform { transform: translateY(8px); }
        .transform[style] { transform: translateY(0); } /* override after render */
        @media (prefers-reduced-motion: no-preference) {
          div[role="dialog"] {
            transition: transform 220ms cubic-bezier(.2,.9,.2,1), opacity 200ms;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  return createPortal(sheet, document.body);
};

/* ---------- ManualInputForm (same shape as before) ---------- */

interface ManualInputFormProps {
  onClose: () => void;
  onSendMessage: (msg: string) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({
  onClose,
  onSendMessage,
}) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("VND");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [transactionType, setTransactionType] = useState<
    "Incoming" | "Outgoing"
  >("Outgoing");
  const [transferNote, setTransferNote] = useState("");
  const currencies = ["VND", "$", "€", "¥", "£", "₩"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !name) return;
    const transactionData = {
      name,
      amount: parseFloat(amount),
      currency,
      created_at: new Date(date).toISOString(),
      transaction_type: transactionType,
      transfer_note: transferNote || "",
    };
    const message = `Thêm giao dịch:\n\`\`\`json\n${JSON.stringify(
      transactionData,
      null,
      2
    )}\n\`\`\``;
    onSendMessage(message);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tên người nhận/gửi
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Restaurant AAC, John Doe..."
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Loại giao dịch
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTransactionType("Incoming")}
            className={`flex-1 px-4 py-2 rounded-xl ${
              transactionType === "Incoming"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Incoming (Nhận tiền)
          </button>
          <button
            type="button"
            onClick={() => setTransactionType("Outgoing")}
            className={`flex-1 px-4 py-2 rounded-xl ${
              transactionType === "Outgoing"
                ? "bg-red-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Outgoing (Chuyển tiền)
          </button>
        </div>
      </div>

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
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nội dung chuyển tiền (tùy chọn)
        </label>
        <input
          type="text"
          value={transferNote}
          onChange={(e) => setTransferNote(e.target.value)}
          placeholder="Ví dụ: Business lunch, Mua sắm, Lương tháng..."
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ngày
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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
