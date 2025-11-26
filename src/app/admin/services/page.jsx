'use server'
import { getServices } from "@/lib/services";
import ServicesPage from "./ServicesPage";
import { GetServicesAction } from "@/lib/customservices";
export default async function Services() {
const services=await getServices()

const customservices= await GetServicesAction()
const Allservices=[
   ...customservices,
  ...services,
 
]

  return (
   <>
   <ServicesPage services={Allservices}/>
   </>
  );
}
