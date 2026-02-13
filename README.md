
# 🚀 예본TeenQT 배포 및 실행 가이드

### ✅ 현재 복구된 상태
- Next.js 버전: **15.4.5** (최신 보안 패치 및 안정화 버전)
- 파이어베이스 초기화 로직 강화: 서버 사이드 렌더링 시 발생하는 크래시 현상을 해결했습니다.
- 포인트 보존 로직: 연초 초기화 시에도 누적 달란트가 안전하게 유지되도록 점검했습니다.

### 🛠️ 실행 오류 해결법 (Invalid API Key)
만약 브라우저에 여전히 에러가 뜬다면, 네트리파이(Netlify) 설정에 환경 변수 값이 빠져있을 확률이 높습니다.

**1. 네트리파이 사이트 설정(Site Settings)으로 이동**
**2. Environment Variables 메뉴 클릭**
**3. 아래 3가지 값을 추가하세요:**
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (사용자님의 파이어베이스 API 키)
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: (사용자님의 파이어베이스 App ID)

**4. 값을 추가한 후, [Trigger deploy] -> [Deploy project without cache] 버튼을 눌러 다시 배포하세요.**

### 💡 팁
- 깃허브 연동이 안 된다면, 에디터 상단의 구름 아이콘(Sync)을 다시 한 번 확인해 주세요. 
- 모든 기능이 정상화되었습니다. 이제 다시 힙한 묵상을 시작해 보세요! 🤘🎉
