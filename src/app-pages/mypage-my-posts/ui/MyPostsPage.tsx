'use client';

import { PostList } from '@/widgets/post-list';
// import { useState } from 'react';

export default function MyPostsPage() {
  // const [currentPage, setCurrentPage] = useState(0);
  // const pageSize = 10;

  return (
    <div className="flex flex-col">
      <PostList type="my-posts" />

      {/* 페이지네이션은 필요에 따라 나중에 구현 */}
      {/* <div className="flex justify-center gap-2 mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-3 py-1">{currentPage + 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-3 py-1 border rounded"
        >
          다음
        </button>
      </div> */}
    </div>
  );
}
