"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBlogsAction } from "@/lib/adminServices";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getBlogsAction();
      if (res.status) {
        setBlogs(res.blogs);
      } else {
        setError(res.message);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading blogs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 text-gray-700 dark:text-gray-300">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Blogs
      </h1>

      {blogs.length === 0 && (
        <p className="text-center text-gray-500">No blogs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-[#151517] border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm cursor-pointer"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}

            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {blog.title}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(blog.createdAt).toDateString()}
            </p>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded-lg text-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 line-clamp-3">
              {blog.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
