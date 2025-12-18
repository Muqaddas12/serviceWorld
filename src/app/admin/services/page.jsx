'use server'
import {  deleteAllServices, getCategories, getServices } from "@/lib/services";
import ServicesPage from "./ServicesPage";
import { getPaymentHistory } from "@/lib/userActions";

export default async function Services() {
const services=await getServices()
const category=await getCategories()
const data=await getPaymentHistory()
console.log(category)
  return (
   <>
   <ServicesPage services={services.plain} category={category?.data}/>
   </>
  );
}
