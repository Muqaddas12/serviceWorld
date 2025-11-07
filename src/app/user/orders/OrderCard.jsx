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

const STATUS_STYLES = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Completed: "bg-green-500/20 text-green-400",
  Processing: "bg-blue-500/20 text-blue-400",
  Canceled: "bg-red-500/20 text-red-400",
  Partial: "bg-orange-500/20 text-orange-400",
  Inprogress: "bg-purple-500/20 text-purple-400",
};

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
    <div className="bg-[#151517] p-5 rounded-2xl border border-yellow-500/20 shadow-md hover:shadow-yellow-500/10 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold flex items-center gap-2 truncate text-yellow-400">
          <FaClipboardList /> Order #{order._id}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            STATUS_STYLES[order.status] || "bg-gray-700 text-gray-300"
          }`}
        >
          {STATUS_ICONS[order.status] || ""} {order.status || "Pending"}
        </span>
      </div>

      <div className="space-y-2 text-gray-300 text-sm">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-yellow-400" />
          <span>
            <span className="font-medium text-gray-200">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaLayerGroup className="text-yellow-400" />
          <span>
            <span className="font-medium text-gray-200">Service:</span>{" "}
            {order.serviceName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaLink className="text-yellow-400" />
          <a
            href={order.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 hover:underline truncate max-w-[220px]"
          >
            {order.link}
          </a>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaLayerGroup className="text-yellow-400" />
            <span>
              <span className="font-medium text-gray-200">Qty:</span>{" "}
              {order.quantity}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaRupeeSign className="text-green-400" />
            <span className="font-semibold text-green-400">{order.charge}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaBolt className="text-yellow-400" />
          <span>
            <span className="font-medium text-gray-200">Start:</span>{" "}
            {order.startCount || "-"} |{" "}
            <span className="font-medium text-gray-200">Remains:</span>{" "}
            {order.remains || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
