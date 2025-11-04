export default function NoticeDetailPage({ params }: { params: { id: string } }) {
  const dummyNotice = {
    id: params.id,
    title: '전반기 시상식 안내',
    content: '금주 진행되는 전반기 시상식 안내입니다.',
  };

  return (
    <div className="p-10">
      <h1>{dummyNotice.title}</h1>
      <p>{dummyNotice.content}</p>
    </div>
  );
}
