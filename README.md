# Docusumm

문서 요약 서비스를 제공하는 Next.js 기반 웹 애플리케이션입니다.

## 기술 스택

- **Framework**: Next.js 16
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **Email**: Resend
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS
- **Error Monitoring**: Sentry

## 개발 환경 설정

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Supabase - Database
DATABASE_URL=""

# Google Gemini API
GEMINI_API_KEY=""

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""

# Stripe Payment
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Resend Email
RESEND_API_KEY=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Sentry Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=""  # 클라이언트용 (브라우저에 노출)
SENTRY_DSN=""              # 서버용
SENTRY_AUTH_TOKEN=""       # Source Maps 업로드용 (선택사항)
```

### 3. 데이터베이스 마이그레이션

```bash
pnpm db:push
```

### 4. 개발 서버 실행

```bash
pnpm dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## Stripe 결제 연동

### 1. Stripe 계정 설정

1. [Stripe](https://stripe.com/) 회원가입 및 로그인
2. Stripe Dashboard 접속 및 Sandbox 생성

### 2. Stripe MCP 설치

Cursor의 `mcp.json` 파일에 다음 설정을 추가하세요:

```json
{
  "mcpServers": {
    "stripe": {
      "url": "https://mcp.stripe.com"
    }
  }
}
```

### 3. Stripe CLI 설정

1. [Stripe CLI 설치](https://docs.stripe.com/get-started/development-environment)
2. Stripe 로그인:
   ```bash
   stripe login
   ```
3. 로컬 환경 웹훅 포워딩:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. 출력된 웹훅 시크릿을 `.env.local`의 `STRIPE_WEBHOOK_SECRET`에 설정:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

> **참고**: 배포 환경에서는 Stripe 대시보드에서 실제 도메인으로 웹훅 URL을 설정해야 합니다.

### 참고 링크

- [Stripe 기술문서](https://docs.stripe.com/get-started/development-environment)
- [Stripe MCP 설치](https://docs.stripe.com/mcp#tools)
- [Stripe CLI 설치](https://docs.stripe.com/get-started/development-environment)
- [Stripe Testing](https://docs.stripe.com/testing)

## Resend 이메일 전송

### 1. Resend 계정 설정

1. [Resend](https://resend.com/) 회원가입 및 로그인
2. API Key 발급 후 `.env.local`에 설정:
   ```env
   RESEND_API_KEY="re_..."
   ```

### 2. Custom Domain 설정 (선택사항)

커스텀 도메인을 사용하려면 본인이 소유한 도메인이 필요합니다. 설정 방법은 아래 링크를 참고하세요.

- [Resend Custom Domains 설정 방법](https://resend.com/docs/dashboard/receiving/custom-domains)

### 참고 링크

- [Resend 기술문서](https://resend.com/docs)
- [Resend Custom Domains 설정 방법](https://resend.com/docs/dashboard/receiving/custom-domains)

## Sentry 에러 모니터링

이 프로젝트는 [Sentry](https://sentry.io/)를 사용하여 에러 모니터링 및 성능 추적을 수행합니다.

### 1. Sentry 계정 설정

1. [Sentry](https://sentry.io/) 회원가입 및 로그인
2. 새 프로젝트 생성 (Next.js 플랫폼 선택)
3. DSN 발급 후 `.env.local`에 설정:
   ```env
   NEXT_PUBLIC_SENTRY_DSN="https://..."
   SENTRY_DSN="https://..."
   ```

### 2. 자동 에러 캡처

Sentry는 다음 에러들을 자동으로 캡처합니다:

- **클라이언트 사이드 미처리 에러**: 브라우저에서 발생하는 모든 미처리 예외
- **서버 API 라우트 에러**: API 라우트에서 throw된 에러
- **글로벌 에러 바운더리**: React 에러 바운더리에서 잡힌 에러
- **서버 액션 에러**: `"use server"` 함수에서 발생한 에러
- **클라이언트 try-catch 에러**: 수동으로 처리된 에러도 Sentry에 전송

### 3. 수동 에러 캡처

try-catch 블록에서 에러를 처리할 때 Sentry에 전송하려면:

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // 코드 실행
} catch (error) {
  console.error("Error occurred:", error);
  Sentry.captureException(error); // Sentry에 에러 전송
}
```

### 4. Source Maps 업로드 (선택사항)

프로덕션에서 더 나은 스택 트레이스를 위해 Source Maps를 업로드할 수 있습니다:

1. Sentry 대시보드에서 Auth Token 생성
2. `.env.local`에 설정:
   ```env
   SENTRY_AUTH_TOKEN="sntrys_..."
   ```
3. 빌드 시 자동으로 Source Maps가 업로드됩니다

### 5. Sentry 설정 파일

프로젝트의 Sentry 설정은 다음 파일들에 있습니다:

- `instrumentation.ts` - 서버/엣지 런타임 분기
- `instrumentation-client.ts` - 클라이언트 초기화
- `sentry.server.config.ts` - Node.js 서버 설정
- `sentry.edge.config.ts` - Edge 런타임 설정
- `app/global-error.tsx` - 글로벌 에러 바운더리
- `next.config.ts` - Sentry 플러그인 설정

### 참고 링크

- [Sentry Next.js 가이드](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry 대시보드](https://sentry.io/)

## 프로덕션 배포

### 배포 전 준비사항

1. **로컬 빌드 오류 해결**

   ```bash
   pnpm build
   ```

   빌드 시 발생하는 모든 오류를 수정하세요.

2. **GitHub Repository에 푸시**
   ```bash
   git push origin main
   ```

### Vercel 배포

1. **Vercel에 GitHub Repository 연동**
   - [Vercel](https://vercel.com)에 로그인
   - 새 프로젝트 생성 시 GitHub Repository 선택

2. **Environment Variables 설정**
   - 로컬의 `.env.local` 파일을 기반으로 설정
   - 배포 후 다음 변수는 배포 도메인 기반으로 변경:
     - `STRIPE_WEBHOOK_SECRET`: Stripe 대시보드에서 발급
     - `NEXT_PUBLIC_APP_URL`: Vercel 배포 도메인
     - `NEXT_PUBLIC_SENTRY_DSN`: Sentry 프로젝트 DSN
     - `SENTRY_DSN`: Sentry 프로젝트 DSN (서버용)
     - `SENTRY_AUTH_TOKEN`: Source Maps 업로드용 (선택사항)

3. **Stripe Webhook URL 설정**
   - Stripe 대시보드에서 웹훅 URL을 Vercel 배포 도메인으로 설정
   - 예: `https://your-domain.vercel.app/api/webhooks/stripe`
   - 웹훅 시크릿을 발급받아 Vercel 환경 변수에 설정

4. **Supabase Authentication 설정**
   - Supabase Dashboard → Authentication → URL Configuration
   - Site URL에 Vercel 배포 도메인 설정
   - Redirect URLs에 Vercel 배포 도메인 추가

## 사용 가능한 스크립트

- `pnpm dev` - 개발 서버 실행
- `pnpm build` - 프로덕션 빌드
- `pnpm start` - 프로덕션 서버 실행
- `pnpm lint` - ESLint 실행
- `pnpm db:generate` - Drizzle 마이그레이션 파일 생성
- `pnpm db:push` - 데이터베이스에 스키마 푸시
- `pnpm db:studio` - Drizzle Studio 실행
- `pnpm email:dev` - 이메일 미리보기 서버 실행
- `pnpm format` - Prettier로 코드 포맷팅

## 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://docs.stripe.com/)
- [Resend Documentation](https://resend.com/docs)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
