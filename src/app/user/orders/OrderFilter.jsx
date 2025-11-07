import { FaClipboardList, FaClock, FaBolt, FaSpinner, FaCheckCircle, FaTimesCircle, FaLayerGroup } from "react-icons/fa";

const STATUS_ICONS = {
  Pending: <FaClock className="inline mr-1" />,
  Completed: <FaCheckCircle className="inline mr-1" />,
  Processing: <FaSpinner className="inline animate-spin mr-1" />,
  Canceled: <FaTimesCircle className="inline mr-1" />,
  Partial: <FaBolt className="inline mr-1" />,
  Inprogress: <FaLayerGroup className="inline mr-1" />,
};

export default function OrderFilter({ statusFilter, handleStatusFilter }) {
  const statuses = ["All", "Pending", "Processing", "Completed", "Partial"];

  return (
    <div className="mb-6 flex gap-2 flex-wrap justify-center sm:justify-start">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => handleStatusFilter(status)}
          className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 border transition-all duration-300 ${
            statusFilter === status
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40 scale-[1.05]"
              : "bg-[#151517] border border-yellow-500/10 text-gray-300 hover:border-yellow-500/30"
          }`}
        >
          {STATUS_ICONS[status] || <FaClipboardList />} {status}
        </button>
      ))}
    </div>
  );
}
