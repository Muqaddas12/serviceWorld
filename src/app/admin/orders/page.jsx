'use server';

import OrdersPage from "./OrderPage";
import { getAllOrdersAction } from "@/lib/adminServices";

export default async function Page() {
  const data = await getAllOrdersAction();

  // ❌ If failed, no orders, or empty array → show message
  if (!data?.success || !data.orders || data.orders.length === 0) {
    return (
      <div className="w-full text-center py-10 text-gray-500 text-lg">
        No orders found.
      </div>
    );
  }

  // ✅ Orders exist → render page
  return <OrdersPage orders={data.orders} />;
}
