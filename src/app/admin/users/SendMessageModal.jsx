"use client";

import { useState, useEffect } from "react";

export default function SendMessageModal({
  onClose,
  users = [],
  onSent = () => {},
}) {
  const [mode, setMode] = useState("all"); // all | selected | single
  const [selectedIds, setSelectedIds] = useState([]); // for multiple
  const [singleEmail, setSingleEmail] = useState(""); // for single
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  // if users change, reset selections
  useEffect(() => {
    setSelectedIds([]);
    setSelectAll(false);
  }, [users]);

  const toggleId = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allIds = users.map((u) => String(u._id || u.id || u.email));
      setSelectedIds(allIds);
      setSelectAll(true);
    } else {
      setSelectedIds([]);
      setSelectAll(false);
    }
  };

  const validate = () => {
    if (!subject.trim()) {
      setResult({ error: "Please provide a subject." });
      return false;
    }
    if (!message.trim()) {
      setResult({ error: "Please provide a message body." });
      return false;
    }
    if (mode === "selected" && selectedIds.length === 0) {
      setResult({ error: "Select at least one recipient." });
      return false;
    }
    if (mode === "single" && !singleEmail.trim()) {
      setResult({ error: "Provide recipient email." });
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    setResult(null);

    try {
      const payload = { mode, subject, message };

      if (mode === "selected") payload.userIds = selectedIds;
      if (mode === "single") payload.email = singleEmail.trim();

      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ error: data?.message || "Failed to send messages." });
      } else {
        setResult({ success: data.message || "Sent." });
        onSent(data); // callback
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "Unexpected error while sending." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0b0f16] rounded-xl shadow-xl p-6 z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold">Send Message</h3>
          <button onClick={onClose} className="text-sm opacity-70">Close</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Mode</label>
            <div className="flex gap-3 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "all"}
                  onChange={() => setMode("all")}
                />
                <span>All users</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "selected"}
                  onChange={() => setMode("selected")}
                />
                <span>Selected users</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                />
                <span>Single user (email)</span>
              </label>
            </div>
          </div>

          {mode === "selected" && (
            <div className="border rounded p-3 max-h-48 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span className="text-sm">Select all ({users.length})</span>
                </div>
                <small className="text-xs text-gray-500">Click rows to toggle</small>
              </div>

              <div className="space-y-2">
                {users.length === 0 && (
                  <div className="text-sm text-gray-500">No users available</div>
                )}
                {users.map((u) => {
                  const uid = String(u._id ?? u.id ?? u.email);
                  const checked = selectedIds.includes(uid);
                  return (
                    <div
                      key={uid}
                      onClick={() => toggleId(uid)}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                        checked ? "bg-gray-100 dark:bg-white/5" : "hover:bg-gray-50 dark:hover:bg-white/3"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleId(uid)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{u.username || u.name || u.email}</div>
                        <div className="text-xs text-gray-500 break-words">{u.email}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "single" && (
            <div>
              <label className="block text-sm font-medium">Recipient Email</label>
              <input
                type="email"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 rounded border bg-white dark:bg-[#0b0f16]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#0b0f16]"
              placeholder="Subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#0b0f16]"
              placeholder="Write the message body (HTML or plain text allowed)"
            />
          </div>

          {result?.error && (
            <div className="text-sm text-red-500">{result.error}</div>
          )}
          {result?.success && (
            <div className="text-sm text-green-500">{result.success}</div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send"}
            </button>

            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
