import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

interface SettingsData {
  email: string
  name: string
  emailNotifications: boolean
  weeklyReports: boolean
  monthlyReports: boolean
}

const Settings: React.FC = () => {
  const { user, token, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SettingsData>({
    email: user?.email || "",
    name: user?.name || "",
    emailNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [open, setOpen] = useState(false)

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

  useEffect(() => {
    if (!token) return
    fetch(`${API}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setSettings((p) => ({ ...p, ...d })))
      .catch(() => {})
  }, [token])

  const save = async () => {
    if (!token) return
    setLoading(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/settings`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      const d = await r.json()
      if (r.ok) {
        setMsg({ type: "success", text: "Cài đặt đã lưu" })
        await refreshUser()
      } else setMsg({ type: "error", text: d.message || "Lỗi lưu" })
    } catch {
      setMsg({ type: "error", text: "Lỗi kết nối" })
    } finally {
      setLoading(false)
    }
  }

  const sendTest = async () => {
    if (!token) return
    setLoading(true)
    setMsg(null)
    try {
      const r = await fetch(`${API}/settings/send-test-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      const d = await r.json()
      if (r.ok) setMsg({ type: "success", text: "Đã gửi email thử nghiệm" })
      else setMsg({ type: "error", text: d.message || "Lỗi gửi" })
    } catch {
      setMsg({ type: "error", text: "Lỗi kết nối" })
    } finally {
      setLoading(false)
    }
  }

  const change = (k: keyof SettingsData, v: string | boolean) =>
    setSettings((p) => ({ ...p, [k]: v }))

  return (
    <div className="p-6 max-w-xl mx-auto relative">
      <button onClick={() => setOpen((o) => !o)} className="absolute top-2 right-2">
        ⚙️
      </button>
      {open && (
        <div className="absolute top-12 right-2 bg-gray-900 text-white rounded-lg shadow-lg p-3 z-50 w-48 border border-gray-700">
          <button
            onClick={() => navigate("/")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
          >
            Cài đặt
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-800 rounded"
          >
            Đăng xuất
          </button>
        </div>
      )}
      {msg && <div className={msg.type === "success" ? "text-green-600" : "text-red-600"}>{msg.text}</div>}
      <div className="flex flex-col gap-2 my-4">
        <input
          value={settings.name}
          onChange={(e) => change("name", e.target.value)}
          placeholder="Tên"
          className="border rounded p-2"
        />
        <input
          value={settings.email}
          onChange={(e) => change("email", e.target.value)}
          placeholder="Email"
          className="border rounded p-2"
        />
      </div>
      <label className="block">
        <input
          type="checkbox"
          checked={settings.emailNotifications}
          onChange={(e) => change("emailNotifications", e.target.checked)}
        />{" "}
        Thông báo email
      </label>
      <label className="block">
        <input
          type="checkbox"
          checked={settings.weeklyReports}
          onChange={(e) => change("weeklyReports", e.target.checked)}
        />{" "}
        Báo cáo tuần
      </label>
      <label className="block">
        <input
          type="checkbox"
          checked={settings.monthlyReports}
          onChange={(e) => change("monthlyReports", e.target.checked)}
        />{" "}
        Báo cáo tháng
      </label>
      <div className="flex gap-3 mt-4">
        <button
          onClick={sendTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "..." : "Gửi email thử"}
        </button>
        <button
          onClick={save}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "..." : "Lưu"}
        </button>
      </div>
    </div>
  )
}

export default Settings
