import { getBalance } from "@/lib/services";

export async function GET() {
  try {
    const bal = await getBalance();

    console.log("User Balance:", bal);

    return new Response(
      JSON.stringify({ success: true, balance: bal }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error fetching balance:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
