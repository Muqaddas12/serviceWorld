'use client'
import React, { useState, useEffect } from "react";
import { getCategories, importServicesAction, StoreServicesInDB } from "@/lib/services";
import FormSection from "./FormSection";
import ServiceTable from "./ServiceTable";

export default function ClientPage({ provider = [] }) {
  const [providerInput, setProviderInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openProviderDropdown, setOpenProviderDropdown] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const [profitPercentage, setProfitPercentage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showServices, setShowServices] = useState(false);
  const [reviewServices, setReviewServices] = useState([]);
  const [apiCategory, setApiCategory] = useState([]);

  const [loading, setLoading] = useState(false); // ✅ NEW LOADING STATE

  // Import Services API Call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit

    setLoading(true);

    const result = await importServicesAction({
      url: providerInput,
      api: apiKey,
    });

    if (result.error) {
      alert("Failed to import services!");
      setServices([]);
      setApiCategory([]);
      setSelectedServices([]);
      setLoading(false);
      return;
    }

    // FORMAT SERVICES
    const formatted = result.map((s, i) => ({
      id: i + 1,
      name: s.service,
      category: s.category || "Other",
      min: s.min,
      max: s.max,
      rate: s.rate,
      provider: providerInput,
      api_category: s.category || "Other",
      ...s,
    }));

    setServices(formatted);

    // UNIQUE API CATEGORIES
    const uniqueCategories = [...new Set(formatted.map((s) => s.api_category))];

    const grouped = uniqueCategories.map((cat) => ({
      category: cat,
      services: formatted.filter((s) => s.api_category === cat),
    }));

    setApiCategory(grouped);

    // Load system categories
    const catList = await getCategories();
    setCategories(catList?.data || []);

    setLoading(false); // ✅ STOP LOADING
  };

  // CHECK / UNCHECK logic
  const handleRowCheck = (categoryName, checked,ids = []) => {
     // SELECT ALL
  if (categoryName === "selectAllFinal") {
    if (checked) {
      setSelectedServices(ids);   // all service IDs
    } else {
      setSelectedServices([]);    // unselect all
    }
    return;
  }
    setSelectedServices((prev) =>
      checked ? [...prev, categoryName] : prev.filter((x) => x !== categoryName)
    );
  };

  // Keep selectAll synced
  useEffect(() => {
    setSelectAll(
      apiCategory.length > 0 &&
      selectedServices.length === apiCategory.length
    );
  }, [selectedServices, apiCategory]);

  // Submit Categories
  const handleCategorySubmit = () => {
    if (selectedServices.length === 0) {
      alert("Select at least one category!");
      return;
    }

    const selectedRows = apiCategory
      .filter((row) => selectedServices.includes(row.category))
      .flatMap((row) => row.services);

    setReviewServices(selectedRows);
    setShowServices(true);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    const selected = reviewServices;

    if (selected.length === 0) {
      alert("No services selected to submit!");
      return;
    }

    setSubmitting(true);
    const res = await StoreServicesInDB({
      services: selected,
      profitPercentage,
    });

    alert(res.message);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      
      {/* Form Section */}
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
        loading={loading} // ✅ pass to form if needed
      />

      {/* LOADING INDICATOR */}
      {loading && (
        <p className="text-center text-lg font-semibold text-blue-600">
          Loading services... ⏳
        </p>
      )}

      {/* CATEGORY TABLE */}
      {!loading  && !showServices && apiCategory.length > 0 && (
        <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
          
          <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectAll(checked);
                      setSelectedServices(
                        checked ? apiCategory.map((r) => r.category) : []
                      );
                    }}
                  />
                </th>
                <th className="border p-2">ID</th>
                <th className="border p-2">Select Categories</th>
                <th className="border p-2">API Category Name</th>
              </tr>
            </thead>

            <tbody>
              {apiCategory.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(row.category)}
                      onChange={(e) =>
                        handleRowCheck(row.category, e.target.checked)
                      }
                    />
                  </td>

                  <td className="border p-2 text-center">{index + 1}</td>

                  <td className="border p-2">
                    <select className="form-control w-full p-1 border rounded-lg">
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
                      value={row.category}
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

      {/* FINAL SERVICE TABLE */}
      {showServices && (
        <ServiceTable
          profitPercentage={profitPercentage}
          reviewServices={reviewServices}
          selectedServices={selectedServices}
          handleRowCheck={handleRowCheck}
          setReviewServices={setReviewServices}
          categories={categories}
          handleFinalSubmit={handleFinalSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}
