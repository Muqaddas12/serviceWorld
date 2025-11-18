import {
  FaClipboardList,
  FaCalendarAlt,
  FaLayerGroup,
  FaLink,
  FaRupeeSign,
  FaBolt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";

/* ▸ Status Style (Gray Theme) */
const STATUS_STYLES = {
  Pending: "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
  Completed: "bg-green-500/20 text-green-500",
  Processing: "bg-gray-400/30 dark:bg-gray-600/40 text-gray-600 dark:text-gray-300",
  Canceled: "bg-red-500/20 text-red-400",
  Partial: "bg-yellow-500/20 text-yellow-500",
  Inprogress: "bg-purple-500/20 text-purple-400",
};

/* ▸ Status Icons (Neutral Gray) */
const STATUS_ICONS = {
  Pending: <FaClock className="inline mr-1" />,
  Completed: <FaCheckCircle className="inline mr-1" />,
  Processing: <FaSpinner className="inline animate-spin mr-1" />,
  Canceled: <FaTimesCircle className="inline mr-1" />,
  Partial: <FaBolt className="inline mr-1" />,
  Inprogress: <FaLayerGroup className="inline mr-1" />,
};

export default function OrderCard({ order }) {
  return (
    <div
      className="
        bg-white dark:bg-[#1A1F2B] 
        p-5 rounded-2xl 
        border border-gray-300 dark:border-[#2B3143]
        shadow-md dark:shadow-lg 
        hover:shadow-xl transition-all duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold flex items-center gap-2 truncate text-gray-800 dark:text-gray-200">
          <FaClipboardList /> Order #{order._id}
        </h3>

        <span
          className={`
            px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
            ${STATUS_STYLES[order.status] || "bg-gray-200 text-gray-700"}
          `}
        >
          {STATUS_ICONS[order.status] || ""}
          {order.status || "Pending"}
        </span>
      </div>

      {/* Body */}
      <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">

        {/* Date */}
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
          <span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Service */}
        <div className="flex items-center gap-2">
          <FaLayerGroup className="text-gray-500 dark:text-gray-400" />
          <span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Service:</span>{" "}
            {order.serviceName}
          </span>
        </div>

        {/* Link */}
        <div className="flex items-center gap-2">
          <FaLink className="text-gray-500 dark:text-gray-400" />
          <a
            href={order.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:underline truncate max-w-[220px]"
          >
            {order.link}
          </a>
        </div>

        {/* Qty + Charge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaLayerGroup className="text-gray-500 dark:text-gray-400" />
            <span>
              <span className="font-medium text-gray-900 dark:text-gray-100">Qty:</span>{" "}
              {order.quantity}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <FaRupeeSign className="text-green-500 dark:text-green-400" />
            <span className="font-semibold text-green-600 dark:text-green-400">
              {order.charge}
            </span>
          </div>
        </div>

        {/* Start / Remain */}
        <div className="flex items-center gap-2">
          <FaBolt className="text-gray-500 dark:text-gray-400" />
          <span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Start:</span>{" "}
            {order.startCount || "-"}{" "}
            <span className="mx-1">|</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Remains:</span>{" "}
            {order.remains || "-"}
          </span>
        </div>

      </div>
    </div>
  );
}
