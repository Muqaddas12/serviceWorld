'use server'

import TicketSupport from "./TicketSupport";
import { getUserTickets } from "@/lib/adminServices";

export default async function SupportPage() {
  // 🧠 Fetch user-specific tickets using the JWT in cookies
  const result = await getUserTickets();
  const tickets = result?.success ? result.tickets : [];

  console.log("🎫 Tickets fetched:", tickets.length);

  // ✅ Pass tickets into client component
  return <TicketSupport tickets={tickets} />;
}
