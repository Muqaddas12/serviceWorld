'use server'
import {   getCategories, getServices } from "@/lib/services";
import ServicesPage from "./ServicesPage";


export default async function Services() {
const services=await getServices()
const category=await getCategories()


  return (
   <>
   <ServicesPage services={services.plain} category={category?.data}/>
   </>
  );
}
