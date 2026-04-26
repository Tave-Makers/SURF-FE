# publish-component

Figma 디자인과 Google Sheets 기능 스펙을 함께 분석해 컴포넌트 코드, Storybook story를 생성하고
Playwright 스크린샷 리포트를 만듭니다.

## 사용법
/publish-component <Figma 노드 URL> <기능ID>

예시:
/publish-component https://www.figma.com/file/xxx/Design?node-id=123:456 FEAT-042

기능 ID는 Google Sheets 스펙 시트의 "기능 ID" 컬럼 값을 그대로 사용합니다.

## 실행 흐름

5개의 Task를 순차적으로 실행.
**Agent 1 완료 후 반드시 사용자 승인을 받고 Agent 2로 진행.**

---

### Agent 0 — Google Sheets에서 기능 스펙 로드

**도구:** Google Drive MCP

**작업:**

1. Google Drive MCP로 스펙 스프레드시트를 검색해 파일을 찾는다
2. 전달받은 기능 ID(e.g. `FEAT-042`)로 해당 행을 조회한다
3. 아래 컬럼 값을 읽어 변수로 저장한다:

| 컬럼 | 용도 |
|------|------|
| 기능 ID | 식별자 |
| 기능명 | `featureName` — 컴포넌트명 도출 재료 |
| 상세 설명 | 기능 목적·동작 파악, 레이어 판단 보조 |
| API | `model/` 폴더 필요 여부 판단, features 레이어 힌트 |
| 필수 데이터 | `props` 추출 재료 |

4. 조회 실패 시(ID 없음) 즉시 중단하고 아래 메시지 출력:
```
⛔ 기능 ID 'FEAT-042'를 스프레드시트에서 찾을 수 없습니다.
   ID를 다시 확인하거나 시트에 해당 기능이 등록되어 있는지 확인해주세요.
```

5. 조회 성공 시 읽어온 내용을 출력하고 Agent 1로 전달:
```
📋 스펙 시트 로드 완료
   기능 ID  : FEAT-042
   기능명   : 게시글 카드
   상세 설명: 게시글 목록에서 반복 사용되는 카드. 제목, 카테고리 뱃지, 좋아요 수 표시.
   API      : GET /api/posts/:id
   필수 데이터: title, category, likeCount
```

**산출물:** 조회한 행 데이터 (Agent 1 컨텍스트로 전달)

---

### Agent 1 — Figma 분석 & 레이어 제안

**도구:** Figma MCP

**컨텍스트:** Agent 0에서 로드한 Sheets 스펙 데이터

**작업:**

1. 전달받은 노드 URL에서 컴포넌트 정보를 읽는다
2. Sheets 스펙 데이터와 Figma 정보를 교차 분석해 아래 스펙을 구조화된 JSON으로 추출한다:
   - **기능명 + 상세 설명** → Figma 레이어명과 대조해 `componentName` 결정 (PascalCase)
   - **상세 설명** → 기능 목적·인터랙션 파악, 레이어 판단 보조
   - **API 유무** → API가 있으면 features 레이어 후보, 없으면 entities 후보
   - **필수 데이터** → props 목록 초안으로 활용, Figma 레이어에서 타입 보완
   - **Figma 레이어** → 실제 props 타입, variants, 디자인 토큰 추출
   - **각 variant의 `screenshot` 여부** → 아래 기준으로 판단해 spec.json에 함께 기록:
     - `true` — Figma에 해당 variant 전용 디자인 프레임이 존재하거나, 상태에 따라 UI가 실질적으로 달라지는 경우
       (예: 에러 메시지 노출, disabled 처리, 빈 상태, 로딩 상태)
     - `false` — CSS/interaction으로만 처리되는 variant이거나 Figma에 별도 디자인이 없는 경우
       (예: hover, focus 등 순수 인터랙션 상태)

```json
{
  "featureId": "FEAT-042",
  "featureName": "게시글 카드",
  "componentName": "PostCard",
  "targetApp": "web",
  "variants": [
    { "name": "default", "screenshot": true,  "reason": "기본 노출 상태 확인" },
    { "name": "hover",   "screenshot": false, "reason": "CSS hover 처리, Figma 별도 디자인 없음" },
    { "name": "error",   "screenshot": true,  "reason": "에러 메시지 노출 여부 확인" },
    { "name": "disabled","screenshot": true,  "reason": "비활성 UI 처리 확인" }
  ],
  "props": [
    { "name": "title", "type": "string" },
    { "name": "category", "type": "string" },
    { "name": "likeCount", "type": "number" }
  ],
  "hasApi": true,
  "apiEndpoint": "GET /api/posts/:id",
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

3. @docs/component-patterns.md 레이어 판단 기준과 `hasApi` 값을 함께 참고해 적합한 레이어 제안
   - API 연동 있음 → features 레이어 우선 검토
   - API 연동 없음 → entities 레이어 우선 검토
4. UI 컴포넌트 사전 파악 — `packages/ui` → `shared/ui` 순서로 탐색해 재사용 가능한 컴포넌트 목록을 정리한다. 두 곳 모두에 없는 UI 요소가 있으면 승인 요청 목록에 포함한다.
5. `targetApp` 결정: Figma 컨텍스트에서 대상 앱(`web` / `admin`)을 판별.
   명확하지 않으면 승인 요청 시 함께 확인한다.

**산출물:** `publish-output/spec.json`

**승인 요청 — Agent 2 진행 전 반드시 출력:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
기능 ID : FEAT-042
기능명  : 게시글 카드
컴포넌트명: PostCard
대상 앱: apps/web  (변경하려면 알려주세요)
제안 레이어: features/post
생성 경로: apps/web/src/features/post/ui/PostCard.tsx
이유: API 연동(GET /api/posts/:id)이 있어 features 레이어로 제안.

스크린샷 촬영 대상 variants:
  ✅ default  — 기본 노출 상태 확인
  ⏭ hover    — CSS hover 처리, Figma 별도 디자인 없음 (건너뜀)
  ✅ error    — 에러 메시지 노출 여부 확인
  ✅ disabled — 비활성 UI 처리 확인

재사용할 UI 컴포넌트:
  [packages/ui] Card, Badge, Avatar
  [shared/ui]   없음
  [신규 생성]   없음

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

1. `spec.json`의 `targetApp` 값(`web` / `admin`)을 읽어 앱 루트를 결정한다:
   - `web` → `apps/web/src`
   - `admin` → `apps/admin/src`

   이하 경로는 모두 결정된 앱 루트(`<APP_ROOT>`) 아래에 생성한다.

2. 승인된 레이어 기준으로 FSD 폴더 구조 생성:

```
# entities인 경우
<APP_ROOT>/entities/<domain>/ui/<ComponentName>.tsx
<APP_ROOT>/entities/<domain>/index.ts

# features인 경우 (hasApi: true)
<APP_ROOT>/features/<feature-name>/ui/<ComponentName>.tsx
<APP_ROOT>/features/<feature-name>/model/  (API 연동 있을 경우 자동 생성)
<APP_ROOT>/features/<feature-name>/index.ts

# widgets인 경우
<APP_ROOT>/widgets/<widget-name>/ui/<ComponentName>.tsx
<APP_ROOT>/widgets/<widget-name>/index.ts
```

3. **UI 컴포넌트 탐색 순서 — 반드시 이 순서를 따른다:**

   도메인에 종속되지 않는 순수 UI 요소(입력, 버튼, 텍스트 등)는 아래 순서로 탐색한다.

   **① `packages/ui` 먼저 확인**
   - 프로젝트 공통 디자인 시스템 컴포넌트 (Textarea, TextInput, Button 등)
   - 여기서 찾으면 바로 import해 사용

   **② `packages/ui`에 없으면 `shared/ui` 탐색**
   - 앱 공유 레이어의 UI 컴포넌트 확인
   - 여기서 찾으면 import해 사용

   **③ 둘 다 없으면 — 신규 생성 승인 요청 (코드 작성 중단)**
   ```
   ⏸ 신규 UI 컴포넌트 생성이 필요합니다. 진행 전 승인해주세요.

   packages/ui와 shared/ui 어디에도 아래 컴포넌트가 없습니다:
     - RatingStars  (별점 표시용)
     - TagChip      (태그 목록용)

   생성 위치 제안:
     - packages/ui/src/RatingStars.tsx  → 여러 앱에서 재사용 가능성 높음
     - packages/ui/src/TagChip.tsx      → 여러 앱에서 재사용 가능성 높음
     (공통성이 낮다면 shared/ui로 변경 가능 — 알려주세요)

   승인하면 해당 컴포넌트를 먼저 생성한 뒤 메인 컴포넌트 작업을 재개합니다.
   ```
   승인 후 신규 컴포넌트를 생성하고, 이어서 메인 컴포넌트에서 import해 사용한다.

4. 컴포넌트 작성 기준:
   - Props 타입은 `type`으로 선언, 파일 상단에 위치
   - named export 사용
   - Tailwind 토큰 기반 클래스 사용 (`cn()` 유틸 활용)
   - `'use client'`는 이벤트 핸들러/hook이 있을 때만 추가
   - 토큰 미매핑 항목은 임의값 + TODO 주석으로 표시:

```tsx
// TODO: 디자인 토큰 미매핑 — border-color #E2E8F0 확인 필요
className="border-[#E2E8F0]"
```

5. 기존 파일 처리:
   - **컴포넌트 파일**이 이미 존재하면 덮어쓰지 않고 중단:
     ```
     ⛔ apps/web/src/features/post/ui/PostCard.tsx 이미 존재합니다.
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

1. **레이어별 생성 여부 판단 — 먼저 확인하고 해당되지 않으면 이 Agent를 건너뛴다:**

   | 레이어 | story 생성 |
   |--------|-----------|
   | `packages/ui` | ✅ 생성 |
   | `shared/ui` | ✅ 생성 |
   | `entities` | ✅ 생성 |
   | `features` | ⏭ 건너뜀 |
   | `widgets` | ⏭ 건너뜀 |

   건너뛰는 경우 아래 메시지를 출력하고 Agent 4로 진행:
   ```
   ⏭ Agent 3 건너뜀 — features 레이어는 Storybook 생성 대상이 아닙니다.
   ```

   단, Agent 2에서 신규 `packages/ui` 또는 `shared/ui` 컴포넌트가 생성된 경우,
   메인 컴포넌트가 건너뜀 대상이더라도 **신규 공통 컴포넌트에 대한 story는 별도로 생성한다.**

2. story 파일 생성 위치:
   - `packages/ui` 컴포넌트: `packages/ui/src/<ComponentName>.stories.tsx`
   - `shared/ui` 컴포넌트: `apps/{targetApp}/src/shared/ui/<ComponentName>.stories.tsx`
   - `entities` 컴포넌트: `apps/{targetApp}/src/entities/<domain>/ui/<ComponentName>.stories.tsx`

3. story 작성 기준:
   - spec.json의 variants를 각각 독립 story로 생성
   - `args`를 Figma 스펙 및 Sheets의 필수 데이터 기반으로 채움
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

**산출물:** 레이어에 따라 위 2번 경로 기준으로 생성. 건너뜀 대상이면 산출물 없음.

---

### Agent 4 — 스크린샷 리포트 생성

**작업:**

1. Storybook 서버 실행:
```bash
pnpm storybook:surf --ci
```

2. **스크린샷 촬영 여부 판단:**
   - spec.json의 각 variant에서 `screenshot: true`인 것만 촬영한다
   - `screenshot: false`인 variant(예: hover)는 건너뛴다
   - 촬영 대상이 하나도 없으면 Agent 4 전체를 건너뛰고 메시지 출력:
     ```
     ⏭ Agent 4 건너뜀 — 스크린샷 촬영 대상 variant가 없습니다.
     ```

3. Playwright로 `screenshot: true` variant만 스크린샷 촬영:
```
publish-output/screenshots/<ComponentName>/
├── Default.png
├── Error.png
└── Disabled.png
```

4. Figma MCP로 `screenshot: true` variant 디자인 이미지 export:
```
publish-output/figma/<ComponentName>/
├── Default.png
├── Hovered.png
└── Disabled.png
```

5. HTML 리포트 생성 (`publish-output/report.html`):
   - 리포트 상단에 기능 메타 정보 표시 (기능 ID, 기능명, API 엔드포인트)
   - variant별 Figma / 구현 스크린샷 좌우 나란히 배치
   - 토큰 미매핑 항목은 리포트 상단 경고 배너로 표시
   - 각 variant에 메모 입력란 제공 (사람이 검토 내용 기록용)

6. 리포트 자동 오픈:
```bash
open publish-output/report.html
```

**산출물:** `publish-output/report.html`

---

## 최종 완료 보고

```
✅ Agent 0 — 스펙 시트 로드 완료
   └ 기능 ID: FEAT-042 / 기능명: 게시글 카드
   └ API: GET /api/posts/:id
   └ 필수 데이터: title, category, likeCount

✅ Agent 1 — 스펙 추출 완료
   └ variants: Default, Hovered, Disabled
   └ ⚠️ 토큰 미매핑 1건: border-color #E2E8F0

✅ Agent 2 — 컴포넌트 생성 완료
   └ apps/web/src/features/post/ui/PostCard.tsx
   └ apps/web/src/features/post/model/
   └ apps/web/src/features/post/index.ts

✅ Agent 3 — Storybook 생성 완료  (features/widgets면 ⏭ 건너뜀)
   └ apps/web/src/entities/post/ui/PostCard.stories.tsx
   └ 3개 story: Default, Hovered, Disabled
   └ (신규 공통 컴포넌트가 있으면 packages/ui story도 포함)

✅ Agent 4 — 스크린샷 리포트 생성 완료  (촬영 대상 없으면 ⏭ 건너뜀)
   └ publish-output/report.html 오픈됨
   └ 사람 검증 필요: 2개 variant (default, error, disabled / hover 제외)
```

## 범위 외

- 디자인과 구현 차이를 자동으로 수정하지 않는다 — 리포트 확인 후 직접 수정
- 소스 코드 리뷰는 하지 않는다 → `/review` 커맨드 사용
- 테스트 생성은 하지 않는다 → `/gen-test` 커맨드 사용
- Google Sheets 스펙 데이터를 직접 수정하지 않는다 — 시트는 읽기 전용으로 사용