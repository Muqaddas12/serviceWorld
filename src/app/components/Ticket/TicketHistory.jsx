"use client";

export default function TicketHistory({ tickets, openTicket }) {
  return (
    <div className="bg-white rounded-2xl max-h-[400px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-black">Ticket History</h2>

      {tickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket._id || ticket.id}
            onClick={() => openTicket(ticket)}
            className="p-3 border border-gray-300 rounded mb-2 cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-black">{ticket.subject}</h3>
            <p className="text-gray-600 text-sm">{ticket.status}</p>
            <p className="text-gray-400 text-xs">{ticket.created_at}</p>
          </div>
        ))
      )}
    </div>
  );
}
