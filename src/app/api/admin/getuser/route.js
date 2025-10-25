import { verifyAdmin } from "@/lib/adminMiddleware";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET(req) {
//   const admin = verifyAdminToken(req);
//   if (!admin) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });

  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
