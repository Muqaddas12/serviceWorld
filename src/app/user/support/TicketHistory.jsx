"use client";

import { useState } from "react";
import { FaHistory, FaSearch } from "react-icons/fa";

export default function TicketHistory({ tickets = [], openTicket }) {
  const [search, setSearch] = useState("");

  const filteredTickets = tickets.filter((t) =>
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#161617]/90 border border-yellow-500/20 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.15)] overflow-hidden">
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-black font-semibold text-lg">
        <FaHistory /> Ticket History
      </div>

      {/* Search Bar */}
      <div className="p-4 flex items-center gap-3 border-b border-yellow-500/20">
        <FaSearch className="text-yellow-500 text-lg" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none text-gray-100 text-sm placeholder-gray-400"
        />
      </div>

      {/* Ticket List */}
      <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tickets found.</p>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id || ticket.id}
              onClick={() => openTicket(ticket)}
              className="p-4 border border-yellow-500/30 rounded-xl hover:border-yellow-500/60 hover:shadow-[0_0_10px_rgba(250,204,21,0.2)] transition cursor-pointer bg-[#0e0e0f]"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-100 capitalize">
                  {ticket.subject}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    ticket.status === "open"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30"
                      : "bg-green-500/20 text-green-400 border border-green-400/30"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">
                {ticket.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(ticket.created_at || ticket.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
