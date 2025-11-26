"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { createBlogAction } from "@/lib/adminServices";

export default function AdminBlogWrite() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    image: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePublish = async () => {
    setStatus({ type: "loading", message: "Publishing blog..." });

    const res = await createBlogAction({
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()),
      image: form.image,
    });

    if (res.status) {
      setStatus({ type: "success", message: res.message });
      setTimeout(() => router.push("/admin/settings/blog"), 1200);
    } else {
      setStatus({ type: "error", message: res.message });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-[900px] mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-300">
          ←
        </button>
        <h1 className="text-2xl font-semibold">Write a Blog</h1>
      </div>

      {/* Editor Box */}
      <div className="bg-white dark:bg-[#151517] border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-5">
        <input
          name="title"
          placeholder="Enter Blog Title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0F1117] outline-none focus:ring-2 focus:ring-gray-400"
        />

        <textarea
          name="content"
          placeholder="Write blog content here..."
          rows={10}
          value={form.content}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0F1117] outline-none focus:ring-2 focus:ring-gray-400 resize-none"
        />

        <input
          name="image"
          placeholder="Featured Image URL (optional)"
          value={form.image}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0F1117] outline-none focus:ring-2 focus:ring-gray-400"
        />

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#0F1117] outline-none focus:ring-2 focus:ring-gray-400"
        />

        {/* Status */}
        {status && (
          <div
            className={`text-sm text-center font-medium p-3 rounded-xl ${
              status.type === "success"
                ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20"
                : status.type === "error"
                ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20"
                : "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700/30"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Publish Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-gray-200 text-white dark:text-black rounded-2xl shadow transition hover:opacity-80"
          >
            <Save size={16} /> Publish Blog
          </button>
        </div>
      </div>
    </motion.div>
  );
}
