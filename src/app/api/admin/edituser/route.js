import { verifyAdmin } from "@/lib/adminMiddleware";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function POST(req) {
//   const admin = verifyAdminToken(req);
//   if (!admin) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return new Response(JSON.stringify({ error: "User ID is required" }), { status: 400 });

  const data = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("mydb");

    // Optional: prevent changing sensitive fields like _id
    delete data._id;

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Nothing was updated" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
