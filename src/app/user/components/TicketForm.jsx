"use client";

import { useState } from "react";

export default function TicketForm({ setTickets }) {
  const [subject, setSubject] = useState("order");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create ticket");
      }

      const newTicket = await res.json();
      setTickets((prev) => [newTicket, ...prev]);
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl text-black">
      <h2 className="text-xl font-semibold mb-4">New Ticket</h2>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-2 mb-2 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitTicket} className="space-y-4">
        <div>
          <label className="text-black">Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          >
            <option value="order">Order</option>
            <option value="payment">Payment</option>
            <option value="complaint">Complaint & Suggestion</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div>
          <label className="text-black">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full p-2 border rounded bg-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center items-center p-2 rounded-xl text-white font-semibold transition ${
            success
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 hover:opacity-90"
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
            "Submitted!"
          ) : (
            "Submit Ticket"
          )}
        </button>
      </form>
    </div>
  );
}
