# Component Patterns

## 폴더 구조

feature/entity 내 슬라이스 예시:

```
features/post/
├── api/
│   ├── types.ts        # DTO 타입
│   ├── guards.ts       # 타입 가드 함수
│   └── postApi.ts      # fetch 함수
├── model/
│   ├── types.ts        # UI 도메인 타입
│   ├── mappers.ts      # DTO → UI 변환
│   ├── usePost.ts      # TanStack Query 훅
│   └── usePostStore.ts # Zustand store
├── ui/
│   └── PostCard.tsx    # 컴포넌트
└── index.ts            # public API (re-export)
```

## Public API (index.ts)

외부 레이어에서 feature/entity 내부 경로에 직접 접근하지 않는다.  
반드시 `index.ts`를 통해서만 import.

```ts
// features/post/index.ts
export { PostCard } from './ui/PostCard';
export { usePost } from './model/usePost';
export type { PostDetail } from './model/types';
```

```ts
// ✅ 외부 레이어에서 사용할 때
import { PostCard, usePost } from '@/features/post';

// ❌ 내부 경로 직접 접근
import { PostCard } from '@/features/post/ui/PostCard';
```

## 서버 vs 클라이언트 컴포넌트

**기본값은 서버 컴포넌트.** `'use client'`는 아래 경우에만 추가:

- `useState`, `useEffect`, `useRef` 등 React hook 사용
- 이벤트 핸들러 직접 사용 (`onClick` 등)
- 브라우저 API 접근 (`window`, `localStorage`)
- TanStack Query의 `useQuery` / Zustand store 사용

```tsx
// ✅ 서버 컴포넌트 — 데이터 fetch 후 props로 전달
import { serverFetchJsonGuarded } from '@/shared/api/serverFetchJsonGuarded';

const PostListPage = async () => {
  const posts = await serverFetchJsonGuarded('/posts', isPostListResponse);
  return <PostList posts={posts} />;
};

export default PostListPage;
```

```tsx
// ✅ 클라이언트 컴포넌트 — 상호작용 필요
'use client';

import { useState } from 'react';

export const LikeButton = ({ postId, initialCount }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked((v) => !v)}>
      {liked ? '♥' : '♡'} {initialCount}
    </button>
  );
};
```

## Props 타입 선언

컴포넌트 파일 내 `type`으로 선언. 외부에서 재사용이 필요한 경우만 `export`.

```tsx
// ✅
type PostCardProps = {
  postId: number;
  title: string;
  writer: string;
  likeCount: number;
};

export const PostCard = ({ postId, title, writer, likeCount }: PostCardProps) => {
  ...
};
```

```tsx
// ❌ interface 사용, 불필요한 export
export interface IPostCardProps { ... }
```

## 데이터 페칭 패턴

클라이언트에서는 TanStack Query 훅으로 추상화:

```tsx
// features/post/model/usePost.ts
import { useQuery } from '@tanstack/react-query';
import { getPost } from '../api/postApi';

export const usePost = (postId: number) =>
  useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  });
```

```tsx
// ui/PostDetail.tsx
'use client';

export const PostDetail = ({ postId }: { postId: number }) => {
  const { data, isPending } = usePost(postId);
  if (isPending) return <Spinner />;
  return <div>{data.title}</div>;
};
```

## 상태관리 분리 원칙

- **서버 상태** (API 데이터): TanStack Query
- **UI 전역 상태** (모달 열림 여부, 폼 임시저장 등): Zustand
- **로컬 상태** (단일 컴포넌트 내): `useState`

Zustand store는 `*/model/use*Store.ts`에 위치:

```tsx
// features/post/post-form/model/usePostFormStore.ts
import { create } from 'zustand';

type PostFormState = {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  resetForm: () => void;
};

export const usePostFormStore = create<PostFormState>((set) => ({
  title: '',
  content: '',
  setTitle: (title) => set({ title }),
  resetForm: () => set({ title: '', content: '' }),
}));
```

## Next.js Page 파일

route 파일은 app-pages로 위임만 함. 로직 없음.

```tsx
// app/(protected)/post/[id]/page.tsx ✅
import PostDetailPage from '@/app-pages/post/detail/ui/PostDetailPage';

const Page = ({ params }: { params: { id: string } }) => (
  <PostDetailPage postId={Number(params.id)} />
);

export default Page;
```

## 서버 API 호출

서버 컴포넌트에서는 `serverFetchJsonGuarded`로 타입 안전하게 fetch.  
두 번째 인자는 `Guard<T>` — `(x: unknown) => x is T` 시그니처의 타입 가드 함수.

```ts
// entities/post/api/guards.ts
import type { Guard } from '@/shared/api/types';
import { commonResponseGuard } from '@/shared/api/types';
import { isNumber, isString } from '@/shared/api/primitives';
import type { PostDetail } from './types';

const isPostDetailData: Guard<PostDetail> = (x): x is PostDetail => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return isNumber(o.postId) && isString(o.title);
};

// API 응답이 { code, message, data } 구조면 commonResponseGuard로 래핑
export const isPostDetailResponse = commonResponseGuard(isPostDetailData);
```

```tsx
// 서버 컴포넌트에서 사용
import { serverFetchJsonGuarded } from '@/shared/api/serverFetchJsonGuarded';
import { isPostDetailResponse } from '../api/guards';

const data = await serverFetchJsonGuarded(`/posts/${id}`, isPostDetailResponse);
```

## 레이어 판단 기준

신규 컴포넌트 생성 전 아래 기준으로 레이어를 결정한다.

| 조건 | 레이어 | 예시 |
|------|--------|------|
| 디자인 시스템 원자 단위. 도메인 무관 | `packages/ui` | Button, Input, Badge, Card |
| 도메인 데이터 표시. packages/ui 조합. 인터랙션 없음 | `entities` | PostCard, UserAvatar, CommentItem |
| 사용자 인터랙션 + API 연동 (useQuery / useMutation) 포함 | `features` | PostCreateForm, LikeButton, LoginForm |
| 여러 features/entities를 조합한 페이지 단위 블록 | `widgets` | PostFeed, ProfileSection, CommentThread |

### 판단이 애매할 때 체크리스트

API 호출이 있는가?
Y → features 이상
N → 아래로
여러 features/entities를 조합하는가?
Y → widgets
N → 아래로
특정 도메인 데이터(Post, User 등)를 표시하는가?
Y → entities
N → packages/ui


### packages/ui 재사용 원칙

신규 컴포넌트 생성 전 `packages/ui`에서 재사용 가능한 컴포넌트를 먼저 확인한다.
직접 구현하지 않고 조합으로 해결할 수 있으면 조합을 우선한다.

```tsx
// ✅ packages/ui 조합
import { Card, Badge } from '@surf/ui';

export const PostCard = ({ title, category }: PostCardProps) => (
  <Card>
    <Badge>{category}</Badge>
    <h3>{title}</h3>
  </Card>
);

// ❌ 직접 구현
export const PostCard = ({ title, category }: PostCardProps) => (
  <div className="rounded-lg border p-4">
    <span className="rounded bg-gray-100 px-2 py-1 text-sm">{category}</span>
    <h3>{title}</h3>
  </div>
);
```