
# 🚀 예본TeenQT 클라우드플레어 최종 배포 가이드 (완결판)

클라우드플레어 배포 시 아래 설정값을 **반드시** 업데이트해야 배포에 성공합니다!

### 1️⃣ 빌드 설정 수정 (오른쪽 메뉴 'Build' 클릭)
클라우드플레어 대시보드 [Settings] -> [Build] 에서 수정하세요.

- **Build command**: `npm run build`
- **Build output directory**: `.vercel/output/static` (기존 .next에서 이걸로 꼭 바꿔주세요!)

---

### 2️⃣ 환경 변수 설정 (오른쪽 메뉴 'Variables and Secrets' 클릭)
[Settings] -> [Variables and Secrets] 에서 아래 3개를 추가하세요.

| Variable Name | Value | 설명 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU` | AI 해설 생성용 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `studio-5290180250-baff5` | 데이터베이스 연결용 |
| `NODE_VERSION` | `20` | 빌드 환경 설정 |

---

### 3️⃣ 호환성 플래그 (오른쪽 메뉴 'Runtime' 또는 'Build' 근처 확인)
[Settings] -> [Functions] (또는 Runtime 설정)

- **`nodejs_compat`** 플래그 추가 확인 (wrangler.jsonc에 이미 포함되어 있지만, 대시보드에서 보이면 활성화하세요)

---

**이 설정을 마치고 [Deployments] 탭으로 가서 [Retry build]를 누르면 이제 정말 사이트가 열립니다! 🎉**
