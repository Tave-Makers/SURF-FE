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

## Agents

작업 유형에 따라 아래 커맨드를 사용:

| 상황 | 커맨드 |
|------|--------|
| 파일 작성/수정 후 컨벤션 검증 | `/review <파일경로>` |
| PR 올리기 전 staged 파일 전체 검증 | `/review --staged` |
| 테스트 파일 생성 | `/gen-test <파일경로>` |
| Figma 디자인 → 컴포넌트 퍼블리싱 | `/publish-component <Figma URL> "<화면 설명>"` |

## Rules

- 코드 생성 시 @docs/code-convention.md 규칙을 항상 준수
- 새 컴포넌트 생성 시 @docs/component-patterns.md 폴더 구조 및 레이어 판단 기준 따름
- 테스트 생성 시 @docs/testing.md 패턴 따름
- 소스 코드 수정 시 테스트 파일은 건드리지 않음 — 테스트 수정은 `/gen-test`로 별도 진행
- 컴포넌트 생성 전 packages/ui 재사용 가능한 컴포넌트 먼저 확인