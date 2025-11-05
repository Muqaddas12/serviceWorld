'use server'

import DashboardOverview from "./DashboardOverview";
import Loader from "../components/Loader";
import { getUserDetails } from "@/lib/userActions";


export default async function DashboardPage() {
    const user=await getUserDetails()
    return (
      <>
        <DashboardOverview user={user} />
    

      </>
    );
}
