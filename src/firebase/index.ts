
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (typeof window === 'undefined') return getSdks(null as any);

  if (!getApps().length) {
    // API 키가 없는 경우 초기화를 시도하지 않고 더 명확한 메시지를 제공합니다.
    if (!firebaseConfig.apiKey) {
      console.warn("Firebase API Key is missing. Please check environment variables.");
    }

    let firebaseApp;
    try {
      // Firebase App Hosting 환경 시도
      firebaseApp = initializeApp();
    } catch (e) {
      // 설정 객체로 폴백
      firebaseApp = initializeApp(firebaseConfig);
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  if (!firebaseApp) return { firebaseApp: null as any, auth: null as any, firestore: null as any };
  
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
