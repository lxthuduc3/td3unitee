import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import firebaseConfig from './configs/firebase'

const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
