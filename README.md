
# 🚀 예본TeenQT 배포 및 실행 가이드

### ✅ 현재 복구된 상태
- **에러 수정**: `auth/invalid-api-key` 오류로 인해 화면이 멈추던 현상을 해결했습니다.
- **안전한 로딩**: 설정값이 없어도 앱이 크래시되지 않고 안내 화면을 보여줍니다.
- **데이터 보존**: 모든 묵상 로직과 포인트 관리 시스템은 그대로 유지되었습니다.

### 🛠️ 최종 해결 단계 (필독!)
브라우저에서 에러 화면이 사라지고 앱이 정상 작동하려면, **네트리파이(Netlify)** 설정에 아래 값을 반드시 추가해야 합니다.

**1. 네트리파이 사이트 설정(Site Settings)으로 이동**
**2. [Environment variables] 메뉴 클릭**
**3. 아래 변수들을 추가하세요:**
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: (사용자님의 파이어베이스 API 키)
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: (사용자님의 파이어베이스 App ID)

**4. 값을 추가한 후, [Deploy project without cache] 버튼을 눌러 다시 배포하세요.**

### 💡 팁
- 깃허브 연동(Sync)이 안 될 때는 잠시 기다렸다가 구름 아이콘을 다시 클릭해 보세요.
- 코드는 완벽하게 복구되었습니다. 설정값만 넣어주시면 됩니다! 🤘🎉
