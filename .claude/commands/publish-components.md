# publish-component

Figma 디자인을 분석해 컴포넌트 코드, Storybook story를 생성하고
Playwright 스크린샷 리포트를 만듭니다.

## 사용법
/publish-component <Figma 노드 URL> "<화면/컴포넌트 설명>"

예시:
/publish-component https://www.figma.com/file/xxx/Design?node-id=123:456 "게시글 목록에서 반복 사용되는 카드 컴포넌트. 제목, 카테고리 뱃지, 좋아요 수를 표시함"

설명에 포함하면 좋은 내용:
- 어떤 페이지/화면에서 사용되는지
- 어떤 데이터를 표시하는지
- 사용자 인터랙션이 있는지 (클릭, 입력 등)

## 실행 흐름

4개의 Task를 순차적으로 실행.
**Agent 1 완료 후 반드시 사용자 승인을 받고 Agent 2로 진행.**

---

### Agent 1 — Figma 분석 & 레이어 제안

**도구:** Figma MCP

**작업:**

1. 전달받은 노드 URL에서 컴포넌트 정보를 읽는다
2. 아래 스펙을 구조화된 JSON으로 추출한다:

```json
{
  "componentName": "PostCard",
  "variants": ["default", "hover", "disabled"],
  "props": [
    { "name": "title", "type": "string" },
    { "name": "category", "type": "string" },
    { "name": "likeCount", "type": "number" }
  ],
  "tokens": {
    "bg": "bg-background-normal",
    "text": "text-foreground-static-black",
    "radius": "rounded-lg",
    "padding": "px-4 py-3"
  },
  "unmappedTokens": [
    { "property": "border-color", "figmaValue": "#E2E8F0", "note": "디자인 토큰 미매핑" }
  ]
}
```

3. 전달받은 화면 설명과 @docs/component-patterns.md 레이어 판단 기준을
   함께 참고해 적합한 레이어 제안
4. `packages/ui`에서 재사용 가능한 컴포넌트 목록 확인

**산출물:** `publish-output/spec.json`

**승인 요청 — Agent 2 진행 전 반드시 출력:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
컴포넌트명: PostCard
제안 레이어: entities/post
이유: Post 도메인 데이터를 표시하는 순수 표시용 컴포넌트.
      인터랙션 없음, API 연동 없음.

재사용할 packages/ui 컴포넌트:
  - Card, Badge, Avatar

⚠️ 토큰 미매핑 1건
  - border-color: #E2E8F0 → 디자인 시스템 확인 필요

레이어나 구성을 변경하려면 알려주세요.
계속 진행할까요?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

사용자가 승인하면 Agent 2 진행.
레이어 변경 요청이 오면 spec.json 수정 후 재출력.

---

### Agent 2 — 컴포넌트 설계 & 생성

**컨텍스트 로드:**
- @docs/component-patterns.md
- @docs/code-convention.md
- `publish-output/spec.json`

**작업:**

1. 승인된 레이어 기준으로 FSD 폴더 구조 생성:

```
# entities인 경우
entities/<domain>/ui/<ComponentName>.tsx
entities/<domain>/index.ts

# features인 경우
features/<feature-name>/ui/<ComponentName>.tsx
features/<feature-name>/model/  (API 연동 있을 경우)
features/<feature-name>/index.ts

# widgets인 경우
widgets/<widget-name>/ui/<ComponentName>.tsx
widgets/<widget-name>/index.ts
```

2. 컴포넌트 작성 기준:
   - `packages/ui` 컴포넌트 우선 조합
   - Props 타입은 `type`으로 선언, 파일 상단에 위치
   - named export 사용
   - Tailwind 토큰 기반 클래스 사용 (`cn()` 유틸 활용)
   - `'use client'`는 이벤트 핸들러/hook이 있을 때만 추가
   - 토큰 미매핑 항목은 임의값 + TODO 주석으로 표시:

```tsx
// TODO: 디자인 토큰 미매핑 — border-color #E2E8F0 확인 필요
className="border-[#E2E8F0]"
```

3. 기존 파일 처리:
   - **컴포넌트 파일**이 이미 존재하면 덮어쓰지 않고 중단:
     ```
     ⛔ entities/post/ui/PostCard.tsx 이미 존재합니다.
        덮어쓰려면 명시적으로 알려주세요.
     ```
   - **`index.ts`**가 이미 존재하면 덮어쓰지 않고 새 export만 추가(append):
     ```ts
     // 기존 내용 유지, 아래 줄만 추가
     export { PostCard } from './ui/PostCard';
     ```

**산출물:** 컴포넌트 파일, `index.ts`

---

### Agent 3 — Storybook 생성

**컨텍스트 로드:**
- Agent 2 생성 컴포넌트 파일
- `publish-output/spec.json`

**작업:**

1. story 파일 생성 위치:
```
<layer>/<name>/ui/<ComponentName>.stories.tsx
```

2. story 작성 기준:
   - spec.json의 variants를 각각 독립 story로 생성
   - `args`를 Figma 스펙 기반으로 채움
   - `meta.title`은 FSD 레이어 경로 기준

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PostCard } from './PostCard';

const meta: Meta<typeof PostCard> = {
  title: 'entities/PostCard',
  component: PostCard,
};
export default meta;

type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
  args: {
    title: '서프 게시글 제목',
    category: '자유',
    likeCount: 12,
  },
};

export const Hovered: Story = {
  args: { ...Default.args },
};
```

**산출물:** `<layer>/<name>/ui/<ComponentName>.stories.tsx`

---

### Agent 4 — 스크린샷 리포트 생성

**작업:**

1. Storybook 서버 실행:
```bash
pnpm storybook:surf --ci
```

2. Playwright로 각 story variant 스크린샷 촬영:
```
publish-output/screenshots/<ComponentName>/
├── Default.png
├── Hovered.png
└── Disabled.png
```

3. Figma MCP로 각 variant 디자인 이미지 export:
```
publish-output/figma/<ComponentName>/
├── Default.png
├── Hovered.png
└── Disabled.png
```

4. HTML 리포트 생성 (`publish-output/report.html`):
   - variant별 Figma / 구현 스크린샷 좌우 나란히 배치
   - 토큰 미매핑 항목은 리포트 상단 경고 배너로 표시
   - 각 variant에 메모 입력란 제공 (사람이 검토 내용 기록용)

5. 리포트 자동 오픈:
```bash
open publish-output/report.html
```

**산출물:** `publish-output/report.html`

---

## 최종 완료 보고

```
✅ Agent 1 — 스펙 추출 완료
   └ variants: Default, Hovered, Disabled
   └ ⚠️ 토큰 미매핑 1건: border-color #E2E8F0

✅ Agent 2 — 컴포넌트 생성 완료
   └ entities/post/ui/PostCard.tsx
   └ entities/post/index.ts

✅ Agent 3 — Storybook 생성 완료
   └ entities/post/ui/PostCard.stories.tsx
   └ 3개 story: Default, Hovered, Disabled

✅ Agent 4 — 스크린샷 리포트 생성 완료
   └ publish-output/report.html 오픈됨
   └ 사람 검증 필요: 3개 variant
```

## 범위 외

- 디자인과 구현 차이를 자동으로 수정하지 않는다 — 리포트 확인 후 직접 수정
- 소스 코드 리뷰는 하지 않는다 → `/review` 커맨드 사용
- 테스트 생성은 하지 않는다 → `/gen-test` 커맨드 사용
