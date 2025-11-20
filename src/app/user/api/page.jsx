"use client";

import { motion } from "framer-motion";


const apiDocs = [
  {
    title: "Service List",
    description: "Retrieve all available services.",
    method: "POST",
    url: "xxxxxxxxxxxxxxxx",
    parameters: [
      { name: "key", description: "Your API key" },
      { name: "action", description: "`services`" },
    ],
    exampleResponse: `[ ... ]`,
  },
  {
    title: "Add Order",
    description: "Create a new order using a service.",
    method: "POST",
    url: "xxxxxxxxxxxxxxxx",
    parameters: [
      { name: "key", description: "Your API key" },
      { name: "action", description: "`add`" },
      { name: "service", description: "Service ID" },
      { name: "quantity", description: "Number of units" },
      { name: "link", description: "Target link (e.g., Instagram post)" },
    ],
    exampleResponse: `{ ... }`,
  },
  {
    title: "Order Status",
    description: "Check the status of an order.",
    method: "POST",
    url: "xxxxxxxxxxxxxxxx",
    parameters: [
      { name: "key", description: "Your API key" },
      { name: "action", description: "`status`" },
      { name: "order", description: "Order ID" },
    ],
    exampleResponse: `{ ... }`,
  },
  {
    title: "User Balance",
    description: "Retrieve the current balance of your account.",
    method: "POST",
    url: "xxxxxxxxxxxxxxx",
    parameters: [
      { name: "key", description: "Your API key" },
      { name: "action", description: "`balance`" },
    ],
    exampleResponse: `{ ... }`,
  },
];

export default function APIDocsPage() {
  return (
    <>
     

      <div
        className="
          min-h-screen 
          bg-[#F5F7FA] text-[#1A1A1A]
          dark:bg-[#0F1117] dark:text-white
          py-12 px-4 md:px-12
        "
      >
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              text-4xl md:text-5xl font-bold text-center 
              text-[#4A6CF7] mb-8
            "
          >
            API Documentation
          </motion.h1>

          {/* API Docs List */}
          {apiDocs.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="
                bg-white dark:bg-[#1A1F2B]
                border border-gray-200 dark:border-[#2B3143]
                rounded-3xl p-6 md:p-8 shadow-lg shadow-black/5 dark:shadow-black/20
                flex flex-col gap-4
              "
            >
              {/* Title */}
              <h2 className="text-2xl font-semibold text-[#4A6CF7]">
                {doc.title}
              </h2>

              {/* Description */}
              <p className="text-[#4B5563] dark:text-[#A0AEC3]">
                {doc.description}
              </p>

              {/* Method + URL */}
              <div className="flex flex-col md:flex-row gap-4 mt-2 items-start md:items-center">
                <span className="font-semibold text-[#1A1A1A] dark:text-white">
                  HTTP Method:
                </span>
                <span className="text-white bg-[#4A6CF7] px-2 py-1 rounded">
                  {doc.method}
                </span>

                <span className="font-semibold text-[#1A1A1A] dark:text-white">
                  URL:
                </span>
                <span className="text-[#4B5563] dark:text-[#A0AEC3] break-all">
                  {doc.url}
                </span>
              </div>

              {/* Parameters */}
              <div>
                <h3 className="font-semibold text-[#1A1A1A] dark:text-white mt-2">
                  Parameters:
                </h3>
                <ul className="list-disc list-inside text-[#4B5563] dark:text-[#A0AEC3]">
                  {doc.parameters.map((param, idx) => (
                    <li key={idx}>
                      <span className="font-medium text-[#4A6CF7]">
                        {param.name}:
                      </span>{" "}
                      {param.description}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Example Response */}
              <div>
                <h3 className="font-semibold text-[#1A1A1A] dark:text-white mt-2">
                  Example Response:
                </h3>
                <pre
                  className="
                    bg-gray-100 dark:bg-[#0F1117]
                    p-4 rounded-xl overflow-x-auto text-sm 
                    text-[#1A1A1A] dark:text-[#A0AEC3]
                    border border-gray-200 dark:border-[#2B3143]
                  "
                >
                  {doc.exampleResponse}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

 
    </>
  );
}
