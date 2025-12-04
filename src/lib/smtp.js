'use server'
import clientPromise from "./mongodb";
const DB_ADMIN = "smmadmin";
export async function saveSmtpConfigAction(data) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);

    // overwrite old config OR create new one
    await db.collection("smtp_config").updateOne(
      {},
      { $set: data },
      { upsert: true }
    );

    return { success: true, message: "SMTP config saved!" };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
}




export async function getSmtpConfigAction() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_ADMIN);

    const config = await db.collection("smtp_config").findOne({});

    if (!config) return {};

    return {
      host: config.host || "",
      port: config.port || "",
      user: config.user || "",
      pass: config.pass || "",
      from: config.from || "",
      secure: config.secure || false,
      updatedAt: config.updatedAt?.toString() || null
    };
  } catch (err) {
    console.error(err);
    return {};
  }
}