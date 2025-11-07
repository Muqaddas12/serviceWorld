"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

export default function ExportPopup({ users = [], dusers = [], onClose }) {
  // which set to export
  const [exportType, setExportType] = useState("active"); // "active" | "deleted" | "both"
  // default fields
  const [selectedFields, setSelectedFields] = useState(["username", "email", "role"]);

  // compute all available fields dynamically (minus sensitive ones)
  const allFields = useMemo(() => {
    const set = new Set();
    [...users, ...dusers].forEach((u) => {
      Object.keys(u || {}).forEach((k) => set.add(k));
    });
    // hide sensitive/system fields commonly present
    ["password", "salt", "__v"].forEach((k) => set.delete(k));
    return Array.from(set);
  }, [users, dusers]);

  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleExport = () => {
    // choose dataset
    let data =
      exportType === "active"
        ? users
        : exportType === "deleted"
        ? dusers
        : [...users, ...dusers];

    if (!data?.length) {
      alert("No data to export.");
      return;
    }

    if (!selectedFields?.length) {
      alert("Please select at least one field.");
      return;
    }

    // build CSV rows
    const header = selectedFields.join(",");
    const rows = data.map((row) =>
      selectedFields
        .map((f) => {
          const val = row?.[f];
          const str = val == null ? "" : String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${exportType}_users.csv`;
    link.click();

    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400"
          aria-label="Close export popup"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
          Export Users
        </h2>

        {/* Select dataset */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2 font-medium">Select Type:</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="w-full bg-[#0a0a0b] border border-yellow-500/30 text-gray-200 rounded-lg px-3 py-2"
          >
            <option value="active">Active Users</option>
            <option value="deleted">Deleted Users</option>
            <option value="both">All Users</option>
          </select>
        </div>

        {/* Select fields */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">
            Select Fields to Export:
          </label>
          <div className="max-h-44 overflow-y-auto border border-yellow-500/10 rounded-lg p-3 bg-[#0a0a0b]/50">
            {allFields.length === 0 ? (
              <p className="text-gray-500 text-sm">No fields available.</p>
            ) : (
              allFields.map((field) => (
                <label key={field} className="flex items-center gap-2 py-1 text-gray-300">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => toggleField(field)}
                    className="accent-yellow-500"
                  />
                  {field}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}
