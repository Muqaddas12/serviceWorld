export default function OrdersPage() {
  const orders = [
    {
      id: "ORD001",
      user: "muqaddas",
      service: "YouTube Views",
      status: "Pending",
      date: "2025-10-25",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Orders</h2>
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Service</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.user}</td>
                <td className="p-3">{o.service}</td>
                <td
                  className={`p-3 font-semibold ${
                    o.status === "Pending" ? "text-yellow-600" : "text-green-600"
                  }`}
                >
                  {o.status}
                </td>
                <td className="p-3">{o.date}</td>
                <td className="p-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    View
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
