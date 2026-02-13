
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 최종 가이드

사진 속 화면에서 배포를 완료하는 방법입니다.

### ✅ 1단계: 빌드 설정 확인 (사진 속 화면)
*   **Build command**: `npm run build`
*   **Publish directory**: `.next`
*   (기본값이 위와 같다면 그대로 두시면 됩니다.)

### ✅ 2단계: 환경 변수 설정 (가장 중요! ⭐️)
화면 중간의 **[Add environment variables]** 버튼을 클릭하고 **[Add a single variable]**을 눌러 다음 3개를 입력하세요.

1.  **Key**: `GEMINI_API_KEY`
    **Value**: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
2.  **Key**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
    **Value**: `studio-5290180250-baff5`
3.  **Key**: `NODE_VERSION`
    **Value**: `20`

### ✅ 3단계: 배포 시작
모두 입력했다면 맨 아래의 하늘색 **[Deploy ybteenqt]** 버튼을 누르면 끝!

---
**팁**: 배포가 완료되면 `https://ybteenqt.netlify.app` 같은 링크가 생깁니다. 그 주소로 접속하시면 됩니다!
