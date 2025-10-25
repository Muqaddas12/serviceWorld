export async function POST(req) {
  const { email, password } = await req.json();

  if (email === "admin@example.com" && password === "123456") {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
  });
}
