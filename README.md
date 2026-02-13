
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 가이드

### ✅ 배포 방법
1.  **네트리파이 접속**: [netlify.com](https://www.netlify.com/)에 로그인합니다.
2.  **새 사이트 추가**: `Add new site` -> `Import an existing project` -> `GitHub`를 선택합니다.
3.  **리포지토리 선택**: 현재 프로젝트가 있는 GitHub 저장소를 선택합니다.
4.  **환경 변수 설정 (중요!)**: `Site configuration` -> `Environment variables`에서 아래 3개를 입력합니다.
    *   `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
    *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
    *   `NODE_VERSION`: `20`
5.  **배포 시작**: `Deploy site`를 누르면 끝!

**네트리파이는 복잡한 설정 없이 자동으로 Next.js를 감지하여 배포해 줍니다.**
