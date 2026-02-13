# 🚀 예본TeenQT 최종 배포 가이드

현재 네트리파이 보안 스캐너가 빌드를 차단하는 문제를 해결하기 위해 코드가 업데이트되었습니다.

### ✅ 최종 배포 절차
1.  **코드 동기화**: 좌측의 [↑] 버튼을 눌러 **Sync**를 완료하세요.
2.  **네트리파이 환경 변수 확인**: 네트리파이 설정 화면(Site settings > Environment variables)에 아래 3개가 정확히 있는지 확인하세요.
    - `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
    - `NODE_VERSION`: `20`
3.  **재배포**: 네트리파이의 **Deploys** 탭에서 **[Trigger deploy]**를 눌러 다시 빌드하세요.

이제 보안 경고 없이 배포가 완료될 것입니다!