"use client";

import { useState } from "react";
import { cancelOrderAction } from "@/lib/adminServices";

export default function CancelReasonModal({ order, close }) { 
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-96 border border-yellow-500/20">
        <h2 className="text-xl font-semibold text-yellow-400 mb-4">
          Reason of Cancel  : {order.status}
        </h2>

     

      

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
