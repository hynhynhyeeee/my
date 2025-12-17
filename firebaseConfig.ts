// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 프로젝트 설정
// Firebase Console > 프로젝트 설정 > 일반 > 내 앱 에서 확인
const firebaseConfig = {
  apiKey:  "AIzaSyA4R1-qX2c35g8SkMaUWhor6PNr5q1iSiA",  // ← Firebase Console에서 복사
  authDomain: "beauty-inside-665c4.firebaseapp.com",
  projectId: "beauty-inside-665c4",
  storageBucket: "beauty-inside-665c4.firebasestorage.app",
  messagingSenderId: "514397107320",
  appId:  "1:514397107320:web:871ad3b0797894f593698d",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);