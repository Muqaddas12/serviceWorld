export default function PaymentMethodPopupModal({ selectedMethod, setSelectedMethod }) {
  if (!selectedMethod) return null; // no modal if nothing is selected

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#151517] border border-yellow-500/30 rounded-2xl p-6 w-[92%] sm:w-[500px] md:w-[700px] relative shadow-xl">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-yellow-400 text-xl"
          onClick={() => setSelectedMethod(null)}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6 text-center">
          {selectedMethod.type} Details
        </h2>

        {/* Grid Layout — Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Details */}
          <div className="space-y-3 text-sm md:text-base">
            {/* Active / Inactive */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-semibold">Status:</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  selectedMethod.active
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {selectedMethod.active ? "Active" : "Inactive"}
              </span>
            </div>

            <p>
              <span className="text-yellow-400 font-semibold">Name:</span>{" "}
              {selectedMethod.Name || "N/A"}
            </p>

            <p>
              <span className="text-yellow-400 font-semibold">Merchant ID:</span>{" "}
              {selectedMethod.merchantId || "N/A"}
            </p>

            <p>
              <span className="text-yellow-400 font-semibold">Token:</span>{" "}
              {selectedMethod.token || "N/A"}
            </p>

            <p>
              <span className="text-yellow-400 font-semibold">Type:</span>{" "}
              {selectedMethod.type || "N/A"}
            </p>

            <p>
              <span className="text-yellow-400 font-semibold">Updated At:</span>{" "}
              {selectedMethod.updatedAt
                ? new Date(selectedMethod.updatedAt).toLocaleString()
                : "N/A"}
            </p>

            <div>
              <span className="text-yellow-400 font-semibold block mb-1">
                Instruction:
              </span>
              <p className="text-gray-300 whitespace-pre-line bg-[#0e0e0f] border border-yellow-500/20 rounded-lg p-3 text-sm">
                {selectedMethod.instruction || "N/A"}
              </p>
            </div>
          </div>

          {/* Right: QR Image */}
          <div className="flex flex-col items-center justify-center space-y-3">
            {selectedMethod.qrImage ? (
              <>
                <h3 className="text-yellow-400 font-semibold">QR Code</h3>
                <img
                  src={selectedMethod.qrImage}
                  alt="QR Code"
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain rounded-lg border border-yellow-500/30 shadow-md cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(selectedMethod.qrImage, "_blank")}
                />
                <p className="text-gray-400 text-xs text-center">
                  Click QR to open full size
                </p>
              </>
            ) : (
              <div className="text-gray-500 italic">No QR image available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
