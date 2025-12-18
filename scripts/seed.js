import "dotenv/config";
import clientPromise from '../src/lib/mongodb.js'

const DB_ADMIN = "smmadmin";
const SUPER_ADMIN_COLLECTION = "superadmin";

async function seed() {
  const client = await clientPromise;
  const db = client.db(DB_ADMIN);
  const superAdmin = db.collection(SUPER_ADMIN_COLLECTION);

  const exists = await superAdmin.findOne({ role: "superadmin" });

  if (exists) {
    console.log("⚠️ Super admin already exists");
    process.exit(0);
  }

  await superAdmin.insertOne({
    email: "test@gmail.com",
    password:'hello',
    role: "superadmin",
    createdAt: new Date(),
  });

  console.log("✅ Super admin seeded");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
