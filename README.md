
# 🚀 예본TeenQT 네트리파이(Netlify) 배포 최종 가이드

사진 속 화면에서 시작하여 배포를 완료하는 방법입니다.

### ✅ 1단계: 깃허브 연결 (사진 속 화면)
1. 화면의 **[Import an existing project]**를 누릅니다.
2. **GitHub**를 선택하고 계정을 인증합니다.
3. 현재 프로젝트(`WebCanvas` 등) 저장소를 선택합니다.

### ✅ 2단계: 사이트 설정 (Site configuration)
*   **Build command**: `npm run build` (자동 입력됨)
*   **Publish directory**: `.next` (자동 입력됨)

### ✅ 3단계: 환경 변수 설정 (매우 중요! ⭐️)
`Environment variables` 메뉴에서 **[Add a variable]**을 눌러 아래 3개를 똑같이 입력하세요.
1. `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
2. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
3. `NODE_VERSION`: `20`

### ✅ 4단계: 배포 시작
맨 아래의 **[Deploy site]** 버튼을 누르면 끝! 약 1~2분 뒤에 링크가 생성됩니다.

---
**팁**: 코드를 수정하고 깃허브에 푸시(Sync)하면 네트리파이가 자동으로 감지해서 다시 배포해 줍니다.
