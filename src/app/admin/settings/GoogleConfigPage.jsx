"use client";

import { useEffect, useState } from "react";
import { saveGoogleConfig, getGoogleConfig } from "@/lib/googleAuth";

export default function GoogleConfigPage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  // Load saved values on page load
  useEffect(() => {
    async function loadConfig() {
      const config = await getGoogleConfig();
      setClientId(config?.clientId || "");
      setClientSecret(config?.clientSecret || "");
    }
    loadConfig();
  }, []);

  const handleSubmit = async (formData) => {
    const result = await saveGoogleConfig(formData);
    alert(result?.message);
  };

  return (
    <div className="p-6 max-w-lg mx-auto border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Google OAuth Settings</h2>

      {/* Notes Section */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <p className="font-semibold mb-1">Required Redirect URLs:</p>
        <p className="text-gray-700">1️⃣ https://www.viralboost.com/api/auth/google/callback</p>
        <p className="text-gray-700">2️⃣ http://localhost:3000/api/auth/google/callback</p>
        <p className="text-xs text-gray-500 mt-2">
          Add both URLs in Google Cloud Console → OAuth → Authorized Redirect URIs.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1">Google Client ID</label>
          <input
            type="text"
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Google Client ID"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Google Client Secret</label>
          <input
            type="text"
            name="clientSecret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Google Client Secret"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
