
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { AlertCircle, Loader2 } from "lucide-react";

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: !!auth, 
    userError: null,
  });

  useEffect(() => {
    if (!auth) {
      setUserAuthState({ user: null, isUserLoading: false, userError: null });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [auth]);

  const servicesAvailable = !!(firebaseApp && firestore && auth);

  const contextValue = useMemo((): FirebaseContextState => {
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp,
      firestore,
      auth,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [servicesAvailable, firebaseApp, firestore, auth, userAuthState]);

  // 브라우저에서 서비스가 준비되지 않았을 때 (설정값 누락 등) 보여줄 안전한 안내 화면
  if (!servicesAvailable && typeof window !== "undefined") {
    if (userAuthState.isUserLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-10 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-800 italic">서버 설정이 필요합니다</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Firebase API Key가 등록되지 않았습니다.<br/>
            Netlify 환경 변수에 필수 값을 추가해 주세요.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left w-full max-w-md">
          <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">필수 환경 변수</p>
          <ul className="space-y-2 font-mono text-[11px] text-amber-700">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
          </ul>
          <p className="mt-4 text-[10px] text-gray-400">참고: README.md 가이드에 설정 방법이 자세히 적혀 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context; // throw 대신 context 자체를 반환하여 안전성 확보
};

export const useAuth = () => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = () => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = () => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  return memoized;
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    return { user: null, isUserLoading: true, userError: null };
  }
  return { 
    user: context.user, 
    isUserLoading: context.isUserLoading, 
    userError: context.userError 
  };
};
