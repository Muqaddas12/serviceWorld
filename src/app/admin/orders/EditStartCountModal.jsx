"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStartCountAction } from "@/lib/ordersAdmin";
import { Save } from "lucide-react";
import { motion } from "framer-motion";

export default function EditStartCountModal({ order, close }) {
  const router = useRouter();
  const [startCount, setStartCount] = useState(order.startCount || order.startCount);
  const [status, setStatus] = useState(null);

  const submit = async () => {
    const count = Number(startCount);
    if (isNaN(count) || count < 0) {
      setStatus({ type: "error", message: "Please enter a valid number." });
      setTimeout(() => setStatus(null), 2000);
      return;
    }

    setStatus({ type: "loading", message: "Updating start count..." });

    const res = await updateStartCountAction(order._id, count);

    if (res.success) {
      setStatus({ type: "success", message: res.message });
      setTimeout(() => {
        setStatus(null);
        close();
        router.refresh?.(); // ✅ refresh dashboard UI
      }, 1200);
    } else {
      setStatus({ type: "error", message: res.message });
      setTimeout(() => setStatus(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] p-6 rounded-xl w-96 border border-yellow-500/20 space-y-4"
      >
        <h2 className="text-xl font-semibold text-yellow-400">
          Edit Start Count
        </h2>

        {/* Input */}
        <input
          value={startCount}
          onChange={(e) => setStartCount(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-yellow-500/40 text-sm"
          placeholder="Enter start count"
        />

        {/* Status Box */}
        {status && (
          <div
            className={`text-sm text-center font-medium p-2 rounded-lg ${
              status.type === "success"
                ? "text-green-400 bg-green-900/30"
                : status.type === "error"
                ? "text-red-400 bg-red-900/30"
                : "text-yellow-300 bg-yellow-900/20"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={submit}
          disabled={status?.type === "loading"}
          className="w-full flex items-center justify-center gap-2 bg-yellow-600/90 hover:bg-yellow-500 text-black font-medium px-3 py-2.5 rounded-lg transition disabled:opacity-50 text-sm"
        >
          <Save size={16} /> Save
        </button>

        <button
          onClick={close}
          className="w-full bg-gray-700 text-gray-300 px-3 py-2 rounded-lg hover:opacity-80 transition text-sm"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
