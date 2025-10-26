"use client";

import { useState, useEffect, useRef } from "react";
import TicketForm from "../TicketForm";
import TicketHistory from "./TicketHistory";
import TicketPopup from "./TicketPopup";

export default function TicketSupport() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const repliesEndRef = useRef(null);

  const scrollToBottom = () => {
    repliesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setTimeout(scrollToBottom, 300);
  };

  const closeTicket = () => setSelectedTicket(null);

  const cardClasses =
    "bg-white rounded-2xl p-6 flex flex-col"; // removed shadows for cleaner look
  const buttonClasses =
    "bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition";

  return (
    <div className="flex flex-col bg-gray-200">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-center md:text-left p-6">
        Ticket Support
      </h1>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
        {/* Ticket Form */}
        <div className={`${cardClasses} md:w-1/2`}>
          <TicketForm setTickets={setTickets} buttonClasses={buttonClasses} />
        </div>

        {/* Ticket History */}
        <div className={`${cardClasses} md:w-1/2`}>
          <TicketHistory
            tickets={tickets}
            openTicket={openTicket}
            buttonClasses={buttonClasses}
          />
        </div>
      </div>

      {/* Ticket Popup */}
      {selectedTicket && (
        <div className={`${cardClasses} fixed inset-0 m-6 z-50 overflow-auto`}>
          <TicketPopup
            ticket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            setTickets={setTickets}
            closeTicket={closeTicket}
            scrollToBottom={scrollToBottom}
            repliesEndRef={repliesEndRef}
            buttonClasses={buttonClasses}
          />
        </div>
      )}
    </div>
  );
}
