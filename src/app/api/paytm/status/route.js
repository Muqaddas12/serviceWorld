import PaytmChecksum from "@/lib/paytmChecksum";
import { paytmConfig } from "../../../../../config/paytm.config";

export async function POST(req) {
  const { orderId } = await req.json();

  const body = { mid: paytmConfig.mid, orderId };

  const signature = await PaytmChecksum.generateSignature(body, paytmConfig.key);

  const response = await fetch("https://securegw.paytm.in/v3/order/status", {
    method: "POST",
    body: JSON.stringify({ body, head: { signature } }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return Response.json(data);
}
