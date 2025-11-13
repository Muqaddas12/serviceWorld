'use server'
import { getServices } from "@/lib/services";
import ServicesPage from "./ServicesPage";
export default async function Services({services}) {
const Allservices=await getServices()

  return (
   <>
   <ServicesPage services={Allservices}/>
   </>
  );
}
