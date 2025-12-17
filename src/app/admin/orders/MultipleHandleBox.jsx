"use client";

export default function MultipleHandleBox({ selectedRows = [] }) {
  const handleUpdateStatus = () => {
    console.log("Update Status clicked");
    console.log("Selected Orders:", selectedRows);
  };

  const handleResendOrders = () => {
    console.log("Resend Orders clicked");
    console.log("Selected Orders:", selectedRows);
  };

  if (!selectedRows.length) return null; // hide if nothing selected

  return (
   <div className="flex justify-end w-full">

      <div className="flex gap-3 bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-lg rounded-xl px-4 py-3">
       

        <button
          onClick={handleUpdateStatus}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Update Status
        </button>

        <button
          onClick={handleResendOrders}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Resend Orders
        </button>
      </div>
    </div>
  );
}
