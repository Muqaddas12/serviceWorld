"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getPaymentMethodDetails, putPaymentMethodDetails } from "@/lib/adminServices";

export default function EditPaymentTypePage() {
  const { id } = useParams();

  const [type, setType] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [token, setToken] = useState("");
  const [active, setActive] = useState(true);
  const [qrImage, setQrImage] = useState(null);
  const [newQrFile, setNewQrFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [Name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [date, setDate] = useState("");

  // ✅ Fetch existing payment details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaymentMethodDetails(id);
        if (res.success) {
          const data = res.method;
          setName(data.Name);
          setInstruction(data.instruction);
          setType(data.type || "");
          setMerchantId(data.merchantId || "");
          setToken(data.token || "");
          setActive(data.active ?? true);
          setQrImage(data.qrImage ? `data:image/png;base64,${data.qrImage}` : null);
          setDate(data.updatedAt);
        } else {
          setMessage(res.error || "Failed to load data");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong while loading data");
      }
    };
    fetchData();
  }, [id]);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let qrBase64 = null;
      if (newQrFile) {
        qrBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (result && result.includes(",")) {
              resolve(result.split(",")[1]);
            } else reject("Invalid QR format");
          };
          reader.onerror = reject;
          reader.readAsDataURL(newQrFile);
        });
      }

      const result = await putPaymentMethodDetails(type, {
        merchantId,
        token,
        active,
        qrBase64,
        instruction,
        Name,
      });

      setMessage(result.success ? "✅ Updated successfully!" : `❌ ${result.error || "Update failed"}`);
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Outer Container */}
      <div className="min-h-screen bg-[#0e0e0f] flex items-center justify-center px-4 sm:px-6 md:px-8 py-8">
        <div className="bg-[#151517] border border-yellow-500/20 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-5xl text-gray-300 relative">

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-8 text-center">
            Edit Payment Method
          </h1>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* ✅ QR Image FIRST on small screens */}
{qrImage && (
  <div className="order-1 lg:order-2 flex flex-col items-center justify-center space-y-4 h-auto lg:h-full">
    <h2 className="text-lg sm:text-xl font-semibold text-yellow-400">
      Current QR Image
    </h2>

    <div className="flex-grow flex items-center justify-center w-full">
      <img
        src={qrImage}
        alt="QR"
        className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[85%] lg:h-[85%] max-h-[500px] object-contain rounded-2xl border border-yellow-500/30 cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() => setShowPopup(true)}
      />
    </div>

    <p className="text-gray-400 text-sm text-center">
      Click the QR to enlarge view
    </p>
  </div>
)}

            {/* ✅ Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4 order-2 lg:order-1">
              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-yellow-400 focus:ring-yellow-400 border-yellow-500/30 bg-[#0e0e0f] rounded"
                />
                <label className="text-gray-300 font-semibold text-sm sm:text-base">
                  Active
                </label>
              </div>

              {/* Upload new QR */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2 text-sm sm:text-base">
                  Upload New QR (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewQrFile(e.target.files[0])}
                  className="w-full text-gray-300 text-sm sm:text-base"
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Payment Type
                </label>
                <input
                  type="text"
                  value={type}
                  readOnly
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Merchant Name */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Merchant ID */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* Token */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Token
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>

              {/* ✅ Instruction (Textarea) */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Instruction
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  rows="4"
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-300 focus:ring-2 focus:ring-yellow-400 resize-none"
                  required
                />
              </div>

              {/* Updated At */}
              <div>
                <label className="block font-semibold text-yellow-400 mb-2">
                  Last Updated
                </label>
                <input
                  type="text"
                  value={date}
                  readOnly
                  className="w-full bg-[#0e0e0f] border border-yellow-500/20 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500/90 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-400/40 transition-all duration-300"
              >
                {loading ? "Updating..." : "Update Payment Method"}
              </button>
            </form>
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`mt-6 text-center font-medium text-sm sm:text-base ${
                message.startsWith("✅") ? "text-green-400" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-[#151517] border border-yellow-500/20 rounded-2xl p-6 shadow-2xl relative max-w-md w-full text-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 text-center">
              QR Preview
            </h2>
            {qrImage && (
              <img
                src={qrImage}
                alt="QR"
                className="w-full h-auto object-contain rounded-lg border border-yellow-500/20"
              />
            )}
            <button
              className="mt-4 w-full bg-yellow-500/90 hover:bg-yellow-400 text-black py-2 rounded-xl font-semibold shadow-md hover:shadow-yellow-400/40 transition-all duration-300"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
