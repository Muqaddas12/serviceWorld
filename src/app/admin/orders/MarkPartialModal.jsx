"use client";

import { useState } from "react";
import { markPartialAction } from "@/lib/ordersAdmin";

export default function MarkPartialModal({ order, close }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res=await markPartialAction(order._id, status);
    if(res.success){
      alert(res.message)
      setLoading(false)
      close()
      return
    }
alert(res.message)
    setLoading(false);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-96 border border-yellow-500/20">
        
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Update Order Status
        </h2>

        {/* Dropdown */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 bg-[#111] border border-yellow-500/20 rounded text-white"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={submit}
          disabled={loading || !status}
          className="w-full mt-4 bg-yellow-600/40 text-yellow-300 px-3 py-2 rounded hover:bg-yellow-600/60 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
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
