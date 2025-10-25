import { MongoClient } from "mongodb";

const client= new MongoClient(process.env.MONGODB_URI)

export  async function getAdminByEmail(email) {
  await client.connect();
  const db = client.db("smmadmin"); 
  const admin = await db.collection("admins").findOne({ email });
  return admin;
}


export  async function getAllUsers(){
    try {
        await client.connect()
        const db=client.db('mydb')
        const users=await db.collection('users').find().toArray()
        return users

    } catch (error) {
        return error;
        
    }
}