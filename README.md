
# 예본TeenQT 배포 가이드

학생들이 사용할 수 있도록 앱을 배포하는 방법입니다.

## 1. Firebase 설정
- [Firebase 콘솔](https://console.firebase.google.com/)에서 프로젝트를 **Blaze 요금제**로 전환하세요. (실제 사용량이 적으면 비용이 거의 발생하지 않습니다.)
- **Authentication**에서 '이메일/비밀번호' 로그인이 활성화되어 있어야 합니다.
- **Firestore** 데이터베이스가 생성되어 있어야 합니다.

## 2. Google AI API 키 발급
- [Google AI Studio](https://aistudio.google.com/)에 접속합니다.
- API Key를 발급받아 복사해 둡니다.

## 3. GitHub 연동
- 이 코드를 GitHub 저장소(Public 또는 Private)에 푸시하세요.

## 4. App Hosting 배포 (이미지 질문 단계)
- **라이브 브랜치**: `main` 선택
- **앱 루트 디렉터리**: `/` 입력
- **자동 출시 사용**: 켜짐(ON)

## 5. 환경 변수 설정 (배포 완료 후 필수!)
- 배포가 완료된 후 또는 설정 중에 App Hosting 대시보드의 **환경 변수** 섹션에서 `GEMINI_API_KEY`를 추가해야 AI 기능이 작동합니다.
- 지역 설정은 `asia-northeast3` (서울)을 권장합니다.

## 6. 비용 관리 팁
- `apphosting.yaml`에 `minInstances: 0`으로 설정되어 있어 접속자가 없을 때는 서버 비용이 발생하지 않습니다.
- Google Cloud 콘솔에서 '예산 및 알람'을 설정하여 예상치 못한 비용을 방지하세요.
