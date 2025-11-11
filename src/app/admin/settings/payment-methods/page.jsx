"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPaymentMethods } from "@/lib/adminServices";
import PaymentMethodPopupModal from "./PaymentMethodPopupModal";
export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null); // 👈 For popup
 
  const router = useRouter();

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await getAllPaymentMethods();
        console.log(res)
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
    <div className="min-h-screen bg-[#0e0e0f] p-6 text-gray-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          Payment Methods
        </h1>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {methods.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-10">
              No payment methods found.
            </p>
          ) : (
            methods.map((method) => (
              <div
                key={method._id}
                className="bg-[#151517] border border-yellow-500/20 rounded-2xl shadow p-5 flex flex-col items-center transition hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]"
              >
                 <div className="flex items-center gap-2">
  <h2 className="text-lg font-bold text-yellow-400">{method.type}</h2>
  <span
    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
      method.active
        ? "bg-green-500/20 text-green-400 border border-green-500/30"
        : "bg-red-500/20 text-red-400 border border-red-500/30"
    }`}
  >
    {method.active ? "Active" : "Inactive"}
  </span>
</div>

                <p className="text-gray-400 text-sm mb-2 text-center">
                  Merchant ID:{" "}
                  <span className="font-medium text-gray-300">
                    {method.merchantId}
                  </span>
                </p>

                {method.qrImage && (
                  <img
                    src={method.qrImage}
                    alt={`${method.type} QR`}
                    className="w-32 h-32 object-contain mb-4 rounded-lg border border-yellow-500/20"
                  />
                )}

                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 py-2 rounded-xl font-semibold hover:bg-yellow-500/20 hover:shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all"
                    onClick={() => setSelectedMethod(method)} // 👈 Show popup
                  >
                    View
                  </button>
                  <button
                    className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 py-2 rounded-xl font-semibold hover:bg-yellow-500/20 hover:shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all"
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
