"use client";

import { useState, useTransition } from "react";
import { setChildPanelSettings } from "@/lib/adminServices";

export default function ChildPanel({ initialSettings }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const [siteSettings, setSiteSettings] = useState({
    domain: initialSettings?.domain || "",
    subdomainprice: initialSettings?.subdomainprice || "",
    owndomainprice:initialSettings?.owndomainprice || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      const res = await setChildPanelSettings(formData);
      if (res.error) setMessage("❌ " + res.error);
      else setMessage("✅ " + res.message);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0e0e0f] p-6 text-gray-900 dark:text-gray-200 transition-colors">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#151517] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 shadow-lg">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Admin — Set Child Panel Details
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Domain */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-300">
              Domain
            </label>
            <input
              type="text"
              name="domain"
              placeholder="yourchildpanel.com"
              value={siteSettings.domain}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 dark:bg-[#0e0e0f] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 outline-none transition"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-300">
              Sub Domain Price
            </label>
            <input
              type="text"
              name="subdomainprice"
              placeholder="₹ xxx"
              value={siteSettings?.subdomainprice}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 dark:bg-[#0e0e0f] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-300">
              Own Domain Price
            </label>
            <input
              type="text"
              name="owndomainprice"
              placeholder="₹ xxx"
              value={siteSettings?.owndomainprice}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 dark:bg-[#0e0e0f] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-300">
          Add Name Server
            </label>
            <textarea
              type="text"
              name="nameserver"
              placeholder=""
              value={siteSettings?.nameserver}
              onChange={handleChange}
              required
              className="w-full bg-gray-100 dark:bg-[#0e0e0f] border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 rounded-lg font-semibold text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 transition ${
              isPending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "Saving..." : "Save Settings"}
          </button>

          {/* Message Output */}
          {message && (
            <p
              className={`text-center mt-3 text-sm ${
                message.startsWith("✅") ? "text-green-600 dark:text-green-400" 
                                          : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
