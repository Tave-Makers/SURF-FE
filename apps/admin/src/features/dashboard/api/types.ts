export type DashboardDateRangeParams = {
  startDate?: string;
  endDate?: string;
};

export type DashboardPeriodResponse = {
  start_date: string;
  end_date: string;
};

export type DashboardSummaryResponse = {
  total_events: number;
  unique_users: number;
  success_events: number;
  error_events: number;
  success_rate: number;
  error_rate: number;
  average_duration_ms: number;
};

export type DailyActivityResponse = {
  date: string;
  event_count: number;
  active_users: number;
  error_count: number;
};

export type EventDistributionResponse = {
  event: string;
  count: number;
};

export type StatusDistributionResponse = {
  status: number;
  count: number;
};

export type ActorRoleDistributionResponse = {
  actor_role: string;
  count: number;
};

export type PathDistributionResponse = {
  path: string;
  count: number;
};

export type DashboardResponse = {
  period: DashboardPeriodResponse;
  summary: DashboardSummaryResponse;
  daily_activity: DailyActivityResponse[];
  event_distribution: EventDistributionResponse[];
  status_distribution: StatusDistributionResponse[];
  actor_role_distribution: ActorRoleDistributionResponse[];
  path_distribution: PathDistributionResponse[];
};
