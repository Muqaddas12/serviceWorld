"use client";

import { useState } from "react";
import { ShoppingCart, ListOrdered } from "lucide-react";
import OrderForm from "../dashboard/OrderForm"; 

export default function MassOrderPage() {
  const [activeTab, setActiveTab] = useState("massorder");
  const [massText, setMassText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mass order submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-900 dark:text-gray-200 px-6 py-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Mass Order
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quickly place multiple orders or switch to the regular new order mode.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div
          className="
            md:col-span-2
            bg-white dark:bg-[#1A1F2B]
            border border-gray-300 dark:border-[#2B3143]
            rounded-2xl 
            shadow-md dark:shadow-lg dark:shadow-black/20
            p-6
          "
        >

          {/* Tabs */}
          <div className="flex items-center justify-center mb-6 space-x-4">

            {/* NEW ORDER TAB */}
            <button
              onClick={() => setActiveTab("neworder")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                transition
                ${
                  activeTab === "neworder"
                    ? "bg-gray-800 dark:bg-gray-700 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>New Order</span>
            </button>

            {/* MASS ORDER TAB */}
            <button
              onClick={() => setActiveTab("massorder")}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition
                ${
                  activeTab === "massorder"
                    ? "bg-gray-800 dark:bg-gray-700 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <ListOrdered className="w-5 h-5" />
              <span>Mass Order</span>
            </button>

          </div>

          {/* CONTENT SWITCHER */}
          {activeTab === "massorder" ? (
            /* MASS ORDER FORM */
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label
                  htmlFor="mass"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  One order per line in format:
                </label>

                <textarea
                  id="mass"
                  name="mass"
                  rows={10}
                  value={massText}
                  onChange={(e) => setMassText(e.target.value)}
                  placeholder="Service ID | Quantity | Link"
                  className="
                    w-full p-3 rounded-lg
                    bg-gray-100 dark:bg-[#0F1117]
                    border border-gray-300 dark:border-[#2B3143]
                    text-gray-900 dark:text-gray-200
                    placeholder-gray-500 dark:placeholder-gray-500
                    focus:outline-none 
                    focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full py-3 rounded-lg font-semibold 
                  bg-gray-800 dark:bg-gray-700 
                  text-white
                  hover:bg-gray-700 dark:hover:bg-gray-600
                  transition shadow-md
                "
              >
                Submit
              </button>

            </form>

          ) : (
            /* NEW ORDER FORM */
            <OrderForm />
          )}
        </div>

        {/* RIGHT SIDE PANEL */}
        <div
          className="
            bg-white dark:bg-[#1A1F2B]
            border border-gray-300 dark:border-[#2B3143]
            rounded-2xl
            p-6 shadow-md dark:shadow-lg
            flex flex-col gap-4
          "
        >
          {activeTab === "massorder" ? (
            <>
              {/* MASS ORDER INSTRUCTIONS */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Format Guide
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Each line must follow this structure:
              </p>

              <div className="bg-gray-100 dark:bg-[#0F1117] p-3 rounded-lg border border-gray-300 dark:border-[#2B3143]">
                <code className="text-sm">
                  SERVICE_ID <span className="text-gray-500">|</span> QUANTITY{" "}
                  <span className="text-gray-500">|</span> LINK
                </code>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Example:
              </p>

              <div className="bg-gray-100 dark:bg-[#0F1117] p-3 rounded-lg border border-gray-300 dark:border-[#2B3143] text-sm">
                1020 | 500 | https://instagram.com/p/xyz  
                <br />
                2055 | 1000 | https://youtu.be/abcd
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                ✔ One order per line  
                ✔ Quantity must be within Min–Max  
                ✔ Use full & correct link  
              </p>
            </>
          ) : (
            <>
              {/* NEW ORDER INFORMATION BOX */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                How New Order Works
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fill out the service, quantity, and link to create a single order.
              </p>

              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2 mt-2">
                <li>Select a service from the dropdown.</li>
                <li>Enter the link correctly (post, video, profile, etc.).</li>
                <li>Quantity must be within the allowed Min–Max.</li>
                <li>You can place unlimited single orders.</li>
              </ul>

              <div className="mt-3 p-3 rounded-lg bg-gray-100 dark:bg-[#0F1117] border border-gray-300 dark:border-[#2B3143]">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Tip: Use Mass Order when placing 5+ orders to save time.
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
