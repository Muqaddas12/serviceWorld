"use client";

export default function ServiceRow({ srv, setSelectedService }) {
  return (
    <tr className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
      <td className="px-4 py-3">{srv.service}</td>
      <td className="px-4 py-3">{srv.name}</td>
      <td className="px-4 py-3">₹{srv.rate}</td>
      <td className="px-4 py-3">{srv.min}</td>
      <td className="px-4 py-3">{srv.max}</td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-md ${
            srv.status === "Enabled"
              ? "bg-green-300/20 text-green-600 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-300/20 text-red-600 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {srv.status}
        </span>
      </td>

      <td className="px-4 py-3 text-center">
        <button
          onClick={() => setSelectedService(srv)}
          className="px-4 py-1 text-xs border rounded-md border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          View
        </button>
      </td>
    </tr>
  );
}
