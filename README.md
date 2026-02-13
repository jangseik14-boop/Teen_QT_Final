
# 🚀 예본TeenQT 배포 및 실행 가이드

### 🛠️ 실행 오류 해결법 (Invalid API Key)
현재 브라우저에 `auth/invalid-api-key` 오류가 뜬다면, 네트리파이(Netlify) 설정에 값이 빠져있는 것입니다.

**1. 네트리파이 사이트 설정(Site Settings)으로 이동**
**2. Environment Variables 메뉴 클릭**
**3. 아래 3가지 값을 추가하세요:**
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (사용자님의 파이어베이스 API 키)
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: (사용자님의 파이어베이스 App ID)

**4. 값을 추가한 후, [Trigger deploy] -> [Deploy project without cache] 버튼을 눌러 다시 배포하세요.**

### ✅ 현재 적용된 상태
- Next.js 버전: **15.4.7** (최신 보안 패치 및 안정화 버전)
- Firebase 초기화 로직 강화 (API Key 누락 시 안내 메시지 출력)
- 깃허브 동기화 오류 발생 시: 에디터 왼쪽 하단의 깃허브 아이콘을 클릭하여 연결 상태를 확인해 주세요.

### 💡 팁
- 깃허브 연동이 안 된다면, 잠시 기다렸다가 페이지를 새로고침(F5)한 뒤 다시 **[↑] (Sync)** 버튼을 눌러보세요.
