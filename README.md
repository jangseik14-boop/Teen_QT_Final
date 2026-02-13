
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 최종 가이드

사진 속 화면에서 배포를 완료하는 방법입니다.

### ✅ 1단계: 환경 변수 설정 (가장 중요! ⭐️)
화면의 **[Add environment variables]** 버튼을 누르고 **[Import from a .env file]**을 선택하세요. 
그다음 아래 박스의 내용을 통째로 복사해서 붙여넣으세요.

```text
GEMINI_API_KEY=AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-5290180250-baff5
NODE_VERSION=20
```

### ✅ 2단계: 빌드 설정 확인
*   **Build command**: `npm run build`
*   **Publish directory**: `.next`
*   (위 파일들이 설정되어 있다면 그대로 두시면 됩니다.)

### ✅ 3단계: 배포 시작
입력이 끝났다면 맨 아래의 하늘색 **[Deploy ybteenqt]** 버튼을 누르면 끝!

---
**팁**: 배포가 완료되면 `https://ybteenqt.netlify.app` 같은 링크가 생깁니다. 그 주소로 접속하시면 됩니다!
