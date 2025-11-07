'use server'

import DashboardOverview from "./DashboardOverview";
import Loader from "../components/Loader";
import { getUserDetails } from "@/lib/userActions";
import { getWebsiteSettings } from "@/lib/adminServices";

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
