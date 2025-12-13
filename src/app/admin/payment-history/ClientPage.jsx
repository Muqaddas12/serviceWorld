"use client";

export default function PaymentHistoryTable({ data = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-300 bg-gray-50">
      <table className="w-full border-collapse text-sm text-gray-800">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border px-3 py-2 text-left">UTR</th>
            <th className="border px-3 py-2 text-left">Amount</th>
            <th className="border px-3 py-2 text-left">Status</th>
            <th className="border px-3 py-2 text-left">Gateway</th>
            <th className="border px-3 py-2 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No payment history
              </td>
            </tr>
          ) : (
            data.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-gray-100 transition"
              >
                <td className="border px-3 py-2">{p.utr}</td>
                <td className="border px-3 py-2">₹{p.amount}</td>
                <td className="border px-3 py-2 capitalize">
                  {p.status}
                </td>
                <td className="border px-3 py-2">{p.gateway}</td>
                <td className="border px-3 py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
