"use client";

import { useRouter } from "next/navigation";
import { MdSupportAgent } from "react-icons/md";

export default function SupportSection() {
  const router = useRouter();

  return (
    <div
      className="
        relative flex flex-col items-center justify-center 
        rounded-2xl 
        p-6 sm:p-8 mt-10 text-center 
        transition-all duration-300

        /* Dark Mode Box */
        dark:bg-[#1A1F2B] dark:border-[#2B3143]
        dark:shadow-lg dark:shadow-black/20

        /* Light Mode Box */
        bg-gray-50 border border-gray-300
        shadow-md hover:shadow-lg
      "
    >
      {/* Soft Neutral Glow */}
      <div
        className="
          absolute inset-0 blur-2xl rounded-2xl opacity-20
          bg-gray-300 dark:bg-gray-700
        "
      ></div>

      {/* Icon */}
      <MdSupportAgent
        className="
          relative text-5xl sm:text-6xl 
          text-gray-700 dark:text-gray-200
        "
      />

      {/* Title */}
      <h3
        className="
          relative text-2xl sm:text-3xl font-bold mt-3
          text-gray-800 dark:text-gray-200
        "
      >
        Need Support?
      </h3>

      {/* Description */}
      <p
        className="
          relative mb-5 max-w-md leading-relaxed mt-2
          text-gray-600 dark:text-gray-400
        "
      >
        We’re here 24/7 to help with orders, payments, or technical issues.
      </p>

      {/* Button */}
      <button
        onClick={() => router.push("/user/support")}
        className="
          relative px-8 py-3 font-semibold rounded-full 
          transition-all duration-300

          /* Neutral Button */
          bg-gray-800 text-white 
          hover:bg-gray-700

          /* Dark Mode Button */
          dark:bg-gray-200 dark:text-black
          dark:hover:bg-gray-300

          shadow-md hover:shadow-lg
        "
      >
        Contact Support
      </button>
    </div>
  );
}
