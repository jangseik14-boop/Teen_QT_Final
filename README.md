
# 🚀 예본TeenQT 클라우드플레어 배포 최종 가이드

사용자님의 클라우드플레어 화면(Connect to repository)에서 아래 순서대로 진행하세요!

### 1️⃣ 에디터에서 [변경사항 적용] 클릭
- 제가 방금 만든 `wrangler.jsonc` 파일이 프로젝트에 추가됩니다.

### 2️⃣ 깃허브로 푸시 (Sync)
- 에디터 왼쪽 **[↑] 버튼**을 누르고, 메시지에 `add cloudflare config`라고 적은 뒤 **체크(Commit)** 버튼을 누르고 **Sync** 버튼을 누르세요.

### 3️⃣ 클라우드플레어 화면에서 [Connect] 클릭
- 사진 속 화면에서 다른 설정은 건드리지 말고 하단의 파란색 **[Connect]** 버튼을 누르세요.
- 제가 만든 `wrangler.jsonc` 파일이 자동으로 빌드 경로를 잡아줄 것입니다.

### 4️⃣ 환경 변수 설정 (중요!)
배포가 시작되면 **[Settings] -> [Variables and Secrets]**로 가서 아래 값을 추가하세요.
- `GEMINI_API_KEY`: `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU`
- `NODE_VERSION`: `20`

**이제 모든 준비가 끝났습니다! 빌드 로그를 지켜보며 성공을 기다리세요. 🎉**
