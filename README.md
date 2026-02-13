
# 예본TeenQT 배포 가이드

학생들이 사용할 수 있도록 앱을 배포하는 상세 방법입니다.

## 1. Firebase 프로젝트 설정
- [Firebase 콘솔](https://console.firebase.google.com/)에서 프로젝트를 **Blaze 요금제**로 전환하세요.
- **Authentication**: '이메일/비밀번호' 로그인을 활성화합니다.
- **Firestore Database**: 데이터베이스를 생성합니다.

## 2. Google AI API 키 발급
- [Google AI Studio](https://aistudio.google.com/)에서 API Key를 발급받아 복사해 둡니다. (무료 티어 사용 가능)

## 3. GitHub 저장소 준비 및 브랜치 확인
- 이 코드를 GitHub에 푸시(Push)합니다.
- **브랜치 이름 확인**: GitHub 저장소 페이지 왼쪽 상단의 드롭다운 버튼을 확인하세요. (보통 `main`입니다.)

## 4. App Hosting 배포 설정
- **라이브 브랜치**: 위에서 확인한 브랜치 이름(예: `main`)을 선택합니다.
- **앱 루트 디렉터리**: `/` (기본값)
- **지역(Region)**: `asia-northeast3` (서울)을 권장합니다.

## 5. 환경 변수 등록 (필수!)
- 배포가 진행되는 동안 또는 완료 후, App Hosting 대시보드의 **환경 변수(Environment variables)** 섹션에 다음을 추가하세요.
  - **Variable**: `GEMINI_API_KEY`
  - **Value**: 2단계에서 복사한 API 키
- 등록 시 **Secret** 유형으로 선택하는 것을 권장합니다.

## 6. 비용 및 관리
- `apphosting.yaml`에 `minInstances: 0`으로 설정되어 있어 사용자가 없을 때는 비용이 발생하지 않습니다.
- 예상치 못한 비용 방지를 위해 Google Cloud 콘솔에서 '예산 및 알람' 설정을 추천합니다.
