'use server'
import TicketsPage from "./Tickets";
import { getAllTickets } from "@/lib/adminServices";

export default async function Page(){
  const tickets= await getAllTickets()
  console.log(tickets)
  return (
    <>
    <TicketsPage tickets={tickets.tickets}/>
    </>
  )
}