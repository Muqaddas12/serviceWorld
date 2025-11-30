import ClientPage from "./ClientPage";
import { getProvidersAction } from "@/lib/providerActions";

export default async function Page(){
  const provider=await getProvidersAction()
  return (
    <>
    <ClientPage provider={provider}/>
    </>
  )
}