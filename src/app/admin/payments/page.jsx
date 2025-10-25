"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Fetch payments data
  useEffect(() => {
    const getPayments = async () => {
      try {
        const res = await fetch("/api/admin/getpayments", {
          method: "GET",
          credentials: "include", // for cookies if needed
        });
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch payments");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setPayments(data.payments || []);
        setFilteredPayments(data.payments || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        setLoading(false);
      }
    };
    getPayments();
  }, []);

  // Filter payments based on search
  useEffect(() => {
    if (!search) {
      setFilteredPayments(payments);
      return;
    }
    const lowerSearch = search.toLowerCase();
    const results = payments.filter((payment) =>
      Object.values(payment).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredPayments(results);
  }, [search, payments]);

  if (loading) return <p className="p-6">Loading payments...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!payments.length) return <p className="p-6">No payments found.</p>;

  const headers = Object.keys(payments[0]);

  return (
    <div className="bg-white text-black min-h-screen p-6">
      <h1 className="text-3xl font-semibold mb-4">Payments</h1>
      <p className="text-gray-700 mb-6">Track all payment transactions and fund additions.</p>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search payments..."
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
            {filteredPayments.map((payment, index) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border-b border-gray-300">{index + 1}</td>
                {headers.map((key) => (
                  <td
                    key={key}
                    className="py-2 px-2 border-b border-gray-300 truncate max-w-[10rem]"
                    title={String(payment[key])}
                  >
                    {String(payment[key])}
                  </td>
                ))}
                <td className="py-2 px-2 border-b border-gray-300 flex gap-2">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/admin/payments/view/${payment._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-3 py-1 rounded"
                    onClick={() => router.push(`/admin/payments/edit/${payment._id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
