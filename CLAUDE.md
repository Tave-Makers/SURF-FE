# Surf FE

Turborepo monorepo. 주 앱: `apps/web` (surf-web).

## Commands

```bash
# surf-web
pnpm dev:surf        # 개발 서버
pnpm build:surf      # 프로덕션 빌드
pnpm lint:surf       # ESLint
pnpm test:web        # Vitest
pnpm storybook:surf  # Storybook

# surf-admin
pnpm dev:admin       # 개발 서버
pnpm build:admin     # 프로덕션 빌드
pnpm lint:admin      # ESLint
pnpm test:admin      # Vitest
pnpm storybook:admin # Storybook
```

## Docs

- 기술 스택, 디렉토리 구조 → @docs/overview.md
- 코딩 컨벤션, 네이밍, import 순서 → @docs/code-convention.md
- 컴포넌트 설계 패턴 (예시 포함) → @docs/component-patterns.md
- 테스트 전략, 모킹 패턴 → @docs/testing.md
