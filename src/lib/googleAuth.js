"use server";

import clientPromise from "./mongodb";
const DB_ADMIN = "smmadmin";




// SAVE CONFIG
export async function saveGoogleConfig(formData) {
  const clientId = formData.get("clientId");
  const clientSecret = formData.get("clientSecret");

  try {
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);

    await db.collection("OAuthConfig").updateOne(
      { provider: "google" },
      {
        $set: {
          clientId,
          clientSecret,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return { success: true, message: "Google OAuth config saved!" };
  } catch (err) {
    return { success: false, message: "Error saving config" };
  }
}

// GET ONE CONFIG
// GET ONE CONFIG
export async function getGoogleConfig() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);

    const config = await db.collection("OAuthConfig").findOne({
      provider: "google"
    });

    if (!config) return {};

    return {
      provider: config.provider,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      updatedAt: config.updatedAt?.toString() || null // convert date to string
    };
  } catch (err) {
    console.log(err);
    return {};
  }
}
