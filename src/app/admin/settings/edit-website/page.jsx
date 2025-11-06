"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { updateWebsiteSettings,getWebsiteSettings } from "@/lib/adminServices";

export default function EditWebsite() {
  const [formData, setFormData] = useState({
    siteName: "",
    panelName: "",
    maintenanceMode: false,
    servicesEnabled: true, // 🆕 added new toggle
    logo: "",
    favicon: "",
    bronzeMember: "",
    silverMember: "",
    goldMember: "",
    reseller: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  // ✅ Fetch once
  useEffect(() => {
    if (fetched) return;
    setFetched(true);

    (async () => {
      try {
       const res= await getWebsiteSettings()
       console.log(res)
        if (res.success) {
          const settings=res.plainsettings
          const data = await JSON.parse(settings)
          setFormData((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("❌ Failed to load settings:", err);
      }
    })();
  }, [fetched]);

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files[0] }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    try {
      const res = await updateWebsiteSettings(formData)
    
      if (res.success) {
        alert("✅ Settings updated successfully!");
        setFormData(res.settings);
      } else {
        alert("❌ Failed to update settings.");
      }
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Error updating settings.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0f] flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-3xl bg-[#151517] border border-yellow-500/20 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">
          Edit Website Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-300">
          {/* 🔹 General Info */}
          <SectionTitle title="General Settings" />
          <Input
            label="Site Name"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
          />
          <Input
            label="Panel Name"
            name="panelName"
            value={formData.panelName}
            onChange={handleChange}
          />

          {/* 🔹 Media Uploads */}
          <SectionTitle title="Branding" />
          <FileInput
            label="Logo"
            name="logo"
            file={formData.logo}
            onChange={handleFileChange}
          />
          <FileInput
            label="Favicon"
            name="favicon"
            file={formData.favicon}
            onChange={handleFileChange}
          />

          {/* 🔹 Toggles */}
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

          {/* 🔹 Memberships */}
          <SectionTitle title="Membership Pricing" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["bronzeMember", "silverMember", "goldMember", "reseller"].map(
              (field) => (
                <Input
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1")}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              )
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transition duration-300"
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
  return <h2 className="text-xl font-semibold text-yellow-400 mb-4">{title}</h2>;
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block font-medium text-yellow-400 mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-[#0e0e0f] text-gray-300 border border-yellow-500/20 rounded-xl px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
      />
    </div>
  );
}

function FileInput({ label, name, file, onChange }) {
  return (
    <div>
      <label className="block font-medium text-yellow-400 mb-2">{label}</label>
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className="w-full bg-[#0e0e0f] text-gray-300 border border-yellow-500/20 rounded-xl px-4 py-2 focus:outline-none"
      />
      {file && typeof file === "string" && (
        <img
          src={file}
          alt={name}
          className="mt-3 h-14 rounded-lg border border-yellow-500/20"
        />
      )}
    </div>
  );
}

function ToggleSwitch({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between bg-[#0e0e0f] border border-yellow-500/20 px-4 py-3 rounded-xl">
      <span className="font-medium text-gray-300">{label}</span>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? "bg-yellow-500" : "bg-gray-700"
        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}
