"use client";

import { useState, useRef } from "react";
import { FaTimes } from "react-icons/fa";

function Modal({ children, title, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-[#1A1C1F] border border-gray-300 dark:border-gray-700 rounded-xl w-full max-w-md p-5 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 dark:text-gray-300">
          <FaTimes size={18} />
        </button>
        <h2 className="text-lg font-semibold mb-3 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function EditServiceModal({ editData, onSave, onClose, category }) {
  const [localData, setLocalData] = useState({ ...editData });

  const initialFinalPrice = (
    Number(editData.rate || 0) *
    (1 + (Number(editData.profitPercentage || 0) / 100))
  ).toFixed(2);

  // Only ONE input
  const [finalPriceInput, setFinalPriceInput] = useState(initialFinalPrice);

  const handleChange = (key, val) => {
    setLocalData(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    const updated = { ...localData };

    for (const key in updated) {
      if (!isNaN(updated[key])) updated[key] = Number(updated[key]);
    }

    updated.updatedAt = new Date().toISOString();
    onSave(updated);
    onClose();
  };

  return (
<Modal onClose={onClose} title="Edit Service">

  {/* Ensure average_time exists */}
  {(() => {
    if (!("average_time" in localData)) {
      localData.average_time = "";
    }
    return null;
  })()}

  <form className="h-[60vh] overflow-y-auto pr-2 space-y-3">

    {Object.entries(localData)
      .filter(([key]) =>
        ![
          "createdAt",
          "updatedAt",
          "customservice",
          "_id",
          "storedBy",
          "id",
          "service",
          "profitPercentage",
        ].includes(key)
      )
      .map(([key, value]) => (
        <div key={key} className="flex flex-col gap-1">

          <label className="text-sm font-semibold capitalize">
            {key.replace(/_/g, " ")}
          </label>

          {/* CATEGORY */}
          {key === "category" ? (
            <select
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#1E1F23]"
            >
              {category.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

          ) : key === "status" ? (
            /* STATUS */
            <select
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#1E1F23]"
            >
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>

          ) : key === "average_time" ? (
            /* ⭐ ALWAYS SHOW average_time */
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#1E1F23]"
              placeholder="e.g. Instant, 30 minutes, 1–2 hours"
            />

          ) : key === "rate" ? (
            /* FINAL PRICE FIELD */
            <input
              type="number"
              value={finalPriceInput}
              onChange={(e) => {
                const val = e.target.value;
                setFinalPriceInput(val);

                const finalPrice = Number(val);
                const rate = Number(localData.rate || 0);

                if (!isNaN(finalPrice) && rate > 0) {
                  const newProfit =
                    ((finalPrice - rate) / rate) * 100;

                  handleChange(
                    "profitPercentage",
                    Number(newProfit.toFixed(2))
                  );
                }
              }}
              onBlur={() => {
                const recalc = (
                  Number(localData.rate || 0) *
                  (1 + Number(localData.profitPercentage || 0) / 100)
                ).toFixed(2);

                setFinalPriceInput(recalc);
              }}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#1E1F23]"
              placeholder="Final Price"
            />

          ) : (
            /* DEFAULT INPUT */
            <input
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 rounded border bg-white dark:bg-[#1E1F23]"
            />
          )}
        </div>
      ))}

  </form>

  <div className="pt-3 border-t mt-3">
    <button
      onClick={handleSave}
      className="px-4 py-2 bg-gray-800 text-white rounded-lg w-full"
    >
      Save Changes
    </button>
  </div>

</Modal>

  );
}
