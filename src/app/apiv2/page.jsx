"use client";

import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import Link from "next/link";


export default function APIDocsPage() {
  const { symbol } = useCurrency();

  // 🔥 Auto redirect for Account Link
 
  const accountLink =  "/user/settings" 

  return (
    <div
      className="
      min-h-screen 
      bg-gray-100 text-gray-800
      dark:bg-[#0F1117] dark:text-gray-200
      py-12 px-4 md:px-12
    "
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* PAGE TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            text-4xl md:text-5xl font-bold text-center
            text-gray-800 dark:text-gray-200
          "
        >
          API Documentation
        </motion.h1>

        {/* ============ MAIN API INFO =============== */}
        <section
          className="
          bg-white dark:bg-[#1A1F2B]
          border border-gray-300 dark:border-[#2B3143]
          rounded-2xl p-6 shadow-lg
        "
        >
          <h2 className="text-2xl font-bold mb-4">API Information</h2>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <strong>HTTP Method:</strong> POST
            </p>
            <p>
              <strong>API URL:</strong> https://website.com/api/v2
            </p>
            <p>
              <strong>API Key:</strong> Get an API key on the{" "}
              <Link
                href={accountLink}
                className="underline text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white"
              >
                Account
              </Link>{" "}
              page
            </p>
            <p>
              <strong>Response Format:</strong> JSON
            </p>
          </div>
        </section>

        {/* =================== SERVICE LIST =================== */}
        <Section
          title="Service List"
          description="Retrieve all available services."
          params={[
            ["key", "Your API key"],
            ["action", "`services`"],
          ]}
          response={`[
  {
    "service": 1,
    "name": "Followers",
    "type": "Default",
    "category": "First Category",
    "rate": "0.90",
    "min": "50",
    "max": "10000",
    "refill": true,
    "cancel": true
  },
  {
    "service": 2,
    "name": "Comments",
    "type": "Custom Comments",
    "category": "Second Category",
    "rate": "8",
    "min": "10",
    "max": "1500",
    "refill": false,
    "cancel": true
  }
]`}
        />

        {/* =================== ADD ORDER =================== */}
        <Section
          title="Add Order"
          description="Create a new order."
          params={[
            ["key", "Your API key"],
            ["action", "`add`"],
            ["service", "Service ID"],
            ["quantity", "Number of units"],
            ["link", "Target link"],
          ]}
          response={`{
  "order": 23501
}`}
        />

        {/* ================= ORDER STATUS ================= */}
        <Section
          title="Order Status"
          description="Check the status of an order."
          params={[
            ["key", "Your API key"],
            ["action", "`status`"],
            ["order", "Order ID"],
          ]}
          response={`{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "${symbol}"
}`}
        />

        {/* =============== MULTIPLE ORDER STATUS =============== */}
        <Section
          title="Multiple Orders Status"
          description="Check multiple orders at once."
          params={[
            ["key", "Your API key"],
            ["action", "`status`"],
            ["orders", "Comma-separated Order IDs"],
          ]}
          response={`{
  "1": {
    "charge": "0.27819",
    "start_count": "3572",
    "status": "Partial",
    "remains": "157",
    "currency": "${symbol}"
  },
  "10": { "error": "Incorrect order ID" },
  "100": {
    "charge": "1.44219",
    "start_count": "234",
    "status": "In progress",
    "remains": "10",
    "currency": "${symbol}"
  }
}`}
        />

        {/* ================= CREATE REFILL ================= */}
        <Section
          title="Create Refill"
          description="Request a refill for an order."
          params={[
            ["key", "Your API key"],
            ["action", "`refill`"],
            ["order", "Order ID"],
          ]}
          response={`{
  "refill": "1"
}`}
        />

        {/* ============ MULTIPLE REFILL ============ */}
        <Section
          title="Create Multiple Refill"
          description="Request refill for multiple orders."
          params={[
            ["key", "Your API key"],
            ["action", "`refill`"],
            ["orders", "Multiple Order IDs"],
          ]}
          response={`[
  { "order": 1, "refill": 1 },
  { "order": 2, "refill": 2 },
  { "order": 3, "refill": { "error": "Incorrect order ID" } }
]`}
        />

        {/* ================= REFILL STATUS ================= */}
        <Section
          title="Refill Status"
          description="Check refill status of an order."
          params={[
            ["key", "Your API key"],
            ["action", "`refill_status`"],
            ["refill", "Refill ID"],
          ]}
          response={`{
  "status": "Completed"
}`}
        />

        {/* ============ MULTIPLE REFILL STATUS ============ */}
        <Section
          title="Multiple Refill Status"
          description="Check statuses for multiple refill IDs."
          params={[
            ["key", "Your API key"],
            ["action", "`refill_status`"],
            ["refills", "Comma-separated refill IDs"],
          ]}
          response={`[
  { "refill": 1, "status": "Completed" },
  { "refill": 2, "status": "Rejected" },
  { "refill": 3, "status": { "error": "Refill not found" } }
]`}
        />

        {/* ================= USER BALANCE ================= */}
        <Section
          title="User Balance"
          description="Retrieve your current account balance."
          params={[
            ["key", "Your API key"],
            ["action", "`balance`"],
          ]}
          response={`{
  "balance": "100.84292",
  "currency": "${symbol}"
}`}
        />
      </div>
    </div>
  );
}

/* ========= REUSABLE SECTION COMPONENT ========= */
function Section({ title, description, params, response }) {
  return (
    <div
      className="
      bg-white dark:bg-[#1A1F2B]
      border border-gray-300 dark:border-[#2B3143]
      rounded-2xl p-6 shadow-lg
    "
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>

      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mt-4">
        Parameters:
      </h3>

      <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 mt-2">
        {params.map(([name, desc], i) => (
          <li key={i}>
            <span className="font-medium text-gray-800 dark:text-gray-300">
              {name}:
            </span>{" "}
            {desc}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mt-4">
        Example Response:
      </h3>

      <pre
        className="
        bg-gray-100 dark:bg-[#0F1117]
        p-4 rounded-xl overflow-x-auto text-sm 
        text-gray-800 dark:text-gray-300
        border border-gray-300 dark:border-[#2B3143]
      "
      >
        {response}
      </pre>
    </div>
  );
}
