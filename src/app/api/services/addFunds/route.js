import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { payment_type, utr, payment_amount } = body;

    // Build the form params
    const params = new URLSearchParams();
    params.append("payment_type", payment_type);
    params.append("utr", utr);
    params.append("payment_amount", payment_amount);

    // Send POST to external API
    const res = await axios.post("https://www.instantsmmboost.com/addfunds", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    
    return new Response(res.data, { status: 200 });
  } catch (error) {
    console.error("Error sending form:", error);
    return Response.json(
      { error: error.message || "Failed to send form" },
      { status: 500 }
    );
  }
}
