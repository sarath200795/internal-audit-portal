import { connectAuthEmulator as __connectAuthEmu } from 'firebase/auth'
import { connectFirestoreEmulator as __connectFsEmu } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The app is usable for code-reading even before Firebase is configured.
// We flag missing config so the UI can show a friendly setup message instead
// of crashing on a bad initializeApp() call.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '[Internal Audit] Firebase is not configured. Copy .env.example to .env ' +
      'and fill in your VITE_FIREBASE_* values to enable auth and data.',
  )
}

export { app, auth, db }

// ── Local emulator wiring (demo / offline dev only) ──────────────────────────
// When VITE_USE_EMULATOR is "1", point Auth + Firestore at the local Firebase
// emulators. Guarded by an env flag absent in production builds.
export const usingEmulator = import.meta.env.VITE_USE_EMULATOR === '1'
if (usingEmulator && auth && db) {
  __connectAuthEmu(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
  __connectFsEmu(db, '127.0.0.1', 8080)
}
