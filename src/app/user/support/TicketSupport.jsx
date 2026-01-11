"use client";

import { useState, useRef } from "react";
import TicketForm from "./TicketForm";
import TicketHistory from "./TicketHistory";

export default function TicketSupport({ tickets = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketList, setTicketList] = useState(tickets);
  const repliesEndRef = useRef(null);

  const openTicket = (ticket) => setSelectedTicket(ticket);
  const closeTicket = () => setSelectedTicket(null);

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center bg-gray-100 dark:bg-[#0F1117] text-gray-900 dark:text-gray-200">
<div
  className="
    flex flex-col
    items-center
    text-center
    gap-2
    p-4
  "
>
  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
    Need more help or facing an urgent issue?
  </p>

  <p className="text-sm text-gray-700 dark:text-gray-300">
    Our support team is available to assist you with orders, payments,
    technical issues, or account-related queries.
  </p>

  <p className="text-xs text-gray-600 dark:text-gray-400">
    Please include your <span className="font-medium">Order ID</span> or
    <span className="font-medium"> Ticket ID</span> for faster resolution.
  </p>

  <a
    href="mailto:support@instantsmmboost.com"
    className="
      block font-semibold
      text-gray-900 dark:text-gray-100
      hover:underline
      pt-1
    "
  >
    support@instantsmmboost.com
  </a>

  <p className="text-xs text-gray-500 dark:text-gray-500">
    Typical response time: within 24 hours
  </p>
</div>

     
    </div>
  );
}
