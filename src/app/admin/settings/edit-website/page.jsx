"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { updateWebsiteSettings, getWebsiteSettings } from "@/lib/adminServices";

export default function EditWebsite() {
  const [formData, setFormData] = useState({
    siteName: "",
    panelName: "",
    maintenanceMode: false,
    servicesEnabled: true,
    logo: "",
    favicon: "",
    bronzeMember: "",
    silverMember: "",
    goldMember: "",
    reseller: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;
    setFetched(true);

    (async () => {
      try {
        const res = await getWebsiteSettings();
        if (res.success) {
          const data = JSON.parse(res.plainsettings);
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    })();
  }, [fetched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateWebsiteSettings(formData);

      if (res.success) {
        alert("Settings updated successfully!");
        setFormData(res.settings);
      } else {
        alert("Failed to update settings.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating settings.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0e0e0f] flex justify-center items-start py-10 px-4 transition-colors">
      <div className="w-full max-w-3xl bg-white dark:bg-[#151517] border border-gray-300 dark:border-gray-700 p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Edit Website Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* General */}
          <SectionTitle title="General Settings" />
          <Input label="Site Name" name="siteName" value={formData.siteName} onChange={handleChange} />
          <Input label="Panel Name" name="panelName" value={formData.panelName} onChange={handleChange} />

          {/* Branding */}
          <SectionTitle title="Branding" />
          <FileInput label="Logo" name="logo" file={formData.logo} onChange={handleFileChange} />
          <FileInput label="Favicon" name="favicon" file={formData.favicon} onChange={handleFileChange} />

          {/* Toggles */}
          <SectionTitle title="System Controls" />
          <ToggleSwitch
            label="Maintenance Mode"
            enabled={formData.maintenanceMode}
            onChange={(v) => setFormData((p) => ({ ...p, maintenanceMode: v }))}
          />
          <ToggleSwitch
            label="Services"
            enabled={formData.servicesEnabled}
            onChange={(v) => setFormData((p) => ({ ...p, servicesEnabled: v }))}
          />

        

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 rounded-xl py-3 font-semibold text-white bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------- Components ---------------------------- */

function SectionTitle({ title }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
      {title}
    </h2>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block font-medium text-gray-800 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-gray-100 dark:bg-[#0e0e0f] text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:outline-none transition"
      />
    </div>
  );
}

function FileInput({ label, name, file, onChange }) {
  return (
    <div>
      <label className="block font-medium text-gray-800 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className="w-full bg-gray-100 dark:bg-[#0e0e0f] text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2"
      />
      {file && typeof file === "string" && (
        <img
          src={file}
          alt={name}
          className="mt-3 h-14 rounded-lg border border-gray-300 dark:border-gray-700 object-contain"
        />
      )}
    </div>
  );
}

function ToggleSwitch({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-[#0e0e0f] border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl">
      <span className="font-medium text-gray-800 dark:text-gray-300">
        {label}
      </span>

      <Switch
        checked={enabled}
        onChange={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          enabled ? "bg-gray-700 dark:bg-gray-600" : "bg-gray-400 dark:bg-gray-800"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </Switch>
    </div>
  );
}
