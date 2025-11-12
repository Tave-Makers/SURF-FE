'use client';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection, PostDetail } from '@/widgets/post-detail/PostBodySection';

type PostDetailPageProps = {
  boardId: string;
  postId: string;
};

export default function PostDetailPage({ boardId, postId }: PostDetailPageProps) {
  console.log('boardId:', boardId);
  console.log('postId:', postId);
  const dummyPost: PostDetail = {
    id: 39,
    title: '전반기 시상식 안내',
    content:
      '안녕하세요, 최루문입니다.\n\n금주 진행되는 전반기 시상식 안내드립니다.\n\n🕒 일시: 10월 23일 (토) 14시\n📍 장소: 세종대학교 대양AI센터 B107호\n\n시상식 참석 필수이며, 발표 타임테이블은 추후 공지드리겠습니다.',
    postedAt: '2025.11.01',
    boardId: 1,
    nickname: '홍길동',
    likeCount: 12,
    likedByMe: true,
    scrapCount: 12,
    scrappedByMe: true,
    hasSchedule: true,
    imageUrlList: [
      {
        imageId: 1,
        originalUrl:
          'https://jstyle07.jpg3.kr//RENEWAL/snapskin/main_banner/69084bb71baab_152911_4162.jpg',
        sequence: 1,
      },
      {
        imageId: 2,
        originalUrl:
          'https://jstyle07.jpg3.kr/RENEWAL/snapskin/main_promotion/690957263f93e_103014_4002.jpg',
        sequence: 2,
      },
    ],
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
          <PostHeader
            title={dummyPost.title}
            category={{ title: '공지사항' }}
            subCategory={{ title: '행사' }}
          />
          <PostBodySection post={dummyPost} />
        </main>
      </div>

      {/* 댓글 입력창 */}
      <div className="sticky bottom-0 w-full">
        <ActionBar placeholder="댓글을 입력해주세요" />
      </div>
    </div>
  );
}
