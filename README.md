# 🚀 예본TeenQT 최종 배포 가이드

보안 스캐너 차단 문제를 해결하기 위해 코드 내의 모든 API 키를 제거했습니다. 아래 절차를 반드시 따라주세요.

### ✅ 배포 전 필수 설정 (Netlify UI)
네트리파이 사이트 설정(Site settings > Environment variables)에서 아래 **5개** 변수를 반드시 입력해야 합니다.

1. `GEMINI_API_KEY`: (제공해드린 Gemini API 키)
2. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
3. `NEXT_PUBLIC_FIREBASE_API_KEY`: `AIzaSyB7bzTJ_PCXNj4Q1wdoN_SScm8G0IY3bB4`
4. `NEXT_PUBLIC_FIREBASE_APP_ID`: `1:341639946520:web:db275fbc56d36d65f2be6d`
5. `NODE_VERSION`: `20`

### ✅ 배포 순서
1. 좌측의 **[↑] 버튼**을 눌러 **Sync**를 완료하세요.
2. 네트리파이의 **Deploys** 탭에서 **[Trigger deploy]**를 눌러 다시 빌드하세요.
