
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 설정값
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "", 
  authDomain: "studio-5290180250-baff5.firebaseapp.com",
  projectId: "studio-5290180250-baff5",
  storageBucket: "studio-5290180250-baff5.firebasestorage.app",
  messagingSenderId: "341639946520",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

function getSdks(firebaseApp: any) {
  if (!firebaseApp) {
    return { firebaseApp: null, auth: null, firestore: null };
  }
  
  try {
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
    };
  } catch (error) {
    console.error("SDK 초기화 실패:", error);
    return { firebaseApp: null, auth: null, firestore: null };
  }
}

export function initializeFirebase() {
  // SSR 환경에서는 초기화 건너뜀
  if (typeof window === "undefined") {
    return { firebaseApp: null, auth: null, firestore: null };
  }

  try {
    if (getApps().length > 0) {
      return getSdks(getApp());
    }

    // API Key가 유효하지 않으면 초기화를 시도하지 않음 (invalid-api-key 에러 방지)
    const isKeyValid = firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10;
    if (!isKeyValid) {
      return getSdks(null);
    }

    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  } catch (error) {
    console.error("Firebase 초기화 중 예외 발생:", error);
    return getSdks(null);
  }
}

// 명시적인 Hook 내보내기 (Export)
export * from './provider';
export * from './non-blocking-updates';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
