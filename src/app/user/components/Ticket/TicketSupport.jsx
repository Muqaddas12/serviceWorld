"use client";

import { useState, useEffect, useRef } from "react";
import { FaTicketAlt, FaHistory, FaSearch } from "react-icons/fa";

export default function TicketSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const repliesEndRef = useRef(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch {
      setTickets([]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) =>
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return alert("Please fill all fields");

    const newTicket = {
      id: Date.now(),
      subject,
      message,
      status: "open",
      created_at: new Date().toISOString(),
      replies: [],
    };
    setTickets((prev) => [newTicket, ...prev]);
    setSubject("");
    setMessage("");
  };

  const openTicket = (ticket) => setSelectedTicket(ticket);
  const closeTicket = () => setSelectedTicket(null);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="container mx-auto">
        {/* 🔍 Search Bar */}
        <div className="mb-6 bg-white rounded-2xl shadow p-4">
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 text-sm"
            />
          </div>
        </div>

        {/* 🎫 Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 📝 New Ticket Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white font-semibold text-lg">
              <FaTicketAlt /> New Ticket
            </div>
            <div className="p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
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
                  <label className="block text-gray-600 font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>

          {/* 📜 Ticket History */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white font-semibold text-lg">
              <FaHistory /> Ticket History
            </div>

            <div className="p-4 flex gap-2 mb-3">
              <button className="flex-1 bg-indigo-100 text-indigo-600 font-semibold rounded-lg py-2">
                All
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <p className="text-gray-400 text-center py-6">
                  No tickets found.
                </p>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => openTicket(ticket)}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-800 capitalize">
                        {ticket.subject}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          ticket.status === "open"
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {ticket.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 💬 Popup Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
                <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
                <button
                  onClick={closeTicket}
                  className="text-2xl font-bold hover:scale-110 transition-transform"
                >
                  &times;
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                <div className="bg-gray-100 p-3 rounded-xl shadow-sm">
                  <p className="text-gray-700">{selectedTicket.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>

                {selectedTicket.replies?.map((r, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl shadow-sm ${
                      r.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white ml-auto"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{r.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        r.sender === "user"
                          ? "text-indigo-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div ref={repliesEndRef} />
              </div>

              <div className="p-4 border-t flex gap-2 bg-gray-50">
                <input
                  type="text"
                  placeholder="Type a reply..."
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
                />
                <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
