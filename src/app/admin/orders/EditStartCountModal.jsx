"use client";

import { useState } from "react";
import { updateStartCountAction } from "@/lib/adminServices";

export default function EditStartCountModal({ order, close }) {
  const [startCount, setStartCount] = useState(order.startCount);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    await updateStartCountAction(order._id, startCount);
    setLoading(false);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-96 border border-yellow-500/20">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Edit Start Count
        </h2>

        <input
          value={startCount}
          onChange={(e) => setStartCount(e.target.value)}
          className="w-full px-3 py-2 bg-[#111] border border-yellow-500/20 rounded text-white"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-4 bg-yellow-600/40 text-yellow-300 px-3 py-2 rounded hover:bg-yellow-600/60 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save"}
        </button>

        <button
          onClick={close}
          className="w-full mt-2 bg-gray-700 text-gray-300 px-3 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
