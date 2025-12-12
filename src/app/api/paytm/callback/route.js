import PaytmChecksum from "@/lib/paytmChecksum";
import { paytmConfig } from "../../../../../config/paytm.config";

export async function POST(req) {
  const jsonBody = await req.json();

  const checksum = jsonBody.CHECKSUMHASH;
  delete jsonBody.CHECKSUMHASH;

  const isValid = PaytmChecksum.verifySignature(
    jsonBody,
    paytmConfig.key,
    checksum
  );

  if (!isValid) {
    return Response.json({ success: false, message: "Invalid checksum" });
  }

  // Check txn status
  if (jsonBody.STATUS === "TXN_SUCCESS") {
    // update DB: order paid
  }

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment?status=${jsonBody.STATUS}`
  );
}
