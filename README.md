
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 최종 가이드

사진 속 화면에서 배포를 완료하는 방법입니다.

### ✅ 1단계: 빌드 설정 확인 (사진 속 화면)
*   **Project name**: `ybteenqt` (잘 입력하셨습니다!)
*   **Branch to deploy**: `main` (기본값 그대로 두세요)

### ✅ 2단계: 환경 변수 설정 (가장 중요! ⭐️)
화면을 아래로 조금 더 내리면 **[Add environment variables]** 버튼이 보입니다. 클릭해서 아래 3개를 똑같이 입력하세요.

1.  **Key**: `GEMINI_API_KEY`
    **Value**: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
2.  **Key**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    **Value**: `studio-5290180250-baff5`
3.  **Key**: `NODE_VERSION`
    **Value**: `20`

### ✅ 3단계: 배포 시작
맨 아래에 있는 파란색 **[Deploy ybteenqt]** (또는 Deploy site) 버튼을 누르면 끝!

---
**팁**: 약 1~2분 뒤에 배포가 완료되면 상단에 `https://ybteenqt.netlify.app` 링크가 활성화됩니다. 클릭해서 접속해 보세요!
