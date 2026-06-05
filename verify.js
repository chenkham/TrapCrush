import { Client, Databases } from 'appwrite';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

async function check() {
  console.log("Ping Appwrite Database...");
  try {
    const res = await databases.listDocuments(
      process.env.VITE_APPWRITE_DATABASE_ID,
      process.env.VITE_APPWRITE_PAGES_COLLECTION_ID,
      []
    );
    console.log("✅ Database Connected Successfully!");
    console.log("Total Pages in Database:", res.total);
  } catch(e) {
    console.error("❌ Database Connection Failed:", e.message);
    if (e.code === 401) {
       console.error("Check Permissions! Make sure the 'pages' collection has 'Any' set for Read permissions.");
    }
  }
}
check();
