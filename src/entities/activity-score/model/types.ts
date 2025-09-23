// 단일 활동 - 인스타 스토리, 기술 세미나 참석, 얼리버드
export type SingleActivity = {
  activityType: string;
  count: number;
};

// 그룹 활동 - 기술 블로그 작성, 활동 후기 작성
export type GroupActivity = {
  totalCount: number;
  list: SingleActivity[];
};

// 전체 응답
export type ActivityRecords = {
  singleList: SingleActivity[];
  group: GroupActivity;
};

// API 응답 DTO
export type ActivityResponse = {
  code: number;
  message: string;
  data: {
    score: number;
    records: ActivityRecords;
  };
};
