
# 🚀 예본TeenQT 클라우드플레어 최종 배포 가이드

사용자님의 클라우드플레어 화면(Workers Build) 기준 최종 설정입니다.

### 1️⃣ 환경 변수 확인 (이미 잘 넣으셨어요!)
사진에 보이는 **[Variables and secrets]** 항목에 아래 3개가 잘 들어있는지 다시 한번 확인하세요.
- `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
- `NODE_VERSION`: `20`

### 2️⃣ 호환성 플래그 설정 (매우 중요!)
화면 오른쪽 메뉴에서 **[Runtime]** 또는 **[Settings]** 메뉴를 찾아 들어가세요.
- **Compatibility flags** 항목을 찾습니다.
- **`nodejs_compat`** 플래그가 추가되어 있는지 확인하고, 없으면 반드시 추가하고 저장하세요.

### 3️⃣ 다시 빌드하기
모든 설정이 끝났다면, 화면 상단의 **[View build]**를 누른 후 **[Retry deployment]** 또는 다시 커밋을 푸시하여 빌드를 시작하세요.

**제가 추가한 `wrangler.jsonc` 파일이 이제 클라우드플레어에게 빌드 경로를 정확히 알려줄 것입니다! 🎉**
