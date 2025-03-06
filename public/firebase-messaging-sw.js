importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBHTcTjWZ3l4LiCqhbgV2jyHI4nRWEt7_M',
  authDomain: 'td3unitee-5b8f1.firebaseapp.com',
  projectId: 'td3unitee-5b8f1',
  storageBucket: 'td3unitee-5b8f1.firebasestorage.app',
  messagingSenderId: '766379686967',
  appId: '1:766379686967:web:2f90099abb96f6f0bcd3b2',
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  })
})
