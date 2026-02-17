Admin setup — secure method (custom claim)

1) Create a Firebase service account key
- Go to Firebase Console → Project settings → Service accounts → Generate new private key.
- Save the JSON as `serviceAccountKey.json` (do NOT commit this file).

2) Get the UID of the user who should be admin
- In the browser after signing in, open DevTools Console and run:
  `console.log(firebaseUser && firebaseUser.uid)`
- Or find the user in Firebase Console → Authentication → Users → UID column.

3) Run locally to set admin claim
- Install dependencies and run the script:
```bash
npm install firebase-admin
node scripts/set-admin-claim.js <USER_UID>
```
- Ensure `serviceAccountKey.json` is present in the project root or set `GOOGLE_APPLICATION_CREDENTIALS` env var to its path.

4) Or run via GitHub Actions (CI)
- Add the service account JSON content to your repository secrets as `FIREBASE_SERVICE_ACCOUNT`.
- In GitHub, go to Actions → "Set Firebase Admin Claim" workflow → Run workflow → provide `uid`.

5) After setting the claim
- User should sign out and sign in again, or call `firebaseUser.getIdToken(true)` to refresh token.
- Client code checks `idTokenResult.claims.admin` and will treat that user as admin.

Security notes
- Do NOT commit `serviceAccountKey.json` into the repo.
- Use GitHub Secrets for CI and limit access to repository collaborators.
- For production, prefer managing admin roles through an admin panel protected by Cloud IAM or restricted access.
