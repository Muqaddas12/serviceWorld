"use client";
import { useState, useEffect } from "react";
import { saveSmtpConfigAction, getSmtpConfigAction } from "@/lib/smtp";

export default function SmtpConfigPage() {
  const [form, setForm] = useState({
    host: "",
    port: "",
    user: "",
    pass: "",
    fromName: "",
    fromEmail: "",
  });

  // Load saved values
  useEffect(() => {
    async function loadConfig() {
      const saved = await getSmtpConfigAction();

      setForm({
        host: saved.host || "",
        port: saved.port || "",
        user: saved.user || "",
        pass: saved.pass || "",
        fromName: saved.fromName || "",
        fromEmail: saved.fromEmail || "",
      });
    }

    loadConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveConfig = async () => {
    const res = await saveSmtpConfigAction(form);
    console.log(res);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-white dark:bg-[#1A1A1A] shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          SMTP Configuration
        </h2>

        <div className="space-y-3">
          <input
            name="host"
            placeholder="SMTP Host"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.host}
            onChange={handleChange}
          />

          <input
            name="port"
            placeholder="Port"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.port}
            onChange={handleChange}
          />

          <input
            name="user"
            placeholder="SMTP Username"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.user}
            onChange={handleChange}
          />

          <input
            name="pass"
            type="text"
            placeholder="SMTP Password"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.pass}
            onChange={handleChange}
          />

          <input
            name="fromName"
            placeholder="Sender Name"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.fromName}
            onChange={handleChange}
          />

          <input
            name="fromEmail"
            placeholder="Sender Email"
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-[#111]"
            value={form.fromEmail}
            onChange={handleChange}
          />

          <button
            onClick={saveConfig}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
