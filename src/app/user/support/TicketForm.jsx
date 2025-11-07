"use client";

import { useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { createTicket } from "@/lib/adminServices";

export default function TicketForm({ setTicketList }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      return alert("⚠️ Please fill all fields before submitting.");
    }

    try {
      setLoading(true);
      const res = await createTicket({ subject, message });

      if (res.error) {
        alert("❌ " + res.error);
        return;
      }

      alert("✅ " + res.message);

      // ✅ Add to ticket list instantly
      setTicketList((prev) => [res.ticket, ...prev]);

      // Clear form
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#161617]/90 border border-yellow-500/20 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.15)] overflow-hidden">
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-black font-semibold text-lg">
        <FaTicketAlt /> New Ticket
      </div>

      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-yellow-500/30 bg-[#0e0e0f] text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select subject</option>
              <option value="Order">Order</option>
              <option value="Payment">Payment</option>
              <option value="Complaint & Suggestion">
                Complaint & Suggestion
              </option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-yellow-500/30 bg-[#0e0e0f] text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-xl transition ${
              loading
                ? "bg-yellow-500/40 cursor-not-allowed text-black"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]"
            }`}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
