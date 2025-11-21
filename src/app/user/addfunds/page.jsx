
"use server";
import AddFund from "./AddFund";
import { getAllPaymentMethods } from "@/lib/adminServices";
import { getUserTransactions } from "@/lib/userActions";

export default async function AddFundsPage() {
  const paymentMethods = await getAllPaymentMethods();

  // FIX #2 — always guard against null
  const { transactions = [] } = (await getUserTransactions()) || {};

  return (
    <AddFund
      paymentMethods={paymentMethods?.methods || []}
      transactions={transactions}
    />
  );
}
