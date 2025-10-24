//api/services//getservices/route.js
import { getServices } from "@/lib/services";

export async function GET(request){
    const services= await getServices()
    console.log(services)
    return Response.json(services)
}