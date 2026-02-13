
# 예본TeenQT 배포 및 운영 가이드

코드 업로드가 완료되었습니다! 이제 Firebase에서 배포를 마무리하세요.

## 1. Firebase App Hosting 설정 마무리
- **브랜치**: `main` 선택
- **백엔드 ID**: `teen-qt-backend` 입력
- **지역(Region)**: `asia-northeast3 (Seoul)` 선택
- **웹 앱 연결 (중요!)**: 
  - 가능하다면 **"기존 Firebase 웹 앱 선택"**을 누르고 목록에서 앱을 선택하세요.
  - 목록이 없다면 **"새 Firebase 웹 앱 만들기"**를 선택하세요.
- **완료 및 배포**: 버튼을 누르면 약 3~5분 후 배포가 완료됩니다.

## 2. 코드 업로드 명령어 (터미널용)
혹시 코드가 아직 안 올라갔다면 터미널에 아래를 입력하세요:
```bash
git add .
git commit -m "배포용 코드 업로드"
git push -u origin main
```

## 3. 배포 후 필수 설정 (AI 기능 활성화)
배포가 끝난 직후, 아래 설정을 하지 않으면 AI 기능이 작동하지 않습니다.

1. Firebase 콘솔의 **App Hosting** 메뉴로 들어갑니다.
2. 생성된 백엔드(`teen-qt-backend`)를 클릭하고 **Settings(설정)** 탭을 누릅니다.
3. **Environment variables(환경 변수)** 섹션에서 **[Add variable]**을 클릭합니다.
4. 아래 정보를 입력합니다:
   - **Variable 이름**: `GEMINI_API_KEY`
   - **Value**: Google AI Studio에서 발급받은 API 키
5. **[Save]**를 눌러 저장합니다.

## 4. 학생들에게 링크 공유
- 배포가 성공하면 대시보드 상단에 `https://...`로 시작하는 도메인 주소가 생깁니다.
- 이 주소를 복사해서 학생들에게 공유해 주시면 됩니다! 🤘
