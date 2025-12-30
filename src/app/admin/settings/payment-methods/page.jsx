"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPaymentMethods } from "@/lib/adminServices";
import PaymentMethodPopupModal from "./PaymentMethodPopupModal";
import AddPaymentTypePage from "./add/page";

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null); // 👈 For popup
const [isOpen,setIsOpen]=useState(false)
  const router = useRouter();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await getAllPaymentMethods();
        console.log(res);
        setMethods(
          res.methods.map((m) => ({
            ...m,
            qrImage: m.qrImage ? `data:image/png;base64,${m.qrImage}` : null,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-200">
  {isOpen && (
  <div className="fixed inset-0 z-50 flex  justify-center">
    {/* Close button */}
    <button
      onClick={() => setIsOpen(false)}
      className="absolute top-4 right-4 text-xl font-bold text-red hover:text-black"
      aria-label="Close"
    >
      ✕
    </button>

    <AddPaymentTypePage />
  </div>
)}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">
          Payment Methods
        </h1>
        <h1 className="rounded-full border p-3 bg-gray-500 font-white text-white cursor-pointer" onClick={()=>setIsOpen(!isOpen)}>Add New</h1>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-gray-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {methods.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">
              No payment methods found.
            </p>
          ) : (
            methods.map((method) => (
              <div
                key={method._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm dark:shadow-none p-5 flex flex-col items-center transition hover:shadow-md dark:hover:shadow-[0_0_12px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{method.type}</h2>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      method.active
                        ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                        : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                    }`}
                  >
                    {method.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 text-center">
                  Merchant ID:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-100">{method.merchantId}</span>
                </p>

                {method.qrImage && (
                  <img
                    src={method.qrImage}
                    alt={`${method.type} QR`}
                    className="w-32 h-32 object-contain mb-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                )}

                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    onClick={() => setSelectedMethod(method)} // 👈 Show popup
                  >
                    View
                  </button>
                  <button
                    className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 py-2 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    onClick={() =>
                      router.push(
                        `/admin/settings/payment-methods/${method._id}/edit`
                      )
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Popup Modal */}
      <PaymentMethodPopupModal
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
      />
    </div>
  );
}
