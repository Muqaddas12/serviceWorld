"use client";

import { motion } from "framer-motion";
import Footer from "../user/components/Footer";
import Header from "../user/components/Header";

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
    exampleResponse: `[
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
]`,
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
    exampleResponse: `{
  "order": 23501
}`,
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
    exampleResponse: `{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "USD"
}`,
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
    exampleResponse: `{
  "balance": "100.84292",
  "currency": "USD"
}`,
  },
];

export default function APIDocsPage() {
  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-200 py-12 px-4 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center text-indigo-700 mb-8"
        >
           API Documentation
        </motion.h1>

        {apiDocs.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl shadow-md p-6 md:p-8 flex flex-col gap-4"
          >
            <h2 className="text-2xl font-semibold text-indigo-600">{doc.title}</h2>
            <p className="text-gray-700">{doc.description}</p>

            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <span className="font-semibold text-gray-800">HTTP Method:</span>
              <span className="text-white bg-indigo-500 px-2 py-1 rounded">{doc.method}</span>
              <span className="font-semibold text-gray-800">URL:</span>
              <span className="text-gray-600 break-all">{doc.url}</span>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mt-2">Parameters:</h3>
              <ul className="list-disc list-inside text-gray-700">
                {doc.parameters.map((param, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{param.name}:</span> {param.description}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mt-2">Example Response:</h3>
              <pre className="bg-gray-100 p-4 rounded-xl overflow-x-auto text-sm text-gray-800">{doc.exampleResponse}</pre>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
}
