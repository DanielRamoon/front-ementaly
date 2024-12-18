importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA6JewgBh_8zjcsauwLhdTyHOX7Er1IYlg',
  authDomain: 'ementaly-b1e60.firebaseapp.com',
  projectId: 'ementaly-b1e60',
  storageBucket: 'ementaly-b1e60.appspot.com',
  messagingSenderId: '752223525558',
  appId: '1:752223525558:web:f383f1f2e7e7de4ae6e417',
  measurementId: 'G-GPRJV9JMBJ',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
let messaging = null;

if(firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
}

// firebase.messaging().onBackgroundMessage((payload) => {
//   console.log('Message received: on background ', payload);

//   // new Notification(payload.notification.title, {
//   //   body: payload.notification.body,
//   // });
// });
