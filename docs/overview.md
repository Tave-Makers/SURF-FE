# Project Overview

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router, Turbopack) |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS v4 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| 테스트 | Vitest + React Testing Library |
| 모노레포 | Turborepo + pnpm workspaces |

## 모노레포 구조

```text
surf-monorepo/
├── apps/
│   ├── web/          # surf-web (메인 유저 앱)
│   ├── admin/        # surf-admin
│   └── mobile/
└── packages/
    ├── ui/           # 공유 컴포넌트 (@surf/ui)
    ├── hooks/        # 공유 훅 (@surf/hooks)
    ├── utils/        # 공유 유틸 (@surf/utils)
    ├── eslint-config/
    ├── prettier-config/
    └── typescript-config/
```

## apps/web 디렉토리 구조 (FSD)

```text
src/
├── app/              # Next.js App Router (라우팅만)
│   ├── (protected)/  # 인증 필요 페이지
│   ├── (public)/     # 공개 페이지
│   ├── api/          # Route Handlers
│   └── providers/    # QueryProvider, ThemeProvider 등
├── app-pages/        # 페이지 단위 컴포넌트 (route → app-pages로 위임)
├── widgets/          # 여러 feature를 조합한 복합 UI 블록
├── features/         # 사용자 시나리오 단위 기능
├── entities/         # 비즈니스 도메인 (post, user, calendar 등)
└── shared/           # 재사용 기반 요소
    ├── api/          # fetch 클라이언트, 타입 가드
    ├── hooks/        # 공통 훅
    ├── lib/          # 서드파티 래퍼
    ├── store/        # 전역 store (Zustand)
    ├── constants/
    └── styles/
```

## 레이어 의존성 규칙

```
app → app-pages → widgets → features → entities → shared
```

상위 레이어는 하위 레이어만 import 가능. 같은 레이어 간 import 금지.

## 환경 설정

- `.env.local` — 로컬 환경변수 (`NEXT_PUBLIC_*` prefix로 클라이언트 노출)
- `apps/web/next.config.ts` — Next.js 설정
- `turbo.json` — Turborepo 태스크 파이프라인
