
# 예본TeenQT 배포 및 운영 가이드

코드 업로드가 완료되었습니다! 이제 Firebase에서 배포를 마무리하세요.

## 1. Firebase App Hosting 마무리
- GitHub에 파일이 올라온 것을 확인했다면, Firebase 화면을 새로고침하세요.
- 브랜치에 `main`을 입력하면 **[다음]** 버튼이 활성화됩니다.
- 배포가 완료될 때까지 잠시 기다려 주세요.

## 2. AI 작동을 위한 필수 설정 (중요!)
배포가 끝난 직후, 아래 설정을 하지 않으면 AI 기능이 작동하지 않습니다.

1. Firebase 콘솔의 **App Hosting** 메뉴로 들어갑니다.
2. 생성된 백엔드를 클릭하고 **Settings(설정)** 탭을 누릅니다.
3. **Environment variables(환경 변수)** 섹션에서 **[Add variable]**을 클릭합니다.
4. 아래 정보를 입력합니다:
   - **Variable 이름**: `GEMINI_API_KEY`
   - **Value**: [Google AI Studio](https://aistudio.google.com/)에서 발급받은 API 키
5. **[Save]**를 눌러 저장합니다.

## 3. 학생들에게 링크 공유
- 배포가 완료되면 App Hosting 대시보드 상단에 `https://...`로 시작하는 주소가 생깁니다.
- 이 주소를 복사해서 학생들에게 공유해 주시면 됩니다! 🤘
