
# 🚀 예본TeenQT 클라우드플레어 배포 가이드

Next.js 15.2.3 보안 패치가 완료된 버전입니다. 클라우드플레어 배포 시 아래 설정을 확인하세요.

### ✅ 클라우드플레어 세팅 (Cloudflare Pages)

1.  **Framework Preset**: `Next.js` 선택
2.  **Environment Variables (중요)**:
    - `GEMINI_API_KEY`: [에디터 .env 값 복사]
    - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: [에디터 apphosting.yaml 값 복사]
    - `NODE_VERSION`: `20`
3.  **Compatibility Flags**:
    - 배포 후 [Settings] -> [Functions] -> [Compatibility flags]에서 `nodejs_compat`을 반드시 추가하세요.

### ✅ 보안 패치 내역
- **Next.js**: 15.2.3 (CVE-2025-55182 보안 취약점 해결 버전)
- **빌드 환경**: Node.js 20 호환 모드
