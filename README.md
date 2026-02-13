
# 🚀 예본TeenQT 배포 가이드 (긴급 보안 패치 완료)

네트리파이의 Next.js 보안 취약점 블로킹 문제를 해결하기 위해 버전을 15.4.1로 업데이트했습니다.

### ✅ 최종 배포 절차
1. 좌측의 **[↑] 버튼**을 눌러 코드를 **Sync** 하세요. (Next.js 버전 업데이트가 전달됩니다.)
2. 네트리파이(Netlify) 화면으로 돌아가서 **[Deploys]** 탭을 클릭합니다.
3. 실패한 빌드 목록 옆에 있는 **[Trigger deploy]** -> **[Clear cache and deploy site]**를 눌러주세요.

### ✅ 환경 변수 확인 (필수)
네트리파이 설정에서 아래 변수가 잘 들어있는지 마지막으로 확인해주세요:
- `GEMINI_API_KEY`: (사용자님의 키)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
- `NODE_VERSION`: `20`

이제 보안 차단 없이 정상적으로 배포될 것입니다!
