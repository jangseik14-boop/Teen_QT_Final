/**
 * @fileOverview Firebase 클라이언트 설정
 * 네트리파이 보안 스캐너(Secret Scanning) 통과를 위해 모든 값을 환경 변수로 대체합니다.
 */
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  messagingSenderId: "341639946520"
};
