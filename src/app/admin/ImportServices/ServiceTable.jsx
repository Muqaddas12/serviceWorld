"use client";
import React, { useState } from "react";

export default function ServiceTable({
  profitPercentage,
  reviewServices,
  selectedServices,
  handleRowCheck,
  setReviewServices,
  categories,
  handleFinalSubmit,
  submitting,
}) {
  const [tableLoading, setTableLoading] = useState(false);

  // SELECT ALL HANDLER
  const selectAllRows = (checked) => {
    if (checked) {
      const ids = reviewServices.map((s) => s.id);
      handleRowCheck("selectAllFinal", true, ids);
    } else {
      handleRowCheck("selectAllFinal", false, []);
    }
  };

  // FIX: Proper "all selected" logic
  const allSelected =
    reviewServices.length > 0 &&
    reviewServices.every((s) => selectedServices.includes(s.id));

  return (
    <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-3 text-center">Selected Services</h2>

      {tableLoading && (
        <p className="text-center py-4 text-blue-600 font-semibold text-md">
          Loading services…
        </p>
      )}

      {!tableLoading && (
        <table className="table-auto w-full border-collapse border border-gray-400 dark:border-gray-600 text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAllRows(e.target.checked)}
                />
              </th>

              <th className="border p-2">ID</th>
              <th className="border p-2">Service Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Provider</th>
              <th className="border p-2">Rate + {profitPercentage + "%"}</th>
              <th className="border p-2">Min</th>
              <th className="border p-2">Max</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>

          <tbody>
            {reviewServices.map((s) => (
              <tr key={s.id}>
                {/* Row checkbox */}
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(s.id)}
                    onChange={(e) => handleRowCheck(s.id, e.target.checked)}
                  />
                </td>

                <td className="border p-2 text-center">{s.id}</td>

                {/* NAME */}
                <td className="border p-2">
                  <input
                    className="border rounded p-1"
                    value={s.name || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id ? { ...row, name: e.target.value } : row
                        )
                      )
                    }
                  />
                </td>

                {/* TYPE */}
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={s.type || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id ? { ...row, type: e.target.value } : row
                        )
                      )
                    }
                  />
                </td>

                {/* CATEGORY */}
                <td className="border p-2">
                  <select
                    className="w-full border rounded-lg p-1"
                    value={s.category || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id
                            ? {
                                ...row,
                                category:
                                  e.target.value === "0" ? "Other" : e.target.value,
                              }
                            : row
                        )
                      )
                    }
                  >
                    <option value="0">Create New</option>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat, i) => (
                        <option key={i} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </td>

                {/* PROVIDER */}
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={s.provider || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id
                            ? { ...row, provider: e.target.value }
                            : row
                        )
                      )
                    }
                  />
                </td>

                {/* RATE */}
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={s.rate || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id ? { ...row, rate: e.target.value } : row
                        )
                      )
                    }
                  />

                  <div className="text-xs mt-1 text-gray-700 dark:text-gray-300 font-medium">
                    Final Rate:{" "}
                    {s.rate
                      ? (
                          Number(s.rate) +
                          (Number(s.rate) * profitPercentage) / 100
                        ).toFixed(2)
                      : "0.00"}
                  </div>
                </td>

                {/* MIN */}
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={s.min || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id ? { ...row, min: e.target.value } : row
                        )
                      )
                    }
                  />
                </td>

                {/* MAX */}
                <td className="border p-2">
                  <input
                    className="w-full border rounded p-1"
                    value={s.max || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id ? { ...row, max: e.target.value } : row
                        )
                      )
                    }
                  />
                </td>

                {/* DESCRIPTION */}
                <td className="border p-2">
                  <textarea
                    className="w-full border rounded p-1"
                    value={s.description || ""}
                    onChange={(e) =>
                      setReviewServices((prev) =>
                        prev.map((row) =>
                          row.id === s.id
                            ? { ...row, description: e.target.value }
                            : row
                        )
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleFinalSubmit}
        disabled={submitting}
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-md rounded-xl shadow hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Import services"}
      </button>
    </div>
  );
}
