import clientPromise from '../../lib/mongo';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("myDatabase"); // Replace 'myDatabase' with your actual database name

    const data = await db.collection("auth").find({}).toArray(); // Example query

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error fetching data" });
  } 
}
