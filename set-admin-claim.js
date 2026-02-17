const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Service account file not found: ${serviceAccountPath}`);
  console.error('Set environment variable GOOGLE_APPLICATION_CREDENTIALS or place serviceAccountKey.json in the project root.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.js <USER_UID>');
  process.exit(1);
}

async function setAdmin(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Set admin claim for', uid);
    process.exit(0);
  } catch (err) {
    console.error('Failed to set claim:', err);
    process.exit(2);
  }
}

setAdmin(uid);
