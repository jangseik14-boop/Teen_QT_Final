
# 예본TeenQT 배포 가이드

학생들이 사용할 수 있도록 앱을 배포하는 상세 방법입니다. 이미지로 확인해주신 정보를 바탕으로 작성되었습니다.

## 1. GitHub 정보 확인 (중요)
- **저장소 주소**: `https://github.com/jangseik14-boop/Teen_QT.git`
- **확인된 브랜치**: **`main`** (이미지의 `git branch -M main` 기준)

## 2. 코드 GitHub에 올리기 (아직 안 하셨다면)
컴퓨터의 터미널(명령 프롬프트)에서 다음 순서대로 입력하세요:
```bash
git remote add origin https://github.com/jangseik14-boop/Teen_QT.git
git branch -M main
git add .
git commit -m "배포 준비 완료"
git push -u origin main
```

## 3. Firebase 프로젝트 설정
- [Firebase 콘솔](https://console.firebase.google.com/)에서 프로젝트를 **Blaze 요금제**로 전환하세요.
- **Authentication**: '이메일/비밀번호' 로그인을 활성화합니다.
- **Firestore Database**: 데이터베이스를 생성합니다.

## 4. App Hosting 배포 설정
- Firebase 콘솔의 **App Hosting** 메뉴에서 `Teen_QT` 저장소를 연결합니다.
- **라이브 브랜치**: **`main`**을 선택하세요.
- **앱 루트 디렉터리**: `/` (기본값)
- **지역(Region)**: `asia-northeast3` (서울)을 권장합니다.

## 5. 환경 변수 등록 (AI 작동을 위해 필수!)
배포가 진행되는 동안 또는 완료 후, App Hosting 대시보드의 **환경 변수(Environment variables)** 섹션에 다음을 추가하세요.
- **Variable**: `GEMINI_API_KEY`
- **Value**: [Google AI Studio](https://aistudio.google.com/)에서 발급받은 API 키
- 등록 시 **Secret** 유형으로 선택하는 것을 권장합니다.

## 6. 비용 및 관리
- `apphosting.yaml`에 `minInstances: 0`으로 설정되어 있어 사용자가 없을 때는 비용이 발생하지 않습니다.
