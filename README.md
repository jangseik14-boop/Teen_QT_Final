
# 🚀 예본TeenQT 클라우드플레어 배포 최종 가이드

사용자님의 클라우드플레어 화면(Workers 대시보드)에서 아래 순서대로만 하시면 끝납니다!

### 1️⃣ 에디터에서 [변경사항 적용] 클릭
- 제가 방금 만든 `wrangler.jsonc` 파일이 프로젝트에 추가됩니다.

### 2️⃣ 깃허브로 푸시 (Sync)
- 에디터 왼쪽 **[↑] 버튼**을 누르고, 메시지에 `deploy fix`라고 적은 뒤 **체크(Commit)** 버튼을 누르고 **Sync** 버튼을 누르세요.

### 3️⃣ 클라우드플레어 대시보드 설정 (사진 속 화면)
화면 상단의 **[설정] (Settings)** 탭을 누른 뒤, 아래 항목을 확인하세요.
- **빌드 명령 (Build Command)**: `npm run build`
- **빌드 출력 디렉토리 (Build Output Directory)**: `.vercel/output` (또는 `.vercel/output/static`)

**이제 제가 만든 `wrangler.jsonc`가 클라우드플레어의 길잡이가 되어 줄 것입니다! 🎉**
