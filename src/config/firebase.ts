import admin from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID as string,
  private_key: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'), // Convert `\n` back to new lines
  client_email: process.env.FIREBASE_CLIENT_EMAIL as string,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  });
}

const bucket = admin.storage().bucket();
export default bucket;
