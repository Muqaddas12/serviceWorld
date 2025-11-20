'use server'

import DashboardOverview from "./DashboardOverview";

import { getUserDetails } from "@/lib/userActions";
import { getWebsiteSettings } from "@/lib/adminServices";
import { getUserOrders } from "@/lib/userActions";

export default async function DashboardPage() {
    const user=await getUserDetails()
  const data = await getWebsiteSettings();
  const result=await JSON.parse(data.plainsettings)
  const orderCount= await getUserOrders()
  console.log(orderCount)

  
    return (
      <>
        <DashboardOverview user={user} serviceEnabled={result.servicesEnabled} />
    

      </>
    );
}
