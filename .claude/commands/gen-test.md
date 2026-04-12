# gen-test

대상 파일의 테스트 코드를 자동 생성합니다.

## 사용법

```
/gen-test <파일경로> [파일경로2] ...
```

## 실행 흐름

대상 파일이 여러 개면 Task 툴로 병렬 실행.
각 Task는 아래 흐름을 독립적으로 수행.

### 1. 컨텍스트 로드

각 Task 시작 시 반드시 아래 문서를 먼저 읽는다:
- @docs/testing.md
- @docs/conventions.md

### 2. 파일 분류 및 생성 여부 판단

대상 파일을 읽고 아래 기준으로 분류:

| 파일 패턴 | 테스트 종류 | 생성 위치 |
|-----------|------------|-----------|
| `app-pages/**/ui/*.tsx` | 통합 테스트 | `app-pages/**/__tests__/*.integration.test.tsx` |
| `features/**/ui/*.tsx` | 인터랙션 있으면 RTL 단위 테스트, 없으면 생성 안 함 | `features/**/__tests__/*.test.tsx` |
| `features/**/model/use*.ts` | 훅 단위 테스트 | `features/**/__tests__/*.test.ts` |
| `features/**/model/mappers.ts` | 순수 함수 단위 테스트 | `features/**/__tests__/mappers.test.ts` |
| `shared/lib/*.ts` | 순수 함수 단위 테스트 | `shared/lib/__tests__/*.test.ts` |

**생성하지 않는 파일:**
- `*/api/*.ts` — 훅 레벨에서 커버됨
- `*/model/use*Store.ts` — 통합 테스트에서 커버됨
- `*/index.ts` — re-export 파일

`features/**/ui/*.tsx` 판단 기준:
- `onClick`, `onSubmit` 등 이벤트 핸들러 + 상태 변화 있음 → RTL 테스트 생성
- props만 받아 렌더링 → 생성 안 함, 아래 메시지 출력:
  ```
  ⏭ PostCard.tsx — 순수 표시용 컴포넌트. Storybook으로 위임.
  ```

### 3. 테스트 작성 기준

**통합 테스트 (`app-pages`)**
- `renderWithProviders` 사용
- 사용자 시나리오 기반: `userEvent`로 조작 → 화면 변화 검증
- API 훅은 `vi.mock`으로 모킹
- Zustand store 초기화는 `beforeEach`에서 `resetForm()` 호출

**컴포넌트 단위 테스트 (`features/**/ui`)**
- `renderWithProviders` 사용
- 인터랙션 → 화면 변화 검증 (mutate 호출 횟수 검증 금지)
- 의존하는 훅은 `vi.mock`으로 모킹

**훅 단위 테스트 (`model/use*.ts`)**
- 뮤테이션 훅: `mutateAsync` 호출 후 `onSuccess` / `onError` 분기 검증
- 쿼리 훅: `queryKey`, `queryFn` 반환값 검증
- `renderHook` + `createWrapper()` 사용

**순수 함수 (`mappers`, `shared/lib`)**
- 입력 → 출력 검증만
- 모킹 없음
- 엣지 케이스 포함: null 필드, 빈 배열, 경계값

### 4. 공통 금지 사항

testing.md "테스트하지 않는 것" 섹션을 반드시 준수:
- CSS 클래스명 검증 금지
- 컴포넌트 내부 state 직접 접근 금지
- 함수 호출 횟수 등 구현 세부사항 검증 금지
- UI 스냅샷 테스트 금지

### 5. 테스트 실행

생성된 테스트 파일을 즉시 실행:

```bash
pnpm vitest run <생성된 테스트 파일 경로>
```

### 6. 실패 감지 및 수정

실패한 테스트가 있으면 아래 순서로 처리:

**원인 분류:**

| 원인 | 판단 기준 | 조치 |
|------|-----------|------|
| 모킹 누락/잘못됨 | `Cannot read properties of undefined` 등 | 모킹 대상 및 반환값 수정 |
| 잘못된 쿼리셀렉터 | `Unable to find role` / `Unable to find label` | `getByRole`, `getByLabelText` 등 셀렉터 수정 |
| 비동기 처리 누락 | `not wrapped in act(...)` 경고 | `await`, `waitFor` 추가 |
| 테스트 케이스 자체가 잘못됨 | 실제 컴포넌트 동작과 기대값 불일치 | 대상 파일 재분석 후 케이스 재작성 |
| 소스 코드 버그 | 테스트는 올바른데 구현이 잘못됨 | 수정하지 않고 보고만 함 |

**수정 제한:**
- 테스트 코드만 수정한다. 소스 코드는 절대 수정하지 않는다.
- 소스 코드 버그로 판단되면 수정 없이 보고만 한다.
- 최대 3회 재시도. 3회 후에도 실패하면 중단하고 보고한다.

### 7. 재실행 및 통과 확인

수정 후 동일 명령으로 재실행. 전체 통과 확인:

```bash
pnpm vitest run <테스트 파일 경로>
```

### 8. 완료 보고

**정상 케이스:**
```
✅ app-pages/post/__tests__/post-page.integration.test.tsx 생성 (3개 케이스) — 통과
✅ features/post/__tests__/LikeButton.test.tsx 생성 (2개 케이스) — 통과
⏭ features/post/ui/PostCard.tsx — 순수 표시용 컴포넌트. Storybook으로 위임.
```

**수정 후 통과:**
```
✅ features/post/__tests__/mappers.test.ts 생성 (5개 케이스)
  └ 1회 수정: getByText → getByRole('cell')로 셀렉터 변경 후 통과
```

**소스 코드 버그 감지:**
```
⚠️ features/post/__tests__/useDeletePost.test.ts — 테스트 통과 불가
  └ 원인: onError에서 useToastStore 미사용, useAlertStore 직접 호출 중
  └ 수정 필요: features/post/model/useDeletePost.ts line 24
  └ 참고: conventions.md 에러 처리 섹션
```

**3회 재시도 초과:**
```
❌ features/post/__tests__/PostForm.test.tsx — 3회 시도 후 실패
  └ 마지막 오류: [에러 메시지]
  └ 원인 추정: [분석 내용]
  └ 직접 확인 필요
```

## 범위 외

- 테스트 생성 및 수정만 한다. 소스 코드는 절대 수정하지 않는다.
- 코드 리뷰는 하지 않는다 → `/review` 커맨드 사용


