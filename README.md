
# 🚀 예본TeenQT 클라우드플레어 최종 배포 가이드

사진 속 화면에서 아래 순서대로 진행하면 배포가 성공합니다!

### 1️⃣ 환경 변수 설정 (중요!)
클라우드플레어 대시보드의 **[Settings] -> [Variables and Secrets]** (또는 변수와 비밀) 섹션에서 **[+]** 버튼을 눌러 아래 3개를 추가하고 저장하세요.

| 변수명 (Variable Name) | 값 (Value) |
| :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `studio-5290180250-baff5` |
| `NODE_VERSION` | `20` |

### 2️⃣ 에디터에서 변경사항 적용 및 푸시
- 현재 에디터에서 **[변경사항 적용]** 버튼을 클릭합니다.
- 왼쪽 메뉴의 **[↑] (Source Control)** 버튼을 누릅니다.
- 메시지 칸에 `deploy fix`라고 적고 **체크(Commit)** 버튼을 누릅니다.
- **Sync Changes (푸시)** 버튼을 누릅니다.

### 3️⃣ 빌드 확인
- 푸시를 완료하면 클라우드플레어 화면이 자동으로 **"빌드 중"**으로 바뀝니다.
- `wrangler.jsonc` 파일이 추가되었으므로, 별도의 경로 설정 없이도 배포가 완료됩니다.
- 약 2~3분 뒤에 배포된 주소가 나오면 성공입니다! 🎉
