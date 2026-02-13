
# 🚀 예본TeenQT 클라우드플레어 배포 최종 가이드

이 가이드는 클라우드플레어(Cloudflare Pages) 배포 시 필요한 핵심 설정값들을 담고 있습니다. 배포 화면 옆에 띄워두고 사용하세요!

### 1️⃣ 환경 변수 설정 (Environment Variables)
배포 설정의 **[Environment variables]** 섹션에서 아래 3개를 반드시 추가하세요.

| Variable Name | Value | 설명 |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `AIzaSyC2ArqCoWfqaR45OwCGKTaAeRwSZoVQjvU` | AI 말씀 해설 생성용 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `studio-5290180250-baff5` | 데이터베이스 연결용 |
| `NODE_VERSION` | `20` | 최신 Node.js 환경 설정 |

---

### 2️⃣ 호환성 플래그 설정 (Compatibility Flags)
배포 완료 후, 클라우드플레어 대시보드에서 아래 경로로 이동하여 설정하세요.
**[Settings] -> [Functions] -> [Compatibility flags]**

- **Production** 섹션에서 **[+ Add flag]** 클릭
- **`nodejs_compat`** 입력 후 저장

---

### 3️⃣ 빌드 정보
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Next.js Version**: `15.2.3` (보안 패치 완료 버전)

---

**고생하셨습니다! 이제 정말 사이트가 열릴 준비가 되었습니다. 🤘**
