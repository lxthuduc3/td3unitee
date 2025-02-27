importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyCqWxIFKhuyui9-aEtXHJ1XHqglNxXs7IY',
  authDomain: 'td3unitee.firebaseapp.com',
  projectId: 'td3unitee',
  storageBucket: 'td3unitee.firebasestorage.app',
  messagingSenderId: '333951530439',
  appId: '1:333951530439:web:8fd693c0b88446822b15e2',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  })
})
