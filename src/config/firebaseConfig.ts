import Firebase from 'firebase';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID || '',
  appId: process.env.REACT_APP_FIREBASE_APPID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID || '',
};

Firebase.initializeApp(config);

export default config;
