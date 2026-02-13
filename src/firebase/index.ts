
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 환경 변수 및 하드코딩된 설정을 통합하여 안정성 확보
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
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any,
    };
  }
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

// 초기화 로직 강화: 서버 사이드에서도 빈 객체를 반환하여 훅 충돌 방지
export function initializeFirebase() {
  if (typeof window === "undefined") {
    // 서버 사이드에서는 더미 객체를 반환하여 초기 렌더링 시 크래시 방지
    return {
      firebaseApp: {} as any,
      auth: {} as any,
      firestore: {} as any,
    };
  }

  try {
    if (getApps().length > 0) {
      return getSdks(getApp());
    }

    if (!firebaseConfig.apiKey) {
      console.warn("⚠️ Firebase API Key is missing. Check Netlify Environment Variables.");
    }

    const app = initializeApp(firebaseConfig);
    return getSdks(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return getSdks(null);
  }
}
