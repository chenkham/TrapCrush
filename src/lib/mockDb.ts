import type { Page, User } from './types';
import { account, databases, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_PAGES_COLLECTION_ID } from './appwrite';
import { OAuthProvider } from 'appwrite';

// ============================================================================
// APPWRITE AUTHENTICATION
// ============================================================================

export async function getUser(_email: string): Promise<User | null> {
  try {
    const user = await account.get();
    return { id: user.$id, email: user.email, name: user.name, emailVerification: user.emailVerification };
  } catch (e) {
    return null;
  }
}

export async function signUp(email: string, password: string, name: string): Promise<User> {
  // Create account
  await account.create(ID.unique(), email, password, name);
  // Log them in immediately
  await account.createEmailPasswordSession(email, password);
  
  // Automatically send verification email
  try {
    await account.createVerification(`${window.location.origin}/verify`);
  } catch (e) {
    console.error("Failed to send verification email:", e);
  }

  const user = await account.get();
  return { id: user.$id, email: user.email, name: user.name, emailVerification: user.emailVerification };
}

export async function signIn(email: string, password: string): Promise<User> {
  await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  return { id: user.$id, email: user.email, name: user.name, emailVerification: user.emailVerification };
}

export async function signOut(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (e) {
    console.warn("Already logged out");
  }
}

export async function getSession(): Promise<User | null> {
  try {
    const user = await account.get();
    return { id: user.$id, email: user.email, name: user.name, emailVerification: user.emailVerification };
  } catch (e) {
    return null; // Not logged in
  }
}

export async function updateUser(_id: string, name: string): Promise<User> {
  const user = await account.updateName(name);
  return { id: user.$id, email: user.email, name: user.name, emailVerification: user.emailVerification };
}

export async function signInWithProvider(provider: string): Promise<void> {
  let oauthProvider;
  if (provider === 'google') oauthProvider = OAuthProvider.Google;
  
  if (oauthProvider) {
    account.createOAuth2Session(
      oauthProvider,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/login`
    );
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
}

export async function sendVerificationEmail(): Promise<void> {
  await account.createVerification(`${window.location.origin}/verify`);
}

export async function verifyEmail(userId: string, secret: string): Promise<void> {
  await account.updateVerification(userId, secret);
}

// ============================================================================
// APPWRITE DATABASE (PAGES)
// ============================================================================

export async function createPage(pageData: Omit<Page, 'id' | 'slug' | 'created_at' | 'updated_at' | 'target_ratio'> & { target_ratio?: 'laptop' | 'mobile' }): Promise<Page> {
  const slug = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
  
  // Appwrite expects flat JSON or strings for complex nested arrays
  const documentData = {
    user_id: pageData.user_id,
    slug: slug,
    purpose: pageData.purpose,
    theme: pageData.theme,
    sender_name: pageData.sender_name,
    recipient_name: pageData.recipient_name,
    target_ratio: pageData.target_ratio || 'laptop',
    screens: JSON.stringify(pageData.screens), // Store JSON string for complex arrays
    has_been_opened: false,
    created_at: new Date().toISOString()
  };

  const response = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    ID.unique(),
    documentData
  );

  return {
    ...pageData,
    id: response.$id,
    slug: response.slug,
    created_at: response.created_at,
    updated_at: response.$createdAt,
    has_been_opened: response.has_been_opened,
    target_ratio: response.target_ratio
  } as Page;
}

export async function getPagesByUser(userId: string): Promise<Page[]> {
  const response = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    [
      Query.equal('user_id', userId),
      Query.orderDesc('created_at')
    ]
  );

  return response.documents.map(doc => ({
    id: doc.$id,
    user_id: doc.user_id,
    slug: doc.slug,
    purpose: doc.purpose,
    theme: doc.theme,
    sender_name: doc.sender_name,
    recipient_name: doc.recipient_name,
    target_ratio: doc.target_ratio,
    has_been_opened: doc.has_been_opened,
    created_at: doc.created_at,
    updated_at: doc.$createdAt,
    screens: JSON.parse(doc.screens) // Parse the JSON string back to array
  })) as Page[];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const response = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    [
      Query.equal('slug', slug),
      Query.limit(1)
    ]
  );

  if (response.documents.length === 0) return null;
  const doc = response.documents[0];

  const page = {
    id: doc.$id,
    user_id: doc.user_id,
    slug: doc.slug,
    purpose: doc.purpose,
    theme: doc.theme,
    sender_name: doc.sender_name,
    recipient_name: doc.recipient_name,
    target_ratio: doc.target_ratio,
    has_been_opened: doc.has_been_opened,
    created_at: doc.created_at,
    updated_at: doc.$createdAt,
    screens: JSON.parse(doc.screens)
  } as Page;

  // 3-Day Expiry Logic
  if (!page.has_been_opened) {
    const createdDate = new Date(page.created_at).getTime();
    const now = new Date().getTime();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    if (now - createdDate > threeDaysMs) {
      // It's expired. We should probably delete it from Appwrite here to clean up space.
      await deletePage(page.id);
      return null;
    }
  }

  return page;
}

export async function markPageAsOpened(slug: string): Promise<void> {
  const response = await databases.listDocuments(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    [
      Query.equal('slug', slug),
      Query.limit(1)
    ]
  );

  if (response.documents.length > 0) {
    const doc = response.documents[0];
    await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PAGES_COLLECTION_ID,
      doc.$id,
      { has_been_opened: true }
    );
  }
}

export async function deletePage(id: string): Promise<void> {
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    APPWRITE_PAGES_COLLECTION_ID,
    id
  );
}
