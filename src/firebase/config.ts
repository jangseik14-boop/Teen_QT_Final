
/**
 * @fileOverview Firebase 클라이언트 설정
 * 환경 변수와 하드코딩된 대안을 결합하여 초기화 오류를 방지합니다.
 */

const projectId = "studio-5290180250-baff5";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "", // 네트리파이 설정에서 가져옴
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: projectId,
  storageBucket: `${projectId}.firebasestorage.app`,
  messagingSenderId: "341639946520",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "", // 네트리파이 설정에서 가져옴
};
