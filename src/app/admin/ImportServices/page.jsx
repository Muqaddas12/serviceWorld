'use client'
import React, { useState, useRef, useEffect } from "react";
import { importServicesAction, StoreServicesInDB } from "@/lib/services";
import { getProvidersAction } from "@/lib/providerActions";
import FormSection from "./FormSection";

export default function ServiceImporter() {
  const [providerInput, setProviderInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // ids of selected rows
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [openProviderDropdown, setOpenProviderDropdown] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [provider, setProvider] = useState([]);
  const [profitPercentage, setProfitPercentage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [reviewServices, setReviewServices] = useState([]); // rows shown in final table

  const providerDropdownRef = useRef(null);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProvidersAction();
      if (res) setProvider(res);
    };
    loadProviders();
  }, []);

  // Import Services API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await importServicesAction({ url: providerInput, api: apiKey });

    if (result.error) {
      alert("Failed to import services!");
      setServices([]);
      setCategories([]);
      setSelectedServices([]);
      setShowServices(false);
      return;
    }

    const formatted = Array.isArray(result)
      ? result.map((s, i) => ({
          id: i + 1,
          name: s.service,
          category: s.category || "Other",
          min: s.min,
          max: s.max,
          rate: s.rate,
          provider: providerInput,
          api_category: s.category || "Other",
          ...s,
        }))
      : [];

    setServices(formatted);
    setSelectedServices([]);
    setShowServices(false);
    setReviewServices([]);

    const catList = ["All", ...new Set(formatted.map((s) => s.category || "Other"))];
    setCategories(catList);
  };

  // CHECK / UNCHECK ONLY LOGIC
  const handleRowCheck = (id, checked) => {
    setSelectedServices((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  // Keep selectAll state synced
  useEffect(() => {
    setSelectAll(
      services.length > 0 &&
      selectedServices.length > 0 &&
      selectedServices.length === services.length
    );
  }, [selectedServices, services]);

  const filteredServices = services.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeCategory === "All" || s.category === activeCategory)
    );
  });

  // Submit Categories → prepare final table list
  const handleCategorySubmit = () => {
    if (selectedServices.length === 0) {
      alert("Select at least one service!");
      return;
    }
    const initialReview = services.filter((s) => selectedServices.includes(s.id));
    setReviewServices(initialReview); // freeze rows shown in final table
    setShowServices(true);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    const selected = services.filter((s) => selectedServices.includes(s.id));

    if (selected.length === 0) {
      alert("No services selected to submit!");
      return;
    }

    setSubmitting(true);
    const res = await StoreServicesInDB({ services: selected, profitPercentage });
    alert(res.message);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      <FormSection
        provider={provider}
        providerInput={providerInput}
        apiKey={apiKey}
        profitPercentage={profitPercentage}
        openProviderDropdown={openProviderDropdown}
        setOpenProviderDropdown={setOpenProviderDropdown}
        setProviderInput={setProviderInput}
        setApiKey={setApiKey}
        setProfitPercentage={setProfitPercentage}
        handleSubmit={handleSubmit}
      />

      {/* MAIN TABLE */}
      {categories.length > 0 && !showServices && (
        <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
          {/* (Optional) Search input – you already have state */}
          {/* <input
            className="mb-3 w-full border rounded-lg px-3 py-2"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}

          <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2"></th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Select Categories</th>
                <th className="border p-2">API Category Name</th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => handleRowCheck(service.id, e.target.checked)}
                    />
                  </td>

                  <td className="border p-2 text-center">{service.id}</td>

                  <td className="border p-2">
                    <select
                      className="form-control w-full p-1 border rounded-lg"
                      value={service.category || ""}  // ✅ never null/undefined
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((s) =>
                            s.id === service.id
                              ? {
                                  ...s,
                                  category:
                                    e.target.value === "0"
                                      ? "Other"
                                      : e.target.value,
                                }
                              : s
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

                  <td className="border p-2">
                    <input
                      readOnly
                      className="form-control w-full p-1 border rounded-lg bg-gray-50 dark:bg-gray-800"
                      value={service.api_category || ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleCategorySubmit}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-xl shadow hover:opacity-90"
          >
            Submit Categories
          </button>
        </div>
      )}

{/* FINAL TABLE */}
{showServices && (
  <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
    <h2 className="text-lg font-semibold mb-3 text-center">Selected Services</h2>

    <table className="table-auto w-full border-collapse border border-gray-400 dark:border-gray-600 text-sm">
      <thead className="bg-gray-200 dark:bg-gray-700">
        <tr>
      
          <th className="border p-2"></th>
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
            {/* Checkbox */}
            <td className="border p-2 text-center">
              <input
                type="checkbox"
                checked={selectedServices.includes(s.id)}
                onChange={(e) => handleRowCheck(s.id, e.target.checked)}
              />
            </td>

            {/* ID */}
            <td className="border p-2 text-center">{s.id}</td>

            {/* Service Name */}
            <td className="border p-2">
              <input
                className=" border rounded p-1"
                value={s.name || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, name: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Type */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.type || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, type: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Category DROPDOWN */}
            <td className="border p-2">
              <select
                className="w-full border rounded-lg p-1"
                value={s.category || ""}  // ❗ null error fixed
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id
                        ? { ...row, category: e.target.value === "0" ? "Other" : e.target.value }
                        : row
                    )
                  )
                }
              >
                <option value="0">Create New</option>
                {categories.filter(c => c !== "All").map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </td>

            {/* Provider */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.provider || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, provider: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Rate (price + profitPercentage increase) */}
<td className="border p-2">
  <input
    className="w-full border rounded p-1"
    value={s.rate || ""}
    onChange={(e) =>
      setReviewServices(prev =>
        prev.map(row =>
          row.id === s.id ? { ...row, rate: e.target.value } : row
        )
      )
    }
  />

  {/* ✅ show increased price below input */}
  <div className="text-xs mt-1 text-gray-700 dark:text-gray-300 font-medium">
    Final Rate: {s.rate ? (Number(s.rate) + (Number(s.rate) * profitPercentage) / 100).toFixed(2) : "0.00"}
  </div>

</td>


            {/* Min */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.min || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, min: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Max */}
            <td className="border p-2">
              <input
                className="w-full border rounded p-1"
                value={s.max || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, max: e.target.value } : row
                    )
                  )
                }
              />
            </td>

            {/* Description */}
            <td className="border p-2">
              <textarea
                className="w-full border rounded p-1"
                value={s.description || ""}
                onChange={(e) =>
                  setReviewServices(prev =>
                    prev.map(row =>
                      row.id === s.id ? { ...row, description: e.target.value } : row
                    )
                  )
                }
              />
            </td>

         
          </tr>
        ))}
      </tbody>
    </table>

    {/* FINAL SUBMIT BUTTON */}
    <button
      onClick={handleFinalSubmit}
      disabled={submitting}
      className="mt-6 px-6 py-3 bg-blue-600 text-white text-md rounded-xl shadow hover:opacity-90 disabled:opacity-50"
    >
      {submitting ? "Submitting…" : "Import services"}
    </button>
  </div>
)}

    </div>
  );
}
