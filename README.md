
# 🚀 예본TeenQT 클라우드플레어 배포 가이드

Next.js 15.2.3 보안 패치가 완료된 버전입니다. 클라우드플레어 배포 시 아래 설정을 확인하세요.

### ✅ 클라우드플레어 프로젝트 설정 (Cloudflare Pages)

1.  **Project Name (중요)**: 반드시 소문자와 하이픈만 사용하세요. (예: `teen-qt-final`)
2.  **Framework Preset**: `Next.js` 선택
3.  **Environment Variables (환경 변수)**: [Settings] -> [Environment Variables]에 아래 값을 추가하세요.
    - `GEMINI_API_KEY`: [에디터 .env 또는 apphosting.yaml의 값]
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: `studio-5290180250-baff5`
    - `NODE_VERSION`: `20`
4.  **Compatibility Flags (호환성 플래그)**:
    - 배포 후 [Settings] -> [Functions] -> [Compatibility flags]에서 **`nodejs_compat`**을 반드시 추가해야 정상 작동합니다.

### ✅ 보안 패치 내역
- **Next.js**: 15.2.3 (CVE-2025-55182 보안 취약점 해결 완료)
- **빌드 환경**: Node.js 20 호환 모드
