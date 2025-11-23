"use client";

import { FaTimes } from "react-icons/fa";

export default function ServiceModal({ service, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="max-w-lg w-full p-6 rounded-2xl shadow-lg border bg-white border-gray-300 text-gray-800 dark:bg-[#1A1C1F] dark:border-gray-700 dark:text-gray-200 relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">{service.name}</h2>

        {service.customservice && (
          <span className="mb-3 inline-block px-3 py-1 text-xs rounded bg-purple-200 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
            Custom Service
          </span>
        )}

        <p className="text-sm mb-4 opacity-80">{service.description || "No description"}</p>

        <div className="space-y-2 text-sm">
          <p><strong>Category:</strong> {service.category}</p>
          <p><strong>Rate:</strong> ₹{service.price}</p>
          <p><strong>Min:</strong> {service.min} | <strong>Max:</strong> {service.max}</p>
          <p><strong>Status:</strong> {service.status}</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
