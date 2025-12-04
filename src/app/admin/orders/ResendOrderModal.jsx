"use client";

import { useState } from "react";
import { resendOrderAction } from "@/lib/adminServices";

export default function ResendOrderModal({ order, close }) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
   const res= await resendOrderAction(order._id);
  
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
          Resend Order
        </h2>

        <p className="text-gray-300 mb-3">
          Are you sure you want to resend order{" "}
          <span className="text-yellow-400">#{order._id}</span>?
        </p>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-yellow-600/40 text-yellow-300 px-3 py-2 rounded hover:bg-yellow-600/60 disabled:opacity-50"
        >
          {loading ? "Resending..." : "Yes, Resend"}
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
