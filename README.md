
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 가이드

지금 보고 계신 네트리파이 화면에서 아래 순서대로 진행하시면 배포가 완료됩니다!

### ✅ 배포 단계 (사진 속 화면 기준)

1.  **새 사이트 추가**: 화면 우측 상단의 민트색 **[Add new project]** 버튼을 누릅니다.
2.  **깃허브 연결**: `Import an existing project` -> `GitHub`를 선택하여 현재 프로젝트 저장소를 연결합니다.
3.  **환경 변수 설정 (중요!)**: `Site configuration` -> `Environment variables` 메뉴에서 아래 3개를 입력합니다.
    *   `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
    *   `NODE_VERSION`: `20`
4.  **배포 시작**: 맨 아래의 **[Deploy site]** 버튼을 누르면 끝!

**네트리파이는 복잡한 설정 없이 자동으로 Next.js를 감지하여 배포해 줍니다.**
