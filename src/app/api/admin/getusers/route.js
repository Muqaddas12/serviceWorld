import { verifyAdmin } from "@/lib/adminMiddleware";
import { getAllUsers } from "@/lib/adminServices";
export async function GET(req) {
  try {
//    await verifyAdmin(req)
    // If token valid, fetch users
    const users = await getAllUsers();

    return new Response(JSON.stringify({ success: true, users }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
