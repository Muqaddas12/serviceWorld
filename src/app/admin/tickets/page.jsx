"use client";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch tickets from API
  useEffect(() => {
    const getTickets = async () => {
      try {
        const res = await fetch("/api/admin/gettickets", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch tickets");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setTickets(data.tickets || []);
        setFilteredTickets(data.tickets || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };
    getTickets();
  }, []);

  // Filter tickets by search
  useEffect(() => {
    if (!search) {
      setFilteredTickets(tickets);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const results = tickets.filter((ticket) =>
      Object.values(ticket).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredTickets(results);
  }, [search, tickets]);

  if (loading) return <p className="p-6">Loading tickets...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!tickets.length) return <p className="p-6">No tickets found.</p>;

  const headers = Object.keys(tickets[0]);

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Tickets</h1>
      <p className="text-gray-700 mb-6">Handle all user support tickets here.</p>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="py-2 px-2 border-b border-gray-300 w-8">#</th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="py-2 px-2 border-b border-gray-300 text-left truncate capitalize w-40"
                  title={header}
                >
                  {header}
                </th>
              ))}
              <th className="py-2 px-2 border-b border-gray-300 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <tr key={ticket._id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border-b border-gray-300">{index + 1}</td>
                {headers.map((key) => (
                  <td
                    key={key}
                    className="py-2 px-2 border-b border-gray-300 truncate max-w-[10rem]"
                    title={String(ticket[key])}
                  >
                    {String(ticket[key])}
                  </td>
                ))}
                <td className="py-2 px-2 border-b border-gray-300">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1 rounded"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-up Chat Popup */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50">
          <div className="bg-white w-full md:w-1/2 max-h-[80vh] rounded-t-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
              <h2 className="text-xl font-semibold">
                Ticket: {selectedTicket._id}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {(selectedTicket.replies || []).map((reply, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    reply.type === "admin"
                      ? "bg-blue-100 text-blue-800 self-end"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  <p>{reply.message}</p>
                  <small className="text-gray-500">{reply.created_at}</small>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-gray-300 flex gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    // Add reply (you can call API here)
                    const message = e.target.value;
                    if (!message) return;

                    const updatedTicket = {
                      ...selectedTicket,
                      replies: [
                        ...(selectedTicket.replies || []),
                        { type: "admin", message, created_at: new Date().toISOString() },
                      ],
                    };
                    setSelectedTicket(updatedTicket);

                    // Clear input
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded"
                onClick={() => {}}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
