# Investor Web (Firebase Enabled)

This app now uses:
- Firebase Authentication (email/password)
- Cloud Firestore for user, founder, and investor data
- Firestore-backed matching instead of in-memory mock arrays in the active dashboard flow

## 1. Install dependencies

```bash
npm install
```

## 2. Configure Firebase

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3. Firestore collections (schema)

### `users/{uid}`
- `uid: string`
- `email: string`
- `name: string`
- `role: "startup" | "investor"`
- `onboardingCompleted: boolean`
- `createdAt: string` (ISO)
- `updatedAt: string` (ISO)

### `founders/{uid}`
- `uid: string`
- `name: string`
- `description: string`
- `industry: string`
- `stage: string`
- `funding: string`
- `location: string`
- `createdAt: string` (ISO)
- `updatedAt: string` (ISO)

### `investors/{uid}`
- `uid: string`
- `firmName: string`
- `minTicket: string`
- `maxTicket: string`
- `thesis: string`
- `coInvestment: string`
- `valueAdd: string[]`
- `preferredSectors: string[]`
- `stage: string`
- `antiPortfolio: string`
- `diligenceTimeframe: string`
- `regionalFocus: string[]`
- `createdAt: string` (ISO)
- `updatedAt: string` (ISO)

## 4. Local development

```bash
npm run dev
```

## 5. Firestore rules

Use the included `firestore.rules` file and deploy it with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

## 6. Build

```bash
npm run build
```
