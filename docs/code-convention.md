# Frontend Conventions

본 문서는 Surf 프로젝트의 **브랜치 / 커밋 / 코드 스타일** 규칙을 정의합니다.  
기수가 바뀌더라도 일관성 있는 코드 품질과 협업 효율성을 유지하기 위함입니다.

---

## 브랜치 컨벤션

### 브랜치 네이밍

기본 규칙: `타입/작업-내용`

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat/` | 새로운 기능 개발 | `feat/login-api-123` |
| `fix/` | 버그 수정 | `fix/navbar-overlap-210` |
| `hotfix/` | 운영 중 긴급 버그 수정 (main 직접 패치) | `hotfix/prod-payment-error-555` |
| `refactor/` | 리팩토링 (동작 변경 없음) | `refactor/user-service-98` |
| `ui/` | UI, CSS 스타일 작업 | `ui/homepage-header-45` |
| `docs/` | 문서 작업 | `docs/contribution-guide-12` |
| `chore/` | 빌드/설정/배포/의존성 | `chore/update-eslint-config-77` |
| `test/` | 테스트 코드 추가/수정 | `test/user-service-coverage-331` |
| `release/` | 배포 준비 브랜치 | `release/v1.0.0` |

---

## 커밋 컨벤션

기본 규칙: `타입: 작업 내용 (#이슈번호 선택)`

```
feat: 로그인 API 연동 (#39)
```

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: 회원가입 기능 추가` |
| `fix` | 버그 수정 | `fix: 비밀번호 유효성 검사 버그 수정` |
| `refactor` | 리팩토링 | `refactor: 유저 서비스 모듈 구조 리팩토링` |
| `style` | UI/포맷 관련 (기능 영향 없음) | `style: 로그인 버튼 색상 변경` |
| `format` | 코드 포맷팅 (prettier, eslint) | `format: prettier 규칙 적용` |
| `docs` | 문서 작업 | `docs: README에 실행 방법 추가` |
| `chore` | 환경 설정/빌드/배포/의존성 | `chore: ESLint, Prettier 초기 세팅` |
| `add` | 신규 파일/라이브러리 추가 | `add: date-fns 라이브러리 추가` |
| `del` | 불필요한 코드/파일 제거 | `del: legacy API 모듈 제거` |
| `test` | 테스트 코드 추가/수정 | `test: 유저 서비스 단위 테스트 보강` |

---

## 네이밍 컨벤션

| 케이스 | 적용 대상 | 예시 |
|--------|-----------|------|
| `camelCase` | 함수, 변수, 파일명 | `getUserInfo`, `userList`, `usePostForm.ts` |
| `PascalCase` | 컴포넌트, 클래스, 인터페이스, 타입 | `LoginForm`, `PostDetail` |
| `UPPER_SNAKE_CASE` | 상수, 환경변수 | `MAX_RETRY_COUNT`, `NEXT_PUBLIC_API_URL` |
| `kebab-case` | 폴더명, URL | `post-form/`, `/user-profile` |

---

## Export / Import

### Export

컴포넌트는 **named export**. default export는 Next.js page 파일에서만 사용.

```tsx
// ✅
export const PostCard = () => { ... };

// ❌ (page 파일 제외)
export default function PostCard() { ... }
```

### Import 순서

ESLint로 강제됨. 외부 라이브러리 → 내부 (레이어 순서: app → shared).

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PostCard } from '@/entities/post/ui/PostCard';
import { cn } from '@/shared/lib/cn';
```

---

## 타입 분리 규칙


```
features/post/
├── api/
│   └── types.ts   # API DTO만: PostApiResponse, CreatePostRequest
└── model/
    └── types.ts   # UI 도메인 타입: PostFormState, PostFilter
```

- API DTO → UI 타입 변환은 `*/model/mappers.ts`에서만 처리
- DTO 네이밍: `*Request`, `*Response`, `*DTO`

---

## Tailwind

- 토큰 기반 클래스 사용: `bg-background-normal`, `text-foreground-static-black`
- 임의 값(`bg-[#FEE500]`)은 디자인 토큰이 없을 때만 허용
- `cn()` 유틸로 조건부 클래스 조합

```tsx
// ✅
<div className={cn('flex items-center', isActive && 'text-primary')} />
```

---

## 에러 처리

**API 함수 (`*/api/*.ts`)**: `try/catch` 없이 그냥 던지게 둔다. 변환 목적이 없는 catch는 작성하지 않는다.

```ts
// ✅
export async function deletePostSchedule(postId: number, scheduleId: number): Promise<void> {
  await axiosInstance.delete(`/v1/posts/${postId}/schedules/${scheduleId}`);
}

// ❌ — 잡았다가 그냥 re-throw하면 onError에서 이중 로깅만 발생
export async function deletePostSchedule(postId: number, scheduleId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/posts/${postId}/schedules/${scheduleId}`);
  } catch (error) {
    console.error('...', error);
    throw error;
  }
}
```

예외적으로 HTTP 상태 코드를 도메인 에러로 변환해야 할 때만 catch 허용:

```ts
// ✅ 변환 목적이 있을 때
} catch (error) {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    throw new PostNotFoundError(postId);
  }
  throw error;
}
```

**Mutation 훅 (`*/model/use*.ts`)**: 로깅과 사용자 피드백은 `onError` 한 곳에서만 처리.  
토스트는 `useToastStore` (`@surf/ui/store/toastStore`), 확인 다이얼로그는 `useAlertStore` (`@surf/ui/store/alertStore`) 사용.

```ts
import { useToastStore } from '@surf/ui/store/toastStore';

const showToast = useToastStore((s) => s.show);

return useMutation({
  mutationFn: logout,
  onSuccess: () => showToast('로그아웃 되었습니다.'),
  onError: (error) => {
    console.error('로그아웃 실패:', error);
    showToast('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
  },
});
```

**서버 컴포넌트**: `serverFetchJsonGuarded`가 throw하면 Next.js `not-found.tsx` / `error.tsx`로 위임.

---

✍️ 본 규칙은 기수 변경 시에도 동일하게 적용되며, 필요에 따라 추가/수정될 수 있습니다.
