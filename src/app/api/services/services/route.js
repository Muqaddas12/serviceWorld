import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    // Read query params (if needed)
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action !== "services") {
      return Response.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Connect DB
    const client = await clientPromise;
    const db = client.db("smmpanel");
    const servicesCollection = db.collection("services");

    // Fetch services from DB
    const services = await servicesCollection.find({}).toArray();

    return Response.json({
      success: true,
      services,
    });

  } catch (err) {
    console.error("API /services Error:", err);
    return Response.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}
