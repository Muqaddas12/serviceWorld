'use server';

import OrdersPage from "./OrderPage";
import { getAllOrdersAction } from "@/lib/adminServices";
export default async function Page() {
  const data = await getAllOrdersAction();

const ordersJson=JSON.stringify(data?.orders)

  // ✅ Orders exist → render page
  return <OrdersPage sorders={ordersJson} />;
}
