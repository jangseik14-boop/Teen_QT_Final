
# 예본TeenQT 배포 가이드

현재 GitHub 저장소가 비어 있어 Firebase에서 인식을 못하고 있습니다. 아래 순서대로 진행해 주세요.

## 1. 터미널에서 코드 전송하기 (가장 중요)
아래 명령어들을 터미널에 한 줄씩 복사해서 입력하세요:

```bash
# 1. 저장소 연결 (이미 연결되어 있다는 에러가 나면 다음 단계로 넘어가세요)
git remote add origin https://github.com/jangseik14-boop/Teen_QT.git

# 2. 브랜치 설정
git branch -M main

# 3. 파일 업로드 준비
git add .
git commit -m "배포 준비 완료"

# 4. GitHub로 실제 전송
git push -u origin main
```

## 2. Firebase App Hosting 설정
- 위 단계를 마친 후 GitHub 사이트에서 파일이 보이면 성공입니다.
- Firebase 페이지를 **새로고침(F5)** 하세요.
- 브랜치에 `main`을 입력하면 이제 **[다음]** 버튼이 활성화됩니다.

## 3. 배포 후 꼭 해야 할 일 (AI 작동 필수!)
배포 완료 후, App Hosting 대시보드 -> Settings -> Environment variables에서 다음을 추가하세요.
- **Variable**: `GEMINI_API_KEY`
- **Value**: 발급받은 API 키

## 4. 접속 정보
- **브랜치 이름**: `main`
- **앱 루트 디렉터리**: `/`
