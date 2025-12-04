"use client";

import { useState } from "react";
import { resendOrderAction } from "@/lib/ordersAdmin";

export default function EditUrlModal({ order, close }) {
  const [url, setUrl] = useState(order.link);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
    const res=  await resendOrderAction(order._id, url);
    if(res.success){
      alert(res.message)
      setLoading(false);
    close();
    return
    }
    alert(res.message)
    } catch (err) {
      console.error("Failed to update & resend order:", err);
    }
    setLoading(false);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-96 border border-yellow-500/20">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Edit Order URL
        </h2>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 bg-[#111] border border-yellow-500/20 rounded text-white"
          placeholder="Enter new URL"
        />

        <button
          onClick={submit}
          disabled={loading}
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
