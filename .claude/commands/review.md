# review

변경된 코드를 컨벤션 기준으로 검증·리뷰하고, 사용자가 선택한 항목만 실제 코드에 반영합니다.

## 사용법

```bash
/review <파일경로> [파일경로2] ...
/review --staged        # git staging area 전체 대상
```

`--staged` 사용 시 아래 명령으로 대상 파일 목록을 먼저 확인:

```bash
git diff --cached --name-only --diff-filter=ACM
```

## 실행 흐름

대상 파일이 여러 개면 Task 툴로 병렬 실행 (Phase 1–2까지).
Phase 3 반영 단계는 사용자 선택이 필요하므로 **순차적으로** 진행한다.

### 1. 컨텍스트 로드

각 Task 시작 시 반드시 아래 문서를 먼저 읽는다:
- @docs/code-convention.md
- @docs/component-patterns.md
- 테스트 파일(`*.test.ts`, `*.test.tsx`)인 경우 @docs/testing.md 추가 로드

### 2. Phase 1 — 규칙 검증 (Pass / Fail)

아래 항목은 위반 시 ❌로 명시. 선택이 아닌 수정 필요:

**Export / Import**
- [ ] named export 사용 (Next.js page 파일 제외)
- [ ] Props 타입을 `interface` 아닌 `type`으로 선언
- [ ] feature 내부 경로 직접 접근 금지 — `index.ts` 경유 여부
- [ ] Import 순서: 외부 라이브러리 → 내부 (레이어 순서: app → shared)

**타입**
- [ ] DTO 네이밍 규칙 준수 (`*Request`, `*Response`, `*DTO`)
- [ ] DTO → UI 타입 변환이 `mappers.ts` 외 다른 곳에서 발생하는지

**에러 처리**
- [ ] API 함수에서 의미 없는 `try/catch` re-throw 금지
- [ ] Mutation `onError`에서 `useToastStore` 사용 여부
- [ ] 토스트: `useToastStore` (`@surf/ui/store/toastStore`)
- [ ] 확인 다이얼로그: `useAlertStore` (`@surf/ui/store/alertStore`)

**컴포넌트**
- [ ] 불필요한 `'use client'` 선언 — hook/이벤트 없는 컴포넌트
- [ ] Next.js page 파일에 로직 포함 여부 (app-pages 위임만 해야 함)
- [ ] `serverFetchJsonGuarded` 사용 시 타입 가드 함수 `*/api/guards.ts`에 위치하는지

**Tailwind**
- [ ] 임의값(`bg-[#FEE500]`) 사용 — 디자인 토큰 존재 여부 확인 후 판단

**테스트 파일 한정**
- [ ] CSS 클래스명 검증 금지
- [ ] 컴포넌트 내부 state 직접 접근 금지
- [ ] 함수 호출 횟수 등 구현 세부사항 검증 금지
- [ ] 스냅샷 테스트 금지
- [ ] `renderWithProviders` 사용 여부 (직접 `render` 사용 금지)
- [ ] store 초기화 `beforeEach`에서 처리 여부

### 3. Phase 2 — 코드 리뷰 (제안)

규칙 외 개선 가능한 부분을 제안. 강제 아님:

- 가독성: 네이밍이 역할을 명확히 드러내는지, 단일 책임 원칙 위반 여부
- 누락된 엣지 케이스: null/undefined 방어, 빈 배열, 경계값 처리
- 성능: 불필요한 리렌더링, 과도한 `useEffect`, 무거운 연산의 메모이제이션 누락
- 접근성: ARIA 속성 누락, 키보드 내비게이션 불가한 인터랙티브 요소

### 4. 출력 형식

파일별로 아래 형식으로 출력. **각 지적 항목에 ID를 부여**해 Phase 3에서 선택·참조 가능하게 한다.

- 규칙 위반(❌): `[F-{번호}]` — Fail
- 리뷰 제안(💡): `[S-{번호}]` — Suggestion
- ID는 파일 단위로 리셋되며, 파일이 여러 개면 파일명을 prefix로 붙인다: `PostCard.tsx#F-1`

```
## PostCard.tsx

### 검증 결과
✅ 모든 규칙 통과

### 리뷰 제안
💡 [S-1] `likeCount`가 undefined일 경우 방어 로직 없음 (line 12)
💡 [S-2] 버튼에 aria-label 누락 — 스크린리더에서 의미 전달 안 됨 (line 18)

---

## useDeletePost.ts

### 검증 결과
❌ [F-1] [conventions.md / 에러 처리] onError에서 useToastStore 미사용
   → useAlertStore 직접 호출 중 (line 24)
   → 수정: useToastStore(@surf/ui/store/toastStore)로 교체

❌ [F-2] [conventions.md / 에러 처리] API 함수에서 의미 없는 try/catch re-throw
   → deletePost.ts line 8
   → 수정: catch 블록 제거

### 리뷰 제안
💡 [S-1] 삭제 성공 후 queryClient.invalidateQueries 호출 누락 — 목록 캐시 갱신 안 됨
```

### 5. Phase 3 — 반영 (선택 항목 적용)

Phase 1–2 출력이 끝나면, 사용자에게 **반영할 항목을 선택**하도록 요청한다.

#### 5.1 선택 요청

`AskUserQuestion` 툴로 다음과 같이 묻는다:

- 질문: "어떤 항목을 반영할까요?"
- 선택지:
  - `전체 반영 (❌ + 💡)`
  - `❌ 규칙 위반만 반영`
  - `항목 직접 선택` — 선택 시 추가로 ID 목록을 입력받는다 (예: `useDeletePost.ts#F-1, PostCard.tsx#S-2`)
  - `반영하지 않음` — Phase 3 종료

항목이 하나도 없으면 Phase 3는 건너뛴다.

#### 5.2 적용

선택된 각 항목에 대해 순차 처리:

1. 적용 대상 파일을 `Read`로 읽는다 (이미 컨텍스트에 있지 않은 경우).
2. `Edit` 툴로 최소 diff만 생성한다 — 리뷰 지적과 무관한 라인은 건드리지 않는다.
3. 항목 하나 = 커밋 하나 단위로 처리할 수 있도록 **파일별·항목별로 Edit 호출을 분리**한다. 같은 파일에 여러 항목이 걸려 있다면 항목별로 순서대로 Edit.
4. 적용 실패(Edit 매칭 실패, 충돌 등) 시 해당 항목만 **skip**하고 이유를 기록. 다른 항목은 계속 진행.

#### 5.3 적용 후 검증

반영 직후 아래를 수행:

- 같은 파일에 타입 관련 수정이 있었다면 `pnpm tsc --noEmit` (또는 레포 표준 타입체크 명령) 실행 제안
- 테스트 파일이 수정되었다면 해당 테스트만 실행하도록 명령 제시
- 실제 명령 실행은 사용자 동의(AskUserQuestion) 후에만 수행

#### 5.4 요약 출력

마지막에 반영 결과를 하나의 블록으로 요약:

```
## 반영 결과

### ✅ 적용됨 (2건)
- useDeletePost.ts#F-1 — useToastStore 교체
- deletePost.ts#F-2 — 불필요한 try/catch 제거

### ⏭ 건너뜀 (1건)
- PostCard.tsx#S-2 — 사용자가 선택하지 않음

### ⚠️ 적용 실패 (1건)
- useDeletePost.ts#S-1 — invalidateQueries 위치 모호, 수동 수정 권장

### 후속 제안
- `pnpm tsc --noEmit` 실행 권장
- 변경된 파일: useDeletePost.ts, deletePost.ts
```

## 범위 외

- **선택되지 않은 항목은 절대 수정하지 않는다** — Phase 2 제안이라도 사용자가 고르지 않았다면 건들지 말 것
- 테스트 코드 생성은 하지 않는다 → `/gen-test` 커맨드 사용
- 빌드/번들 최적화, 성능 프로파일링은 다루지 않는다
- 리팩토링성 대규모 구조 변경은 Phase 3 대상이 아니다 — 별도 작업으로 제안만 한다