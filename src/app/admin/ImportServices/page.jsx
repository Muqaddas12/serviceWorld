'use client'
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { importServicesAction } from "@/lib/services";

export default function ServiceImporter({ providers = [], onSave }) {
  const [usePredefined, setUsePredefined] = useState(true);
  const [providerInput, setProviderInput] = useState(providers[0]?.value || "");
  const [apiKey, setApiKey] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [openProviderDropdown, setOpenProviderDropdown] = useState(false);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [viewService, setViewService] = useState(null);

  const providerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Import Services API Call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await importServicesAction({ url: providerInput, api: apiKey });

    if (result.error) {
      alert("Failed to import services!");
      setServices([]);
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
          ...s
        }))
      : [];

    setServices(formatted);
    setSelectedServices([]);
    setViewService(null);
  };

  const toggleSelectService = (id) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Select ALL from table
  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedServices(services.map(s => s.id));
      setSelectAll(true);
    } else {
      setSelectedServices([]);
      setSelectAll(false);
    }
  };

  useEffect(() => {
    setSelectAll(services.length > 0 && selectedServices.length === services.length);
  }, [selectedServices, services]);

  // Categories list
  const categories = ["All", ...new Set(services.map(s => s.category))];

  // Filter services
  const filteredServices = services.filter(s => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (activeCategory === "All" || s.category === activeCategory)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(e.target)) {
        setOpenProviderDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setOpenCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFinalSubmit = () => {
    const selected = services.filter(s => selectedServices.includes(s.id));
    console.log(selected)
    onSave?.(selected);
    onSave && alert("Services Saved!");
  };

  return (
    <div className="flex flex-col p-4 gap-4 w-full">

      {/* FORM SECTION */}
      <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Provider Mode Toggle */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={usePredefined}
              onChange={() => {
                setUsePredefined(!usePredefined);
                setProviderInput("");
              }}
              className="h-4 w-4"
            />
            <label>{usePredefined ? "Use Predefined Provider" : "Enter New Provider URL"}</label>
          </div>

          <div className="flex gap-2">
            {usePredefined && (
              <div ref={providerDropdownRef} className="relative w-[180px]">
                <button
                  type="button"
                  onClick={() => setOpenProviderDropdown(!openProviderDropdown)}
                  className="w-full border px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm"
                >
                  {providers.find(p => p.value === providerInput)?.label || "Select Provider ▼"}
                </button>

                {openProviderDropdown && (
                  <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded-xl shadow z-50">
                    {providers.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setProviderInput(p.value);
                          setOpenProviderDropdown(false);
                        }}
                        className="px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {p.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            <input
              placeholder="Enter provider API URL"
              value={providerInput}
              onChange={(e) => setProviderInput(e.target.value)}
              className="flex-1 border p-2 rounded-lg text-sm"
              required
            />
          </div>

          <input
            type="password"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border p-2 rounded-lg text-sm"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700"
          >
            Import Services
          </button>
        </form>
      </div>

      {/* SERVICE TABLE + CONTROLS */}
      {services.length > 0 && (
        <div className="border p-4 rounded-2xl shadow bg-white dark:bg-gray-900">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4" />
            <input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-2 pl-8 rounded-lg text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div ref={categoryDropdownRef} className="relative mt-3">
            <button
              type="button"
              onClick={() => setOpenCategoryDropdown(!openCategoryDropdown)}
              className="w-full border px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800"
            >
              Category: {activeCategory} ▼
            </button>

            {openCategoryDropdown && (
              <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 border rounded-xl shadow z-50">
                {categories.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveCategory(c);
                      setOpenCategoryDropdown(false);
                    }}
                    className="px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Select All */}
          <div className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-4 w-4" />
            <label>Select All Services</label>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-3">
            <table className="w-full border text-xs">
              <thead className="border-b bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-2">Select</th>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Min</th>
                  <th className="p-2">Max</th>
                  <th className="p-2 text-right">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(s => (
                  <tr key={s.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(s.id)}
                        onChange={() => toggleSelectService(s.id)}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="p-2">{s.name}</td>
                    <td className="p-2">{s.category}</td>
                    <td className="p-2 text-center">{s.rate}</td>
                    <td className="p-2 text-center">{s.min}</td>
                    <td className="p-2 text-center">{s.max}</td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => setViewService(s)}
                        className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-sm text-gray-500">No services found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Final Submit */}
          <button
            onClick={handleFinalSubmit}
            className="mt-3 w-full py-2 bg-green-700 text-white text-sm rounded-lg hover:bg-green-600"
          >
            Submit Selected Services
          </button>

        </div>
      )}

     {/* ✅ Responsive Centered Details Panel */}
{viewService && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3 z-50">
    <div className="
      bg-white dark:bg-gray-900 
      w-full max-w-[420px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]
      max-h-[85vh] 
      overflow-y-auto 
      shadow-xl border rounded-2xl p-4
      animate-fadeIn
    ">
      <button
        onClick={() => setViewService(null)}
        className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg mb-3"
      >
        Close Panel
      </button>

      <pre className="text-[11px] sm:text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-xl border overflow-x-auto">
        {JSON.stringify(viewService, null, 2)}
      </pre>
    </div>
  </div>
)}


    </div>
  );
}
