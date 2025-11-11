export default function PostDetailPage({
  params,
}: {
  params: { boardId: string; postId: string };
}) {
  const dummyPost = {
    boardId: params.boardId,
    id: params.postId,
    title: '전반기 시상식 안내',
    content: '금주 진행되는 전반기 시상식 안내입니다.',
  };

  return (
    <div className="p-10">
      <h1>
        [{dummyPost.boardId}] {dummyPost.title}
      </h1>
      <p>{dummyPost.content}</p>
    </div>
  );
}
