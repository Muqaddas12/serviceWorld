'use server'
import { getChildPanelSettings } from "@/lib/adminServices";
import ChildPanelPageClient from "./ChildPanelPageClient";
import { getAllPaymentMethods } from "@/lib/adminServices";
import { getUserBalance } from "@/lib/userActions";
import { getUserChildPanels } from "@/lib/userActions";
export default async function Page() {
  const settings = await getChildPanelSettings();
  const payment_methods= await getAllPaymentMethods()
  const result= await getUserBalance()
const panels=await getUserChildPanels()
console.log(panels) 

  return <ChildPanelPageClient settings={settings} paymentMethods={payment_methods} balance={result.balance} panels={panels.requests} />;
}
