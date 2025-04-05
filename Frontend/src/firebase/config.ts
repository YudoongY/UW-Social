import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // 请替换为您的 Firebase 配置信息
  apiKey: "AIzaSyBAfbwkUozrOjK7nt3ak9skVY98CRrLGeE",
  authDomain: "uw-social-ae4c7.firebaseapp.com",
  projectId: "uw-social-ae4c7",
  storageBucket: "uw-social-ae4c7.firebasestorage.app",
  messagingSenderId: "719152143746",
  appId: "1:719152143746:web:bd4379728e72bb9d2c839b",
  measurementId: "G-FVV15Y8BRH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 