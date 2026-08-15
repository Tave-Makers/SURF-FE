export type DashboardDateRangeParams = {
  startDate?: string;
  endDate?: string;
};

export type DashboardPeriodResponse = {
  start_date: string;
  end_date: string;
};

export type TrafficPointResponse = {
  users: number;
};

export type DauPointResponse = TrafficPointResponse & {
  date: string;
};

export type WauPointResponse = TrafficPointResponse & {
  week: string;
};

export type MauPointResponse = TrafficPointResponse & {
  month: string;
};

export type TrafficResponse = {
  dau: DauPointResponse[];
  wau: WauPointResponse[];
  mau: MauPointResponse[];
  active_rate: number | null;
  stickiness: {
    dau_mau: number | null;
    wau_mau: number | null;
  };
};

export type KpiDailyResponse = {
  date: string;
  posts: number;
  comments: number;
  likes_add: number;
  scraps_add: number;
  activity_index: number;
};

export type FunnelResponse = {
  funnel: string;
  attempt_event: string;
  success_event: string;
  attempt_events: number;
  attempt_users: number;
  success_events: number;
  matched: number;
  conversion: number;
};

export type ChurnBucketResponse = {
  status_bucket: string;
  users: number;
};

export type ChurnUserResponse = {
  user_id: string;
  last_active_at: string;
  days_inactive: number;
  status_bucket: string;
};

export type ChurnResponse = {
  buckets: ChurnBucketResponse[];
  users: ChurnUserResponse[];
};

export type PageUrlTopResponse = {
  page_url: string;
  count: number;
};

export type PagePathTopResponse = {
  page_path: string;
  count: number;
};

export type ContentResponse = {
  page_url_top: PageUrlTopResponse[];
  page_path_top: PagePathTopResponse[];
};

export type NoticeSampleRowResponse = {
  user_id: string;
  event_time_kst: string;
  event_type: string;
  page_path: string;
  page_name?: string;
  dwell_time_ms?: number;
  is_open: boolean;
};

export type NoticeResponse = {
  available: boolean;
  open_rate: number | null;
  reach: number | null;
  avg_dwell_ms: number | null;
  dwell_rows: number;
  sample_rows: NoticeSampleRowResponse[];
};

export type DebugResponse = {
  event_type_top: {
    event_type: string;
    count: number;
  }[];
  page_view_rows: number;
  active_home_matched_rows: number;
  request_id_col: string | null;
  request_id_fill_rate?: number | null;
  warnings: string[];
};

export type DashboardResponse = {
  period: DashboardPeriodResponse;
  traffic: TrafficResponse;
  kpi_daily: KpiDailyResponse[];
  funnel: FunnelResponse[];
  churn: ChurnResponse;
  content: ContentResponse;
  notice: NoticeResponse;
  debug: DebugResponse;
};
