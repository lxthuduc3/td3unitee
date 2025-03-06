import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const app = initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG))

export const messaging = getMessaging(app)
