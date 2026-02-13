
# 예본TeenQT 배포 가이드

학생들이 사용할 수 있도록 앱을 배포하는 방법입니다.

## 1. Firebase 설정
- Firebase 콘솔에서 프로젝트를 **Blaze 요금제**로 전환하세요.
- **Authentication**에서 '이메일/비밀번호' 로그인이 활성화되어 있는지 확인하세요.
- **Firestore** 데이터베이스가 생성되어 있어야 합니다.

## 2. GitHub 연동
- 이 코드를 GitHub 저장소에 푸시하세요.

## 3. App Hosting 배포
- Firebase 콘솔 -> Build -> **App Hosting**으로 이동합니다.
- GitHub 저장소를 연결하고 배포를 시작하세요.
- **중요**: 백엔드 설정에서 `GEMINI_API_KEY` 환경 변수를 추가해야 AI 묵상/퀴즈 기능이 작동합니다.

## 4. 비용 관리 팁
- `apphosting.yaml`에 `minInstances: 0`으로 설정되어 있어 사용하지 않을 때는 비용이 발생하지 않습니다.
- Google Cloud 콘솔에서 '예산 및 알람'을 설정하여 예상치 못한 비용을 방지하세요.
