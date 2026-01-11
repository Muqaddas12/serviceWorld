import { MdShoppingCart, MdInfoOutline } from "react-icons/md";
import { useState } from "react";
import ServiceDetailsPopup from "./ServiceDetailsPopup";
import { useCurrency } from "@/context/CurrencyContext";

export default function ServiceCard({ service, getIconForService, onSelect }) {
  const [showDetails, setShowDetails] = useState(false);

  const { symbol, convert } = useCurrency();

  const formattedRate = (() => {
    const num = Number(service.rate || 0);
    return convert(num).toFixed(2);
  })();

  return (
    <div
      className="
        bg-white dark:bg-[#1A1F2B]
        border border-gray-300 dark:border-[#2B3143]
        rounded-2xl 
        p-5 
        transition-all duration-300
        hover:border-gray-400 dark:hover:border-gray-500
        hover:shadow-md
      "
    >
      {/* Popup */}
      {showDetails && (
        <ServiceDetailsPopup
          service={service}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* Top Section */}
      <div className="flex items-center gap-3 mb-3">
        {getIconForService(service.name)}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {service.name}
        </h3>
      </div>

      {/* Details */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        <strong className="text-gray-800 dark:text-gray-200">ID:</strong> {service.id}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        <strong className="text-gray-800 dark:text-gray-200">Rate / 1K:</strong> 
        {" "}{symbol}{formattedRate}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        <strong className="text-gray-800 dark:text-gray-200">Min:</strong> {service.min}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        <strong className="text-gray-800 dark:text-gray-200">Max:</strong> {service.max}
      </p>

      {/* FULL-WIDTH BUTTONS */}
      <div className="flex flex-row gap-3 mt-4">

        {/* DETAILS BUTTON */}
        <button
          onClick={() => setShowDetails(true)}
          className="
            w-full py-2 px-2 rounded-lg
            bg-gray-200 dark:bg-gray-700
            text-gray-800 dark:text-gray-200
            font-semibold
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition shadow-sm
            flex items-center justify-center gap-2
          "
        >
          <MdInfoOutline size={18} />
          Details
        </button>

        {/* BUY NOW BUTTON */}
        <button
          onClick={() => onSelect(service)}
          className="
            w-full py-2 px-2 rounded-lg
            bg-gray-800 dark:bg-gray-700
            text-white 
            font-semibold
            hover:bg-gray-700 dark:hover:bg-gray-600
            transition shadow-sm
            flex items-center justify-center gap-2
          "
        >
          <MdShoppingCart size={20} />
          Buy Now
        </button>

      </div>
    </div>
  );
}
