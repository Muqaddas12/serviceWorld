import {
  FaClipboardList,
  FaClock,
  FaBolt,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from "react-icons/fa";

/* Neutral Gray Icons */
const STATUS_ICONS = {
  Pending: <FaClock className="inline mr-1 text-gray-500 dark:text-gray-300" />,
  Completed: <FaCheckCircle className="inline mr-1 text-green-500 dark:text-green-400" />,
  Processing: (
    <FaSpinner className="inline animate-spin mr-1 text-gray-500 dark:text-gray-300" />
  ),
  Canceled: <FaTimesCircle className="inline mr-1 text-red-400 dark:text-red-400" />,
  Partial: <FaBolt className="inline mr-1 text-yellow-500 dark:text-yellow-400" />,
  Inprogress: <FaLayerGroup className="inline mr-1 text-gray-400 dark:text-gray-300" />,
};

export default function OrderFilter({ statusFilter, handleStatusFilter }) {
  const statuses = ["All", "Pending", "Processing", "Completed", "Partial"];

  return (
    <div className="mb-6 flex gap-2 flex-wrap justify-center sm:justify-start">
      {statuses.map((status) => {
        const isActive = statusFilter === status;

        return (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`
              px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 
              transition-all duration-300 border

              ${
                isActive
                  ? "bg-gray-300 dark:bg-gray-700 border-gray-500 dark:border-gray-500 text-gray-900 dark:text-gray-200 shadow-sm"
                  : "bg-gray-200 dark:bg-[#1A1F2B] border border-gray-300 dark:border-[#2B3143] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }
            `}
          >
            {STATUS_ICONS[status] || (
              <FaClipboardList className="text-gray-500 dark:text-gray-300" />
            )}
            {status}
          </button>
        );
      })}
    </div>
  );
}
