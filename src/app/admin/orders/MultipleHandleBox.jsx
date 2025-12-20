"use client";
import { resendMultipleOrderAction, updateMultipleOrderStatus,MultipleCancelWithRefund } from "@/lib/ordersAdmin";
import { useState } from "react";

export default function MultipleHandleBox({ selectedRows = [] }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [open, setOpen] = useState(false); // popup state

  // 🔄 Update Status
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const res = await updateMultipleOrderStatus(selectedRows, status);
      alert(res.message);
      setOpen(false);
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend Orders
  const handleResendOrders = async () => {
    try {
      setLoading(true);
      const res = await resendMultipleOrderAction(selectedRows);
      alert(res.message);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };
  const HandleCancelWithRefund=async()=>{
    const res=await MultipleCancelWithRefund(selectedRows)
    if(res.status){
      alert(res.message)
      return
    }
    alert(res.message)



  }


  if (!selectedRows.length) return null;

  return (
    <>
      {/* ACTION BAR */}
      <div className="flex justify-end gap-3 w-full p-4 border rounded-xl dark:bg-gray-900">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading?'Updating':'Update Status'}
        </button>
       <button
  onClick={HandleCancelWithRefund}
  disabled={loading}
  className={`px-4 py-2 rounded-lg text-white
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
  `}
>
  {loading ? "Cancelling..." : "Cancel With Refund"}
</button>


        <button
          onClick={handleResendOrders}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Resend Orders"}
        </button>
      </div>

      {/* POPUP */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#151517] rounded-xl p-6 w-80 space-y-4">

            <h3 className="text-lg font-semibold">Update Order Status</h3>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 dark:bg-[#0f0f11]"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
             

              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Confirm"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
