"use client";

import { useEffect, useState } from "react";

export default function TicketChatModal({
  ticket,
  onClose,
  message,
  setMessage,
  onSend,
  onUpdate,
  isPending,
}) {
  const [hasAdminReply, setHasAdminReply] = useState(false);
  const [existingReply, setExistingReply] = useState(null);

  useEffect(() => {
    if (ticket?.replies?.length > 0) {
      const adminReply = ticket.replies.find((r) => r.type === "admin");
      if (adminReply) {
        setHasAdminReply(true);
        setExistingReply(adminReply);
        setMessage(adminReply.message); // prefill for editing
      } else {
        setHasAdminReply(false);
        setExistingReply(null);
        setMessage("");
      }
    } else {
      setHasAdminReply(false);
      setExistingReply(null);
      setMessage("");
    }
  }, [ticket, setMessage]);

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-[#151517] border border-yellow-500/20 w-full md:w-1/2 max-h-[80vh] rounded-t-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/20">
          <h2 className="text-xl font-semibold text-yellow-400">
            Ticket: {ticket._id}
          </h2>
          <button
            className="text-gray-400 hover:text-yellow-400"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Replies (User Message + Admin Reply) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {/* 🧍 User Message */}
          <div className="p-3 rounded-lg max-w-[80%] bg-[#1b1b1d] border border-yellow-500/10 text-gray-200">
            <p className="text-sm">{ticket.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(ticket.created_at || ticket.createdAt).toLocaleString()}
            </p>
          </div>

          {/* 🧑‍💼 Admin Reply (if exists) */}
          {existingReply && (
            <div className="p-3 rounded-lg max-w-[80%] ml-auto bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
              <p className="text-sm">{existingReply.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(existingReply.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-yellow-500/20 flex flex-col gap-3 bg-[#0e0e0f]">
          <textarea
            rows="3"
            placeholder={
              hasAdminReply
                ? "Edit your previous reply..."
                : "Type your reply (only once)..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isPending}
            className={`flex-1 border border-yellow-500/20 rounded-lg px-3 py-2 bg-transparent text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 resize-none ${
              isPending ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600/30 text-gray-300 hover:bg-gray-500/40 transition"
            >
              Close
            </button>

            <button
              onClick={() =>
                hasAdminReply ? onUpdate(existingReply, message) : onSend()
              }
              disabled={isPending}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isPending
                  ? "bg-yellow-500/10 text-yellow-400 cursor-not-allowed"
                  : hasAdminReply
                  ? "bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border border-yellow-500/30"
                  : "bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/30"
              }`}
            >
              {isPending
                ? "Saving..."
                : hasAdminReply
                ? "Update Reply"
                : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
