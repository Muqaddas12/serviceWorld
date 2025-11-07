"use client";

import { useState, useEffect, useTransition } from "react";
import TicketChatModal from "./TicketChatModal";
import { replyToTicket, updateAdminReply } from "@/lib/adminServices";

export default function TicketsPage({ tickets }) {
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  // 🔍 Search tickets
  useEffect(() => {
    if (!search) {
      setFilteredTickets(tickets);
      return;
    }

    const lower = search.toLowerCase();
    const filtered = tickets.filter((t) =>
      [t._id, t.email, t.subject, t.message, t.status]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
    setFilteredTickets(filtered);
  }, [search, tickets]);

  // 📨 Send first reply (only once)
  const sendReply = async () => {
    if (!message.trim() || !selectedTicket) return;

    startTransition(async () => {
      const res = await replyToTicket({
        ticketId: selectedTicket._id,
        message,
      });

      if (res.error) return alert(res.error);

      // ✅ Update local state instantly
      const newReply = res.reply;

      setSelectedTicket((prev) => ({
        ...prev,
        replies: [...(prev.replies || []), newReply],
        status: "answered",
      }));

      setFilteredTickets((prev) =>
        prev.map((t) =>
          t._id === selectedTicket._id
            ? {
                ...t,
                replies: [...(t.replies || []), newReply],
                status: "answered",
              }
            : t
        )
      );

      setMessage("");
      alert("✅ Reply sent successfully!");
    });
  };

  // ✏️ Edit existing admin reply
  const updateReply = async (existingReply, newMessage) => {
    if (!newMessage.trim() || !selectedTicket) return;

    startTransition(async () => {
      const res = await updateAdminReply({
        ticketId: selectedTicket._id,
        newMessage,
      });

      if (res.error) return alert(res.error);

      // ✅ Update reply in state
      setSelectedTicket((prev) => ({
        ...prev,
        replies: prev.replies.map((r) =>
          r.type === "admin" ? { ...r, message: res.updatedMessage } : r
        ),
      }));

      setFilteredTickets((prev) =>
        prev.map((t) =>
          t._id === selectedTicket._id
            ? {
                ...t,
                replies: t.replies.map((r) =>
                  r.type === "admin"
                    ? { ...r, message: res.updatedMessage }
                    : r
                ),
              }
            : t
        )
      );

      alert("✅ Reply updated successfully!");
    });
  };

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

      {/* Ticket Grid */}
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
                <p>
                  <span className="text-yellow-400 font-medium">User:</span>{" "}
                  {t.username || "Unknown"}
                </p>
                <p>
                  <span className="text-yellow-400 font-medium">Subject:</span>{" "}
                  {t.subject}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  <span className="text-yellow-400 font-medium">Message:</span>{" "}
                  {t.message}
                </p>
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
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Modal (Reply / Edit) */}
      <TicketChatModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        message={message}
        setMessage={setMessage}
        onSend={sendReply}
        onUpdate={updateReply}
        isPending={isPending}
      />
    </div>
  );
}
