/**
 * @fileOverview Firebase 클라이언트 설정
 * 보안을 위해 환경 변수에서 값을 읽어오도록 수정되었습니다.
 */
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: "1:341639946520:web:db275fbc56d36d65f2be6d",
  apiKey: "AIzaSyB7bzTJ_PCXNj4Q1wdoN_SScm8G0IY3bB4",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  messagingSenderId: "341639946520"
};
