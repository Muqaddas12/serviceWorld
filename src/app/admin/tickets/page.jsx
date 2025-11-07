import { Suspense } from "react";
import Loading from "./loading";
import TicketsPage from "./TicketsPage";
import { getAllTickets } from "@/lib/adminServices";

export default async function Page() {
  const result = await getAllTickets();
  const tickets = result?.success ? result.tickets : [];

  return (
    <Suspense fallback={<Loading />}>
      <TicketsPage tickets={tickets} />
    </Suspense>
  );
}
