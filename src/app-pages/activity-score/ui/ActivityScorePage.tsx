import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';

export default function ActivityScorePage() {
  // TODO: API 응답으로 변경
  const mockResponse = {
    code: 200,
    message: '조회 성공',
    data: {
      score: 156,
      records: {
        singleList: [
          { activityType: 'UPLOAD_INSTAGRAM_STORY', count: 4 },
          { activityType: 'ENGAGE_TECH_SEMINAR', count: 0 },
          { activityType: 'EARLY_BIRD', count: 2 },
        ],
        group: {
          totalCount: 5,
          list: [
            { activityType: 'WRITE_WIL', count: 3 },
            { activityType: 'UPLOAD_TAVE_REVIEW', count: 2 },
          ],
        },
      },
    },
  };

  return (
    <div className="pt-50">
      <ActivityScoreCard score={mockResponse.data.score} records={mockResponse.data.records} />
    </div>
  );
}
