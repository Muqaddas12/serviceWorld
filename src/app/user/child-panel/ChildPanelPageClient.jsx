"use client";

import { useState, useTransition } from "react";
import { FaGlobe, FaCoins, FaUsers, FaUserLock } from "react-icons/fa";
import { createChildPanel } from "@/lib/adminServices";

export default function ChildPanelPageClient({ settings, paymentMethods }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const price = settings?.price || "₹800";
  const adminDomain = settings?.domain || "yourpaneldomain.com";

  const [subdomain, setSubdomain] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [utr, setUtr] = useState("");

  const handleDomainChange = (e) => {
    let value = e.target.value.trim();

    if (value.endsWith("." + adminDomain)) {
      value = value.replace("." + adminDomain, "");
    }

    value = value.replace(/[^a-zA-Z0-9-]/g, "");
    setSubdomain(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.set("domain", `${subdomain}.${adminDomain}`);

    startTransition(async () => {
      const res = await createChildPanel({
        formData,
        payment_amount: paymentAmount,
        utr,
        payment_type: paymentType,
      });

      if (res.error) setMessage("❌ " + res.error);
      else setMessage("✔ " + res.message);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0F1117] text-gray-900 dark:text-gray-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create Your Child Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill out the details below to generate your own SMM child panel.
          </p>
        </div>

        {/* Form Container */}
        <div
          className="
            bg-white dark:bg-[#1A1F2B]
            border border-gray-300 dark:border-[#2B3143]
            rounded-2xl p-6 shadow-md dark:shadow-lg
          "
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Panel Details
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Domain */}
            <div>
              <label className="block mb-1 font-semibold">Subdomain</label>
              <div className="relative">
                <input
                  type="text"
                  name="subdomain"
                  value={subdomain}
                  onChange={handleDomainChange}
                  placeholder="mypanel"
                  className="
                    w-full bg-gray-100 dark:bg-[#0F1117]
                    border border-gray-300 dark:border-[#2B3143]
                    rounded-lg px-3 py-2 pr-32
                    text-gray-800 dark:text-gray-200
                    focus:outline-none focus:border-gray-500
                  "
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  .{adminDomain}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Full domain:{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {subdomain
                    ? `${subdomain}.${adminDomain}`
                    : `yourpanel.${adminDomain}`}
                </span>
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block mb-1 font-semibold">Currency</label>
              <select
                name="currency"
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:outline-none focus:border-gray-500
                "
              >
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">U.S. Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            {/* Username */}
            <div>
              <label className="block mb-1 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                placeholder="admin123"
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:outline-none focus:border-gray-500
                "
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:outline-none
                "
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:outline-none
                "
                required
              />
            </div>

            {/* Price (readonly) */}
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="text"
                name="price"
                readOnly
                value={price}
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-700 dark:text-gray-300
                "
              />
              <p className="text-xs text-gray-500 mt-1">
                Fixed price set by admin
              </p>
            </div>

        {/* Payment Methods (Dropdown) */}
<div className="md:col-span-2">
  <label className="block mb-1 font-semibold text-gray-800 dark:text-gray-200">
    Select Payment Method
  </label>

  {/* Dropdown */}
  <select
    value={paymentType}
    onChange={(e) => setPaymentType(e.target.value)}
    className="
      w-full bg-gray-100 dark:bg-[#0F1117]
      border border-gray-300 dark:border-[#2B3143]
      rounded-lg px-3 py-2
      text-gray-800 dark:text-gray-200
      focus:outline-none focus:border-gray-500
    "
  >
    <option value="">Select a method</option>

    {paymentMethods.methods.map((m) => (
      <option key={m._id} value={m.type}>
        {m.type}
      </option>
    ))}
  </select>

  {/* Show QR when method is selected */}
  {paymentType && (
    <div className="mt-4 p-4 border border-gray-300 dark:border-[#2B3143] rounded-lg bg-gray-100 dark:bg-[#0F1117]">
      {(() => {
        const selected = paymentMethods.methods.find((pm) => pm.type === paymentType);

        if (!selected) return null;

        return (
          <>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {selected.type} QR Code
            </p>

            {selected.qrImage ? (
              <img
                src={`data:image/png;base64,${selected.qrImage}`}
                className="w-40 border border-gray-300 dark:border-[#2B3143] rounded-lg"
                alt="QR Code"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No QR available</p>
            )}
          </>
        );
      })()}
    </div>
  )}
</div>


            {/* UTR */}
            <div>
              <label className="block mb-1 font-semibold">UTR / Transaction ID</label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:border-gray-500
                "
                placeholder="Enter UTR / reference"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block mb-1 font-semibold">Payment Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="
                  w-full bg-gray-100 dark:bg-[#0F1117]
                  border border-gray-300 dark:border-[#2B3143]
                  rounded-lg px-3 py-2
                  text-gray-800 dark:text-gray-200
                  focus:border-gray-500
                "
                placeholder="Enter paid amount"
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className="
                  w-full py-3 rounded-lg font-semibold
                  bg-gray-800 dark:bg-gray-700 text-white
                  hover:bg-gray-700 dark:hover:bg-gray-600
                  transition
                "
              >
                {isPending ? "Submitting..." : "Submit Order"}
              </button>

              {message && (
                <p
                  className={`text-center mt-3 text-sm ${
                    message.startsWith("✔")
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
