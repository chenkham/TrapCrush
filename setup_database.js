import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
dotenv.config();

const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

if (!PROJECT_ID || !API_KEY || PROJECT_ID === 'your-project-id-here' || API_KEY === 'your-secret-api-key-here') {
  console.error("❌ Error: You forgot to replace the placeholder values in your .env file!");
  console.error("Please open your .env file and paste your actual Project ID and API Key.");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

const DB_ID = 'trapcrush_db';
const COL_ID = 'pages';

// Helper to wait for attribute processing
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function setup() {
  console.log('🚀 Starting Automated Database Setup...');

  // 1. Create Database
  try {
    await databases.create(DB_ID, 'TrapCrush DB');
    console.log('✅ Database created successfully.');
  } catch (e) {
    if (e.code === 409) console.log('✅ Database already exists.');
    else throw e;
  }

  // 2. Create Collection
  try {
    await databases.createCollection(DB_ID, COL_ID, 'Pages');
    console.log('✅ Collection created successfully.');
  } catch (e) {
    if (e.code === 409) console.log('✅ Collection already exists.');
    else throw e;
  }

  // 3. Create String Attributes
  console.log('⏳ Adding string attributes (this may take a moment)...');
  const stringAttrs = [
    { key: 'user_id', size: 50, required: true },
    { key: 'slug', size: 50, required: true },
    { key: 'purpose', size: 50, required: true },
    { key: 'theme', size: 50, required: true },
    { key: 'sender_name', size: 100, required: true },
    { key: 'recipient_name', size: 100, required: true },
    { key: 'target_ratio', size: 50, required: true },
    { key: 'screens', size: 100000, required: true }
  ];

  for (const attr of stringAttrs) {
    try {
      await databases.createStringAttribute(DB_ID, COL_ID, attr.key, attr.size, attr.required);
      console.log(`   Added: ${attr.key}`);
      await delay(500); // Give Appwrite time to process
    } catch (e) {
      if (e.code === 409) console.log(`   Already exists: ${attr.key}`);
      else console.error(`Error adding ${attr.key}:`, e.message);
    }
  }

  // 4. Create Boolean Attribute
  try {
    await databases.createBooleanAttribute(DB_ID, COL_ID, 'has_been_opened', false, false);
    console.log(`   Added: has_been_opened`);
  } catch (e) {
    if (e.code === 409) console.log(`   Already exists: has_been_opened`);
  }

  // 5. Create Datetime Attribute
  try {
    await databases.createDatetimeAttribute(DB_ID, COL_ID, 'created_at', true);
    console.log(`   Added: created_at`);
  } catch (e) {
    if (e.code === 409) console.log(`   Already exists: created_at`);
  }

  console.log('\n🎉 DATABASE FULLY AUTOMATED AND READY!');
}

setup().catch(console.error);
