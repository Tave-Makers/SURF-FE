'use client';

import { useMyPosts, useScraps } from '@/features/post/api/usePosts';
import { PostCard } from '@/entities/post/ui/PostCard';
import { PostType } from '@/entities/post/model/types';
import { transformApiResponseToPosts } from '@/entities/post/api/mappers';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

interface PostListProps {
  type: PostType;
  page?: number;
  size?: number;
}

export const PostList = ({ type, page = 0, size = 10 }: PostListProps) => {
  const { accessToken } = useAuthStore();

  // 내가 작성한 게시글 조회
  const {
    data: myPostsData,
    isLoading: isLoadingMyPosts,
    error: myPostsError,
  } = useMyPosts(page, size);

  // 스크랩한 게시글 조회
  const {
    data: scrapsData,
    isLoading: isLoadingScraps,
    error: scrapsError,
  } = useScraps(page, size);

  // 인증되지 않은 경우 화면
  if (!accessToken) {
    return <div>로그인이 필요합니다. 로그인 페이지로 이동합니다...</div>;
  }

  // 로딩 화면
  if (isLoadingMyPosts || isLoadingScraps) {
    return <div>게시글을 불러오는 중...</div>;
  }

  //에러 발생 화면
  if (myPostsError || scrapsError) {
    const error = myPostsError || scrapsError;
    return (
      <div>
        <div>에러가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 에러'}</div>
        <div>
          {error instanceof Error && error.message.includes('403')
            ? '인증이 필요합니다. 다시 로그인해주세요.'
            : '잠시 후 다시 시도해주세요.'}
        </div>
      </div>
    );
  }

  const currentData = type === 'my-posts' ? myPostsData : scrapsData;

  // 게시글이 없을 때의 화면
  if (!currentData) {
    return (
      <div>
        <div>
          {type === 'my-posts' ? '작성한 게시글이 없습니다.' : '스크랩한 게시글이 없습니다.'}
        </div>
      </div>
    );
  }

  // 불러온 데이터 매핑 (추후 백엔드랑 타입 맞춰야 함)
  const posts = transformApiResponseToPosts(currentData);

  return (
    <div className="flex flex-col gap-4 px-[1rem]">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => console.log(`Post ${post.id} clicked`)}
          />
        ))
      ) : (
        <div>
          <div>
            {type === 'my-posts' ? '작성한 게시글이 없습니다.' : '스크랩한 게시글이 없습니다.'}
          </div>
        </div>
      )}
    </div>
  );
};
