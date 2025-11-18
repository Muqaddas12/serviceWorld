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
      setTicketList((prev) => [res.ticket, ...prev]);

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
    <div
      className="
        bg-white dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl 
        shadow-md dark:shadow-lg 
        overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center gap-2 
          bg-gray-200 dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          p-4 font-semibold text-lg
        "
      >
        <FaTicketAlt /> New Ticket
      </div>

      {/* Form Body */}
      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subject */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="
                w-full bg-gray-100 dark:bg-[#0E0F13] 
                text-gray-900 dark:text-gray-200
                border border-gray-300 dark:border-[#2B3143]
                rounded-lg p-3 
                focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                outline-none transition
              "
            >
              <option value="">Select subject</option>
              <option value="Order">Order</option>
              <option value="Payment">Payment</option>
              <option value="Complaint & Suggestion">Complaint & Suggestion</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Message
            </label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                w-full bg-gray-100 dark:bg-[#0E0F13] 
                text-gray-900 dark:text-gray-200
                border border-gray-300 dark:border-[#2B3143]
                rounded-lg p-3 
                focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                resize-none transition outline-none
              "
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full font-semibold py-3 rounded-xl transition
              text-white
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 shadow-md"
              }
            `}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
