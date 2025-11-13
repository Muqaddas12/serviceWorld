'use server'
import Link from "next/link";
import { getChildPanels } from "@/lib/adminServices";
import { FaCog } from "react-icons/fa";

export default async function Page() {
  const res = await getChildPanels();

  if (res.error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-lg">
        ❌ {res.error}
      </div>
    );
  }

  const panels = res.requests || [];

  return (
    <div className="min-h-screen bg-[#0e0e0f] p-6 text-gray-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl font-bold text-yellow-400">
            My Child Panel Requests
          </h1>

          {/* ⚙️ Go to Settings Button */}
          <Link
            href="/admin/settings/child-panel-settings"
            className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-yellow-500/40 transition-all"
          >
            <FaCog /> Go to Child Panel Settings
          </Link>
        </div>

        {/* Table Section */}
        {panels.length === 0 ? (
          <p className="text-gray-400">No requests found.</p>
        ) : (
          <div className="overflow-x-auto border border-yellow-500/20 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-400">
                  <th className="p-3">Domain</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {panels.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-yellow-500/10 hover:bg-[#1a1a1b] transition"
                  >
                    <td className="p-3">{p.domain}</td>
                    <td className="p-3">{p.panel_username}</td>
                    <td className="p-3">{p.currency}</td>
                    <td className="p-3">{p.price}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : p.status === "approved"
                            ? "bg-green-500/20 text-green-400 border border-green-400/30"
                            : "bg-red-500/20 text-red-400 border border-red-400/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
