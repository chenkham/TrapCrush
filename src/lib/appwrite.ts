import { Client, Account, Databases, ID, Query } from 'appwrite';

// Read from environment variables, or use placeholders if not set
export const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || 'YOUR_PROJECT_ID';
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'trapcrush_db';
export const APPWRITE_PAGES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PAGES_COLLECTION_ID || 'pages';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };
export default client;
