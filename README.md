
# 🚀 예본TeenQT 클라우드플레어 배포 최종 체크리스트

클라우드플레어 빌드 화면에서 아래 값들을 확인하고 없으면 입력하세요.

### 1️⃣ 빌드 설정 (Build Configuration)
- **Build command**: `npm run build`
- **Build output directory**: `.vercel/output/static` (화면 하단에 숨어있을 수 있으니 꼭 찾아서 입력하세요!)

---

### 2️⃣ 환경 변수 (Environment Variables)
[Settings] -> [Variables and Secrets] 에서 아래 3개를 추가하세요.

| Variable Name | Value |
| :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `studio-5290180250-baff5` |
| `NODE_VERSION` | `20` |

---

### 3️⃣ 호환성 플래그 (Compatibility Flags)
[Settings] -> [Functions]에서 **`nodejs_compat`** 플래그를 추가하세요.

**모든 설정을 마쳤다면 [Retry build]를 누르세요. 이제 정말 사이트가 열립니다! 🎉**
