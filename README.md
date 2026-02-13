
# 🚀 예본TeenQT 클라우드플레어 최종 배포 가이드

클라우드플레어 **Workers** 화면(사용자님 스크린샷 화면) 기준 설정입니다.

### 1️⃣ 환경 변수 추가 (매우 중요!)
화면의 **[Variables and secrets]** 옆에 있는 **[+]** 버튼을 눌러 아래 3개를 꼭 넣으세요.
- `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
- `NODE_VERSION`: `20`

### 2️⃣ 빌드 설정 확인
**[Build configuration]** 옆의 **연필(✎)** 아이콘을 눌러 아래 내용이 맞는지 확인하세요.
- **Build command**: `npm run build`
- **Root directory**: `/`
- (나머지 항목은 제가 추가한 `wrangler.jsonc` 파일이 자동으로 처리하므로 비워두거나 기본값으로 두셔도 됩니다.)

### 3️⃣ 호환성 플래그
화면 맨 위 **[Compatibility flags]** 옆의 **연필(✎)**을 눌러 `nodejs_compat`이 있는지 확인하고 없으면 추가하세요.

**모든 설정을 마쳤다면 상단의 [View build]를 눌러 다시 빌드를 시작하세요! 🎉**
