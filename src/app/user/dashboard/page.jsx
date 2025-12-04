'use server'

import DashboardOverview from "./DashboardOverview";

import { getOrderStatus, getUserDetails, updateProviderForOrders } from "@/lib/userActions";
import { getWebsiteSettings } from "@/lib/adminServices";
import { getAllOrdersAction } from "@/lib/adminServices";

export default async function DashboardPage() {
    const user=await getUserDetails()
  const data = await getWebsiteSettings();
  const result=await JSON.parse(data.plainsettings)

    return (
      <>
        <DashboardOverview user={user} serviceEnabled={result.servicesEnabled} />
    

      </>
    );
}
