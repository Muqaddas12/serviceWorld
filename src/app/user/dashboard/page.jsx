'use server';

import DashboardOverview from "./DashboardOverview";
import { getUserDetails, getUserOrders } from "@/lib/userActions";
import { getWebsiteSettings, getAllOrdersAction } from "@/lib/adminServices";

export default async function DashboardPage() {
  const [
    userOrdersRes,
    user,
    settingsRes,
    ordersRes,
  ] = await Promise.all([
    getUserOrders(),
    getUserDetails(),
    getWebsiteSettings(),
    getAllOrdersAction(),
  ]);

  const settings = JSON.parse(settingsRes.plainsettings);

  const spent = userOrdersRes.orders.reduce(
    (acc, o) => acc + Number(o.charge || 0),
    0
  );

  return (
    <>
      <DashboardOverview
        user={user}
        serviceEnabled={settings.servicesEnabled}
        totalOrders={ordersRes?.count}
        spent={spent}
      />
    </>
  );
}
