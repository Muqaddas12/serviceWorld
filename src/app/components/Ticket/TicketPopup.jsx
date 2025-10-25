"use client";

import { useState } from "react";

export default function TicketPopup({
  ticket,
  setSelectedTicket,
  setTickets,
  closeTicket,
  scrollToBottom,
  repliesEndRef,
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // local error
  const [success, setSuccess] = useState(false); // success animation

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/tickets/${ticket._id || ticket.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send reply");
      }

      const updatedTicket = await res.json();
      setSelectedTicket(updatedTicket);
      setTickets((prev) =>
        prev.map((t) =>
          (t._id || t.id) === (updatedTicket._id || updatedTicket.id)
            ? updatedTicket
            : t
        )
      );

      setReplyMessage("");
      scrollToBottom();
      setSuccess(true); // trigger success animation
      setTimeout(() => setSuccess(false), 1500); // hide after 1.5s
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col text-white border border-gray-700">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{ticket.subject}</h2>
          <button
            onClick={closeTicket}
            className="text-white text-2xl font-bold hover:text-red-400"
          >
            &times;
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-2 text-sm text-center">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="bg-gray-700 p-3 rounded self-start max-w-[80%]">
            <p>{ticket.message}</p>
            <p className="text-xs text-gray-400 mt-1">{ticket.created_at}</p>
          </div>

          {ticket.replies?.map((r, i) => (
            <div
              key={i}
              className={`p-3 rounded max-w-[80%] ${
                r.sender === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-600 text-white self-start"
              }`}
            >
              <p>{r.message}</p>
              <p className="text-xs text-gray-300 mt-1">{r.created_at}</p>
            </div>
          ))}

          <div ref={repliesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="flex-1 p-2 border rounded bg-black text-white"
            disabled={loading}
          />
          <button
            onClick={handleSendReply}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center ${
              success ? "bg-green-500 hover:bg-green-600" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : success ? (
              "Sent!"
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
