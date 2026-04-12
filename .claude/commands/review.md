# review

변경된 코드를 컨벤션 기준으로 검증하고 리뷰합니다.

## 사용법

```
/review <파일경로> [파일경로2] ...
/review --staged        # git staging area 전체 대상
```

`--staged` 사용 시 아래 명령으로 대상 파일 목록을 먼저 확인:

```bash
git diff --cached --name-only --diff-filter=ACM
```

## 실행 흐름

대상 파일이 여러 개면 Task 툴로 병렬 실행.
각 Task는 아래 흐름을 독립적으로 수행.

### 1. 컨텍스트 로드

각 Task 시작 시 반드시 아래 문서를 먼저 읽는다:
- @docs/conventions.md
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

파일별로 아래 형식으로 출력:

```
## PostCard.tsx

### 검증 결과
✅ 모든 규칙 통과

### 리뷰 제안
💡 `likeCount`가 undefined일 경우 방어 로직 없음 (line 12)
💡 버튼에 aria-label 누락 — 스크린리더에서 의미 전달 안 됨 (line 18)

---

## useDeletePost.ts

### 검증 결과
❌ [conventions.md / 에러 처리] onError에서 useToastStore 미사용
   → useAlertStore 직접 호출 중 (line 24)
   → 수정: useToastStore(@surf/ui/store/toastStore)로 교체

❌ [conventions.md / 에러 처리] API 함수에서 의미 없는 try/catch re-throw
   → deletePost.ts line 8
   → 수정: catch 블록 제거

### 리뷰 제안
💡 삭제 성공 후 queryClient.invalidateQueries 호출 누락 — 목록 캐시 갱신 안 됨
```

## 범위 외

- 코드 자동 수정은 하지 않는다 — 수정 방향 제시만
- 테스트 코드 생성은 하지 않는다 → `/gen-test` 커맨드 사용
- 빌드/번들 최적화, 성능 프로파일링은 다루지 않는다
