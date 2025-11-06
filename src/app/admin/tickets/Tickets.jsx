"use client";
import { useEffect, useState } from "react";

export default function     TicketsPage({tickets}) {
 
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");



  // 🔍 Search Filter (Fixed)
  useEffect(() => {
    if (!search) {
      setFilteredTickets(tickets);
      return;
    }

    const lower = search.toLowerCase();

    const filtered = tickets.filter((t) => {
      const fields = [
        t._id,
        t.email,
        t.subject,
        t.message,
        t.status,
        new Date(t.createdAt).toLocaleString(),
      ];
      return fields.some((field) =>
        String(field || "").toLowerCase().includes(lower)
      );
    });

    setFilteredTickets(filtered);
  }, [search, tickets]);


  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0f] text-red-400">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0f] text-gray-300 p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-400 mb-1">
          Support Tickets
        </h1>
        <p className="text-gray-400">
          Manage and respond to user support requests efficiently.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-lg">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151517] border border-yellow-500/20 text-gray-200 placeholder-gray-500 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 transition"
        />
      </div>

      {/* 🔥 Ticket Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTickets.length === 0 ? (
          <p className="text-gray-500 col-span-full">No tickets found.</p>
        ) : (
          filteredTickets.map((t) => (
            <div
              key={t._id}
              className="bg-[#151517]/80 border border-yellow-500/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(255,215,0,0.05)] hover:shadow-[0_0_25px_rgba(255,215,0,0.1)] transition duration-300 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-yellow-400 truncate">
                    Ticket #{t._id.slice(-6)}
                  </h2>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      t.status === "answered"
                        ? "bg-green-600/30 text-green-300 border border-green-500/30"
                        : t.status === "open"
                        ? "bg-red-600/30 text-red-300 border border-red-500/30"
                        : "bg-gray-600/30 text-gray-300 border border-gray-500/30"
                    }`}
                  >
                    {t.status || "unknown"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Created:{" "}
                  {t.createdAt
                    ? new Date(t.createdAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>

              {/* Info */}
              <div className="space-y-1 text-sm text-gray-300">
                {t.email && (
                  <p>
                    <span className="text-yellow-400 font-medium">Email:</span>{" "}
                    {t.email}
                  </p>
                )}
                {t.subject && (
                  <p>
                    <span className="text-yellow-400 font-medium">
                      Subject:
                    </span>{" "}
                    {t.subject}
                  </p>
                )}
                {t.message && (
                  <p className="text-gray-400 text-sm truncate">
                    <span className="text-yellow-400 font-medium">Message:</span>{" "}
                    {t.message}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-yellow-500/10">
                <p className="text-xs text-gray-500">
                  Replies: {(t.replies || []).length}
                </p>
                <button
                  className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40 px-3 py-1.5 rounded-lg font-medium transition"
                  onClick={() => setSelectedTicket(t)}
                >
                  Chat
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🟡 Chat Popup */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-[#151517] border border-yellow-500/20 w-full md:w-1/2 max-h-[80vh] rounded-t-2xl shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-yellow-500/20">
              <h2 className="text-xl font-semibold text-yellow-400">
                Ticket: {selectedTicket._id}
              </h2>
              <button
                className="text-gray-400 hover:text-yellow-400"
                onClick={() => setSelectedTicket(null)}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {(selectedTicket.replies || []).map((reply, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    reply.type === "admin"
                      ? "ml-auto bg-yellow-500/20 border border-yellow-500/30 text-yellow-200"
                      : "bg-[#1b1b1d] border border-yellow-500/10 text-gray-200"
                  }`}
                >
                  <p className="text-sm">{reply.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(reply.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-yellow-500/20 flex gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendReply();
                }}
              />
              <button
                onClick={() => sendReply()}
                className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/40 rounded-lg transition font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ✉️ Send reply
  async function sendReply() {
    const text = message.trim();
    if (!text) return;
    try {
      const res = await fetch("/api/admin/replyticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket._id,
          message: text,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const newReplies = [
          ...(selectedTicket.replies || []),
          data.reply,
        ];
        setSelectedTicket({
          ...selectedTicket,
          replies: newReplies,
          status: "answered",
        });
        setTickets((prev) =>
          prev.map((t) =>
            t._id === selectedTicket._id
              ? { ...t, status: "answered" }
              : t
          )
        );
        setMessage("");
      } else {
        alert(data.error || "Failed to send reply");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while replying");
    }
  }
}
