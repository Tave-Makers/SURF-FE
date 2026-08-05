'use client';

import { Input } from '@surf/ui/input';
import { useMemo, useState, type ReactNode } from 'react';
import type {
  ChurnUserResponse,
  DashboardResponse,
  FunnelResponse,
  KpiDailyResponse,
  NoticeSampleRowResponse,
} from '@/features/dashboard/api/types';
import { useDashboardDateRange } from '@/features/dashboard/model/useDashboardDateRange';
import { useDashboardQuery } from '@/features/dashboard/model/useDashboardQuery';

type DashboardTab = 'traffic' | 'kpi' | 'funnel' | 'churn' | 'content' | 'notice' | 'debug';

type CountItem = {
  label: string;
  count: number;
};

type LineSeries = {
  label: string;
  color: string;
  points: CountItem[];
};

const DASHBOARD_TABS: { value: DashboardTab; label: string }[] = [
  { value: 'traffic', label: '1.1 Traffic' },
  { value: 'kpi', label: '1.2 KPI' },
  { value: 'funnel', label: '1.3 Funnel' },
  { value: 'churn', label: '1.4 Churn' },
  { value: 'content', label: '1.5 Content' },
  { value: 'notice', label: '1.6 Notice' },
  { value: 'debug', label: 'Debug' },
];

const PRESETS = [
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
  { value: 'month', label: '이번 달' },
] as const;

function formatNumber(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return value.toLocaleString('ko-KR');
}

function formatPercent(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return `${value.toFixed(1)}%`;
}

function formatMs(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return `${(value / 1000).toFixed(2)}s`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sumKpi(data: KpiDailyResponse[], key: keyof Omit<KpiDailyResponse, 'date'>) {
  return data.reduce((sum, item) => sum + item[key], 0);
}

function buildLinePath(points: CountItem[], width: number, height: number, padding: number, max: number) {
  return points
    .map((item, index) => {
      const x =
        points.length <= 1
          ? width / 2
          : padding + (index / (points.length - 1)) * (width - padding * 2);
      const y = height - padding - (item.count / max) * (height - padding * 2);

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

const MetricCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) => {
  return (
    <div className="border-border-normal bg-background-normal-lighter rounded-6 border p-12">
      <div className="text-caption-caption6 text-foreground-tertiary">{label}</div>
      <div className="text-title-title2 text-foreground-normal mt-8">{value}</div>
      {helper ? <div className="text-caption-caption6 text-foreground-tertiary mt-6">{helper}</div> : null}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section className="flex flex-col gap-12">
      <h2 className="text-title-title3 text-foreground-normal">{title}</h2>
      {children}
    </section>
  );
};

const EmptyState = ({ children = '데이터 없음' }: { children?: ReactNode }) => {
  return (
    <div className="border-border-normal rounded-6 border p-16 text-center text-body-body9 text-foreground-tertiary">
      {children}
    </div>
  );
};

const SingleLineChart = ({ items }: { items: CountItem[] }) => {
  if (items.length === 0) return <EmptyState />;

  const width = 320;
  const height = 156;
  const padding = 18;
  const max = Math.max(...items.map((item) => item.count), 1);
  const path = buildLinePath(items, width, height, padding, max);

  return (
    <div className="border-border-normal rounded-6 border p-12">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-156 w-full" role="img">
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="stroke-border-normal"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          className="stroke-border-normal"
        />
        <path d={path} fill="none" className="stroke-foreground-normal" strokeWidth="2" />
      </svg>
      <div className="mt-8 flex justify-between gap-8">
        {items.slice(0, 4).map((item) => (
          <div key={item.label} className="text-caption-caption6 text-foreground-tertiary">
            {item.label.slice(5)}
          </div>
        ))}
      </div>
    </div>
  );
};

const MultiLineChart = ({ series }: { series: LineSeries[] }) => {
  const visibleSeries = series.filter((item) => item.points.length > 0);
  if (visibleSeries.length === 0) return <EmptyState />;

  const width = 320;
  const height = 168;
  const padding = 18;
  const max = Math.max(
    ...visibleSeries.flatMap((item) => item.points.map((point) => point.count)),
    1,
  );
  const labels = visibleSeries[0]?.points ?? [];

  return (
    <div className="border-border-normal rounded-6 border p-12">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-168 w-full" role="img">
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          className="stroke-border-normal"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          className="stroke-border-normal"
        />
        {visibleSeries.map((item) => (
          <path
            key={item.label}
            d={buildLinePath(item.points, width, height, padding, max)}
            fill="none"
            stroke={item.color}
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
        {visibleSeries.map((item) => (
          <div key={item.label} className="flex items-center gap-4 text-caption-caption6 text-foreground-tertiary">
            <span className="h-6 w-6 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between gap-8">
        {labels.slice(0, 4).map((item) => (
          <div key={item.label} className="text-caption-caption6 text-foreground-tertiary">
            {item.label.slice(5)}
          </div>
        ))}
      </div>
    </div>
  );
};

const HorizontalBarChart = ({ items, maxItems = 10 }: { items: CountItem[]; maxItems?: number }) => {
  const slicedItems = items.slice(0, maxItems);
  if (slicedItems.length === 0) return <EmptyState />;

  const max = Math.max(...slicedItems.map((item) => item.count), 1);

  return (
    <div className="flex flex-col gap-9">
      {slicedItems.map((item) => (
        <div key={item.label} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-8">
          <div className="min-w-0">
            <div className="mb-5 truncate text-caption-caption6 text-foreground-tertiary">
              {item.label}
            </div>
            <div className="bg-background-quaternary h-8 overflow-hidden rounded-max">
              <div
                className="bg-foreground-normal h-full rounded-max"
                style={{ width: `${Math.max((item.count / max) * 100, 2)}%` }}
              />
            </div>
          </div>
          <div className="text-body-body9 text-foreground-normal text-right">
            {formatNumber(item.count)}
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBarChart = ({ items }: { items: CountItem[] }) => {
  if (items.length === 0) return <EmptyState />;

  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="border-border-normal rounded-6 border p-12">
      <div className="flex h-156 items-end gap-8">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-6">
            <div className="text-caption-caption6 text-foreground-tertiary">
              {formatNumber(item.count)}
            </div>
            <div
              className="bg-foreground-normal w-full rounded-t-3"
              style={{ height: `${Math.max((item.count / max) * 112, 4)}px` }}
            />
            <div className="text-caption-caption6 text-foreground-tertiary w-full truncate text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ percent }: { percent: number | null }) => {
  if (percent === null) return <EmptyState>Open Rate 데이터 없음</EmptyState>;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;

  return (
    <div className="border-border-normal flex items-center justify-center rounded-6 border p-18">
      <svg viewBox="0 0 120 120" className="h-140 w-140" role="img">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="stroke-background-quaternary"
          strokeWidth="14"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          className="stroke-foreground-normal"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          strokeWidth="14"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="65" textAnchor="middle" className="fill-foreground-normal text-body-body8">
          {formatPercent(percent)}
        </text>
      </svg>
    </div>
  );
};

const DistributionTable = ({
  items,
  labelHeader = 'name',
  countHeader = 'cnt',
}: {
  items: CountItem[];
  labelHeader?: string;
  countHeader?: string;
}) => {
  return (
    <div className="border-border-normal overflow-hidden rounded-6 border">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            <th className="text-caption-caption6 text-foreground-tertiary w-36 px-8 py-8 text-left">
              #
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              {labelHeader}
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary w-70 px-8 py-8 text-right">
              {countHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-body-body9 text-foreground-tertiary px-8 py-16 text-center"
              >
                데이터 없음
              </td>
            </tr>
          ) : (
            items.slice(0, 20).map((item, index) => (
              <tr key={`${item.label}-${index}`} className="border-border-normal border-t">
                <td className="text-caption-caption6 text-foreground-tertiary px-8 py-8">
                  {index}
                </td>
                <td className="text-caption-caption6 text-foreground-normal truncate px-8 py-8">
                  {item.label}
                </td>
                <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                  {formatNumber(item.count)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const FunnelTable = ({ items }: { items: FunnelResponse[] }) => {
  return (
    <div className="dashboard-wide-table border-border-normal overflow-x-auto rounded-6 border">
      <table className="min-w-[42rem] table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            {['funnel', 'attempt_events', 'attempt_users', 'success_events', 'matched', 'conversion'].map(
              (header) => (
                <th
                  key={header}
                  className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.funnel} className="border-border-normal border-t">
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.funnel}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.attempt_events)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.attempt_users)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.success_events)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.matched)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatPercent(item.conversion)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ChurnUserTable = ({ users }: { users: ChurnUserResponse[] }) => {
  return (
    <div className="dashboard-wide-table border-border-normal overflow-x-auto rounded-6 border">
      <table className="min-w-[34rem] table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              user_id
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              last_active
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-right">
              inactive
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              status
            </th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, 50).map((item) => (
            <tr key={`${item.user_id}-${item.last_active_at}`} className="border-border-normal border-t">
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.user_id}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {formatDateTime(item.last_active_at)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.days_inactive)}d
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.status_bucket}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NoticeSampleTable = ({ rows }: { rows: NoticeSampleRowResponse[] }) => {
  if (rows.length === 0) return <EmptyState>sample rows 데이터 없음</EmptyState>;

  return (
    <div className="dashboard-wide-table border-border-normal overflow-x-auto rounded-6 border">
      <table className="min-w-[46rem] table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            {['user_id', 'time', 'event_type', 'page_path', 'dwell', 'open'].map((header) => (
              <th
                key={header}
                className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((item, index) => (
            <tr key={`${item.user_id}-${item.event_time_kst}-${index}`} className="border-border-normal border-t">
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.user_id}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {formatDateTime(item.event_time_kst)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.event_type}
              </td>
              <td className="text-caption-caption6 text-foreground-normal truncate px-8 py-8">
                {item.page_path}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatMs(item.dwell_time_ms)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.is_open ? 'true' : 'false'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TrafficPanel = ({ data }: { data: DashboardResponse }) => {
  const latestDau = data.traffic.dau.at(-1);
  const latestWau = data.traffic.wau.at(-1);
  const latestMau = data.traffic.mau.at(-1);

  return (
    <div className="flex flex-col gap-22">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="DAU latest" value={formatNumber(latestDau?.users)} />
        <MetricCard label="WAU latest" value={formatNumber(latestWau?.users)} />
        <MetricCard label="MAU latest" value={formatNumber(latestMau?.users)} />
        <MetricCard label="Active Rate" value={formatPercent(data.traffic.active_rate)} />
        <MetricCard label="DAU/MAU" value={formatPercent(data.traffic.stickiness.dau_mau)} />
        <MetricCard label="WAU/MAU" value={formatPercent(data.traffic.stickiness.wau_mau)} />
      </div>
      <Section title="DAU">
        <SingleLineChart
          items={data.traffic.dau.map((item) => ({ label: item.date, count: item.users }))}
        />
      </Section>
      <Section title="WAU">
        <SingleLineChart
          items={data.traffic.wau.map((item) => ({ label: item.week, count: item.users }))}
        />
      </Section>
      <Section title="MAU">
        <SingleLineChart
          items={data.traffic.mau.map((item) => ({ label: item.month, count: item.users }))}
        />
      </Section>
    </div>
  );
};

const KpiPanel = ({ data }: { data: DashboardResponse }) => {
  const posts = sumKpi(data.kpi_daily, 'posts');
  const comments = sumKpi(data.kpi_daily, 'comments');
  const likes = sumKpi(data.kpi_daily, 'likes_add');
  const scraps = sumKpi(data.kpi_daily, 'scraps_add');
  const activityIndex = sumKpi(data.kpi_daily, 'activity_index');

  return (
    <div className="flex flex-col gap-22">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="Posts" value={formatNumber(posts)} />
        <MetricCard label="Comments" value={formatNumber(comments)} />
        <MetricCard label="Likes add" value={formatNumber(likes)} />
        <MetricCard label="Scraps add" value={formatNumber(scraps)} />
        <MetricCard label="Activity Index" value={formatNumber(activityIndex)} />
      </div>
      <Section title="Daily KPI">
        <MultiLineChart
          series={[
            {
              label: 'Posts',
              color: '#20232d',
              points: data.kpi_daily.map((item) => ({ label: item.date, count: item.posts })),
            },
            {
              label: 'Comments',
              color: '#4169e1',
              points: data.kpi_daily.map((item) => ({ label: item.date, count: item.comments })),
            },
            {
              label: 'Likes',
              color: '#0f8f5f',
              points: data.kpi_daily.map((item) => ({ label: item.date, count: item.likes_add })),
            },
            {
              label: 'Scraps',
              color: '#e1191d',
              points: data.kpi_daily.map((item) => ({ label: item.date, count: item.scraps_add })),
            },
          ]}
        />
      </Section>
      <Section title="Activity Index">
        <SingleLineChart
          items={data.kpi_daily.map((item) => ({ label: item.date, count: item.activity_index }))}
        />
      </Section>
    </div>
  );
};

const FunnelPanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-22">
      <FunnelTable items={data.funnel} />
      <Section title="Attempt to Matched">
        <HorizontalBarChart
          items={data.funnel.flatMap((item) => [
            { label: `${item.funnel} Attempt`, count: item.attempt_events },
            { label: `${item.funnel} Matched`, count: item.matched },
          ])}
        />
      </Section>
    </div>
  );
};

const ChurnPanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-22">
      <Section title="Status Bucket">
        <VerticalBarChart
          items={data.churn.buckets.map((item) => ({
            label: item.status_bucket,
            count: item.users,
          }))}
        />
      </Section>
      <Section title="Inactive Users">
        <ChurnUserTable users={data.churn.users} />
      </Section>
    </div>
  );
};

const ContentPanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-22">
      <Section title="page_url Top">
        <DistributionTable
          items={data.content.page_url_top.map((item) => ({
            label: item.page_url,
            count: item.count,
          }))}
          labelHeader="page_url"
        />
      </Section>
      <Section title="page_path Top">
        <DistributionTable
          items={data.content.page_path_top.map((item) => ({
            label: item.page_path,
            count: item.count,
          }))}
          labelHeader="page_path"
        />
      </Section>
    </div>
  );
};

const NoticePanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-22">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="Notice Open Rate" value={formatPercent(data.notice.open_rate)} />
        <MetricCard label="Notice Reach" value={formatNumber(data.notice.reach)} />
        <MetricCard label="Avg dwell" value={formatMs(data.notice.avg_dwell_ms)} />
        <MetricCard label="Dwell rows" value={formatNumber(data.notice.dwell_rows)} />
      </div>
      <Section title="Open Rate">
        {data.notice.available ? (
          <DonutChart percent={data.notice.open_rate} />
        ) : (
          <EmptyState>Notice 데이터가 아직 제공되지 않습니다.</EmptyState>
        )}
      </Section>
      <Section title="Sample rows">
        <NoticeSampleTable rows={data.notice.sample_rows} />
      </Section>
    </div>
  );
};

const DebugPanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-24">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="page_view rows" value={formatNumber(data.debug.page_view_rows)} />
        <MetricCard
          label="active(home)"
          value={formatNumber(data.debug.active_home_matched_rows)}
        />
        <MetricCard label="request_id_col" value={data.debug.request_id_col ?? '-'} />
        <MetricCard
          label="request_id fill"
          value={formatPercent(data.debug.request_id_fill_rate ?? null)}
        />
      </div>
      <Section title="event_type Top">
        <DistributionTable
          items={data.debug.event_type_top.map((item) => ({
            label: item.event_type,
            count: item.count,
          }))}
          labelHeader="event_type"
        />
      </Section>
      <Section title="Warnings">
        {data.debug.warnings.length > 0 ? (
          <div className="flex flex-col gap-8">
            {data.debug.warnings.map((warning) => (
              <div
                key={warning}
                className="border-border-normal rounded-6 border px-12 py-10 text-body-body9 text-foreground-normal"
              >
                {warning}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState>경고 없음</EmptyState>
        )}
      </Section>
    </div>
  );
};

const DashboardContent = ({
  activeTab,
  data,
}: {
  activeTab: DashboardTab;
  data: DashboardResponse;
}) => {
  if (activeTab === 'traffic') return <TrafficPanel data={data} />;
  if (activeTab === 'kpi') return <KpiPanel data={data} />;
  if (activeTab === 'funnel') return <FunnelPanel data={data} />;
  if (activeTab === 'churn') return <ChurnPanel data={data} />;
  if (activeTab === 'content') return <ContentPanel data={data} />;
  if (activeTab === 'notice') return <NoticePanel data={data} />;

  return <DebugPanel data={data} />;
};

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('traffic');
  const { preset, range, setPreset, setCustomRange } = useDashboardDateRange();
  const { data, isPending, isError, error, refetch } = useDashboardQuery(range);

  const periodText = useMemo(() => {
    if (!data) return `${range.startDate} ~ ${range.endDate}`;

    return `${data.period.start_date} ~ ${data.period.end_date}`;
  }, [data, range.endDate, range.startDate]);

  return (
    <main className="scroll-touch flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="bg-background-normal sticky top-0 z-10">
        <div className="relative">
          <div className="dashboard-tab-scrollbar border-border-normal flex gap-14 overflow-x-auto border-b px-13 pb-4">
            {DASHBOARD_TABS.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={[
                    'relative shrink-0 py-12 text-body-body8 transition-colors',
                    isActive ? 'text-foreground-normal' : 'text-foreground-tertiary',
                  ].join(' ')}
                >
                  {tab.label}
                  {isActive ? (
                    <span className="bg-foreground-normal absolute inset-x-0 bottom-0 h-2" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="from-background-normal pointer-events-none absolute bottom-4 right-0 top-0 w-24 bg-gradient-to-l to-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-18 px-13 py-16">
        <div className="flex flex-wrap gap-8">
          {PRESETS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPreset(item.value)}
              className={[
                'rounded-max border px-12 py-8 text-body-body9',
                preset === item.value
                  ? 'border-foreground-normal bg-background-secondary-darker text-foreground-normal'
                  : 'border-border-normal text-foreground-tertiary',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Input
            type="date"
            value={range.startDate}
            onChange={(value) => {
              setPreset('custom');
              setCustomRange((prev) => ({ ...prev, startDate: value }));
            }}
            aria-label="시작일"
          />
          <Input
            type="date"
            value={range.endDate}
            onChange={(value) => {
              setPreset('custom');
              setCustomRange((prev) => ({ ...prev, endDate: value }));
            }}
            aria-label="종료일"
          />
        </div>

        <div className="text-caption-caption6 text-foreground-tertiary">조회 기간: {periodText}</div>

        {isPending ? (
          <div className="text-body-body9 text-foreground-tertiary py-40 text-center">
            대시보드 데이터를 불러오는 중입니다.
          </div>
        ) : null}

        {isError ? (
          <div className="border-border-normal rounded-6 border p-14">
            <div className="text-body-body8 text-foreground-normal">데이터 조회에 실패했습니다.</div>
            <div className="text-caption-caption6 text-foreground-tertiary mt-6">
              {error.message}
            </div>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="text-body-body8 text-foreground-normal mt-12 underline"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {data ? <DashboardContent activeTab={activeTab} data={data} /> : null}
      </div>
    </main>
  );
};
