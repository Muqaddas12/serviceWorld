"use client";

import { useState } from "react";
import { FaHistory, FaSearch, FaTimes } from "react-icons/fa";

export default function TicketHistory({ tickets = [], openTicket }) {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filteredTickets = tickets.filter((t) =>
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="
        bg-white dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl shadow-md dark:shadow-lg 
        overflow-hidden relative
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center gap-2 
          bg-gray-200 dark:bg-gray-700
          p-4 text-gray-900 dark:text-gray-100 
          font-semibold text-lg
        "
      >
        <FaHistory /> Ticket History
      </div>

      {/* Search */}
      <div
        className="
          p-4 flex items-center gap-3 
          border-b border-gray-300 dark:border-[#2B3143]
        "
      >
        <FaSearch className="text-gray-500 dark:text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full bg-transparent 
            outline-none 
            text-gray-800 dark:text-gray-200 
            text-sm placeholder-gray-500 dark:placeholder-gray-400
          "
        />
      </div>

      {/* Ticket List */}
      <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No tickets found.
          </p>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id || ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="
                p-4 border border-gray-300 dark:border-[#2B3143]
                rounded-xl 
                hover:bg-gray-100 dark:hover:bg-[#2B3143]/40
                cursor-pointer transition
                bg-gray-50 dark:bg-[#0E0F13]
              "
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                  {ticket.subject}
                </h3>

                {/* Gray Status Badge */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full
                    border text-gray-800 dark:text-gray-200
                    ${
                      ticket.status === "open"
                        ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500"
                        : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                    }
                  `}
                >
                  {ticket.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {ticket.message}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {new Date(ticket.created_at || ticket.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Popup Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="
              bg-white dark:bg-[#1A1F2B] 
              border border-gray-300 dark:border-[#2B3143]
              rounded-2xl w-full max-w-lg p-5 relative 
              max-h-[80vh] overflow-hidden 
              shadow-lg
            "
          >
            {/* Header */}
            <div
              className="
                flex justify-between items-center 
                border-b border-gray-300 dark:border-[#2B3143] 
                pb-3 mb-3
              "
            >
              <h2 className="text-gray-800 dark:text-gray-100 font-semibold">
                {selectedTicket.subject}
              </h2>
              <FaTimes
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setSelectedTicket(null)}
              />
            </div>

            {/* Chat Messages */}
            <div className="space-y-4 overflow-y-auto max-h-[55vh] pr-2">

              {/* User main message */}
              <div className="flex justify-start">
                <div
                  className="
                    bg-gray-100 dark:bg-[#0E0F13]
                    text-gray-900 dark:text-gray-200 
                    px-4 py-2 rounded-2xl rounded-tl-none 
                    max-w-[80%] border border-gray-300 dark:border-[#2B3143]
                  "
                >
                  <p>{selectedTicket.message}</p>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(selectedTicket.created_at).toLocaleString()} • User
                  </p>
                </div>
              </div>

              {/* Replies */}
              {selectedTicket.replies?.map((reply, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    reply.type === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      px-4 py-2 rounded-2xl max-w-[80%] border text-sm
                      ${
                        reply.type === "admin"
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 border-gray-400 dark:border-gray-500 rounded-tr-none"
                          : "bg-gray-100 dark:bg-[#0E0F13] text-gray-800 dark:text-gray-200 border-gray-300 dark:border-[#2B3143] rounded-tl-none"
                      }
                    `}
                  >
                    <p>{reply.message}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        reply.type === "admin"
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      {new Date(reply.created_at).toLocaleString()} •{" "}
                      {reply.type === "admin" ? "Admin" : "User"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
