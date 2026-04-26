# Testing

## 설정

- **러너**: Vitest
- **DOM**: `@testing-library/react` + `@testing-library/user-event`
- **setup**: `src/test/setup.ts` — jest-dom matchers + next/navigation mock 자동 로드

## 파일 위치

```
src/app-pages/post/write/
└── __tests__/
    └── post-page.integration.test.tsx
```

테스트 파일은 대상 코드와 같은 레이어의 `__tests__/` 폴더에 위치.

## 컴포넌트 테스트 (feature UI)

인터랙션이 있는 컴포넌트만 테스트. 판단 기준:

| 조건 | 방식 |
|------|------|
| `onClick`, `onSubmit` 등 이벤트 + 상태 변화 있음 | RTL 단위 테스트 |
| props 받아서 렌더링만 함 | Storybook 위임 — 테스트 파일 생성 안 함 |

```tsx
// ✅ 인터랙션 있는 컴포넌트 — RTL로 테스트
it('좋아요 버튼 클릭 시 카운트가 화면에 반영된다', async () => {
  vi.mock('@/features/post/model/useLikePost', () => ({
    useLikePost: () => ({ mutate: vi.fn(), isPending: false }),
  }));

  const user = userEvent.setup();
  renderWithProviders(<LikeButton postId={1} initialCount={5} />);

  await user.click(screen.getByRole('button'));
  expect(screen.getByText('6')).toBeInTheDocument(); // 화면 변화 검증
});

// ❌ props만 받아 렌더링하는 컴포넌트 — 테스트 파일 생성 안 함, Storybook으로 위임
```

## 렌더링

`renderWithProviders(ui: ReactNode)`로 QueryClient를 포함한 환경에서 렌더링.  
반환값: `{ queryClient, ...RTL render result }` — `queryClient`로 캐시 직접 조작 가능.

```tsx
import { renderWithProviders } from '@/test/renderWithProviders';

it('제목 입력 후 유지', async () => {
  const user = userEvent.setup();
  const { queryClient } = renderWithProviders(<PostPage mode="create" boardId="1" />);

  await user.type(screen.getByLabelText('제목'), '서프 게시글 제목');
  expect(screen.getByLabelText('제목')).toHaveValue('서프 게시글 제목');
});
```

Zustand 초기 상태 주입이 필요하면 렌더링 전에 `setState` 직접 호출:

```tsx
beforeEach(() => usePostFormStore.getState().resetForm());

it('임시저장 값이 복원된다', () => {
  usePostFormStore.setState({ title: '임시 제목' }); // ← 렌더 전에 주입
  renderWithProviders(<PostPage mode="create" boardId="1" />);
  expect(screen.getByLabelText('제목')).toHaveValue('임시 제목');
});
```

## 모킹

### next/navigation

`src/test/mocks/nextNavigation.ts`에서 자동 모킹됨 (setup에서 import).  
테스트 내에서 경로 조작이 필요하면:

```tsx
import { setMockPathname, resetMockNavigation } from '@/test/mocks/nextNavigation';

beforeEach(() => resetMockNavigation());

it('특정 경로에서 렌더링', () => {
  setMockPathname('/post/123');
  renderWithProviders(<Header />);
});
```

### API / 훅 모킹

실제 API 호출을 막을 때는 `vi.mock`으로 훅 단위 모킹:

```tsx
vi.mock('@/features/post/create-post/model/useCreatePost', () => ({
  useCreatePost: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ postId: 123 }),
    isPending: false,
  }),
}));
```

### Zustand store

store 초기화는 `beforeEach`에서 reset:

```tsx
beforeEach(() => {
  usePostFormStore.getState().resetForm();
});
```

### 훅 단위 테스트 패턴

**뮤테이션 훅** — `onSuccess` / `onError` 분기 검증:

```tsx
it('삭제 성공 시 토스트가 표시된다', async () => {
  const { result } = renderHook(() => useDeletePost(), {
    wrapper: createWrapper(),
  });

  await act(async () => {
    await result.current.mutateAsync(1);
  });

  expect(screen.getByText('삭제되었습니다.')).toBeInTheDocument();
});
```

**쿼리 훅** — queryKey, 반환 데이터 구조 검증:

```tsx
it('postId로 올바른 queryKey가 생성된다', () => {
  const { result } = renderHook(() => usePost(42), {
    wrapper: createWrapper(),
  });

  expect(result.current.queryKey).toEqual(['post', 42]);
});
```

## 무엇을 테스트하는가

| 대상 | 방식 |
|------|------|
| 페이지 수준 사용자 시나리오 | `app-pages/__tests__/` 통합 테스트 |
| feature 컴포넌트 (인터랙션 있음) | `features/**/__tests__/` RTL 단위 테스트 |
| feature 컴포넌트 (순수 표시용) | Storybook 위임 — 테스트 파일 생성 안 함 |
| mappers, 순수 유틸 함수 | 단위 테스트 (입력 → 출력만 검증, 모킹 없음) |
| 뮤테이션 훅 | `onSuccess` / `onError` 분기 검증 |
| 쿼리 훅 | `queryKey`, `queryFn` 반환값 검증 |

TipTap 등 외부 에디터는 store 직접 조작으로 우회 (`useStore.setState(...)`).

## 테스트하지 않는 것

- **API 함수 (`*/api/*.ts`)** — 훅 레벨 테스트에서 커버됨. axios/fetch 동작 자체를 검증하는 건 의미 없음
- **Zustand store 액션** — 단순 `set` 액션은 통합 테스트에서 커버됨. store만 독립 테스트하지 않음
- **`*/index.ts`** — re-export 파일은 테스트 대상 아님
- **UI 스냅샷 테스트** — Storybook으로 대체

```tsx
// ❌ 컴포넌트 내부 state 직접 검증
expect(component.state.isOpen).toBe(true);

// ❌ CSS 클래스명 검증 — 스타일은 Storybook으로 확인
expect(element).toHaveClass('flex', 'items-center');

// ❌ 함수 호출 횟수 등 구현 세부사항
expect(mockFn).toHaveBeenCalledTimes(1);

// ✅ 사용자가 실제로 보거나 할 수 있는 것을 검증
expect(screen.getByText('삭제되었습니다.')).toBeInTheDocument();
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```

검증 기준은 항상 **사용자 관점** (`screen.getByRole`, `getByLabelText`, `getByText`)
