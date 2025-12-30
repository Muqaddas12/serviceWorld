"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { putPaymentMethodDetails } from "@/lib/adminServices";

export default function AddPaymentTypePage() {
  const router = useRouter();

  const [type, setType] = useState("bharatpe");
  const [merchantId, setMerchantId] = useState("");
  const [token, setToken] = useState("");
  const [saltKey, setSaltKey] = useState("");
  const [saltIndex, setSaltIndex] = useState("");
  const [Name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [qrFile, setQrFile] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!qrFile) {
      setMessage("❌ Please upload QR image");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(qrFile);

    reader.onloadend = async () => {
      const qrBase64 = reader.result.split(",")[1];

      const payload = {
        merchantId,
        token,
        Name,
        instruction,
        qrBase64,
        ...(type === "phonepe" && { saltKey, saltIndex }),
      };

      try {
        const res = await putPaymentMethodDetails(type, payload);

        if (res.success) {
          setMessage("✅ Payment method saved");
          setTimeout(() => router.refresh(), 1200);
        } else {
          setMessage("❌ " + (res.error || "Failed"));
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Server error");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
      <h2 className="text-xl font-bold mb-6 text-center">Add Payment Method</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Dropdown */}
        <div>
          <label className="font-semibold">Payment Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="bharatpe">BharatPe</option>
            <option value="phonepe">PhonePe</option>
          </select>
        </div>

        <input
          placeholder="Display Name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />

        <input
          placeholder="Merchant ID"
          value={merchantId}
          onChange={(e) => setMerchantId(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />

        <input
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />

        {/* PhonePe Only */}
        {type === "phonepe" && (
          <>
            <input
              placeholder="Salt Key"
              value={saltKey}
              onChange={(e) => setSaltKey(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
            <input
              placeholder="Salt Index"
              value={saltIndex}
              onChange={(e) => setSaltIndex(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
          </>
        )}

        <textarea
          placeholder="Instruction"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setQrFile(e.target.files[0])}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {message && (
        <p className="text-center mt-4 font-medium">{message}</p>
      )}
    </div>
  );
}
