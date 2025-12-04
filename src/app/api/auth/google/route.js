import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("smmadmin");

    const config = await db.collection("OAuthConfig").findOne({
      provider: "google",
    });

    if (!config?.clientId || !config?.clientSecret) {
      return new Response("Google OAuth is not configured.", { status: 400 });
    }

    // Dynamic redirect URL
    const host = req.headers.get("host");
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    console.log("Google Login Redirect URI =>", redirectUri);

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
    });

    // 🔥 FIX: Use Response.redirect instead of redirect()
    return Response.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      302
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
