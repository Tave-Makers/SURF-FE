'use client';

import { Input } from '@surf/ui/input';
import { useMemo, useState, type ReactNode } from 'react';
import type {
  DashboardResponse,
  EventDistributionResponse,
  PathDistributionResponse,
} from '@/features/dashboard/api/types';
import { useDashboardDateRange } from '@/features/dashboard/model/useDashboardDateRange';
import { useDashboardQuery } from '@/features/dashboard/model/useDashboardQuery';

type DashboardTab = 'traffic' | 'kpi' | 'funnel' | 'content' | 'debug';

type CountItem = {
  label: string;
  count: number;
};

type FunnelItem = {
  funnel: string;
  attemptEvents: number;
  successEvents: number;
};

const DASHBOARD_TABS: { value: DashboardTab; label: string }[] = [
  { value: 'traffic', label: '1.1 Traffic' },
  { value: 'kpi', label: '1.2 KPI' },
  { value: 'funnel', label: '1.3 Funnel' },
  { value: 'content', label: '1.5 Content' },
  { value: 'debug', label: 'Debug' },
];

const PRESETS = [
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
  { value: 'month', label: '이번 달' },
] as const;

const POST_KEYWORDS = ['post.create', 'post.created', 'post.submit', 'post.add'];
const COMMENT_KEYWORDS = ['comment.create', 'comment.submit', 'comment.add'];
const LIKE_KEYWORDS = ['like.add', 'like.create', 'like'];
const SCRAP_KEYWORDS = ['scrap.add', 'scrap.create', 'scrap'];
const PAGE_VIEW_KEYWORDS = ['page.view', 'page_view'];

function formatNumber(value?: number) {
  if (value === undefined || Number.isNaN(value)) return '-';
  return value.toLocaleString('ko-KR');
}

function normalizeEventLabel(event: string) {
  return event.toLowerCase().replaceAll('_', '.');
}

function sumMatchingEvents(events: EventDistributionResponse[], keywords: string[]) {
  return events.reduce((sum, item) => {
    const label = normalizeEventLabel(item.event);
    const isMatched = keywords.some((keyword) =>
      label.includes(keyword.toLowerCase().replaceAll('_', '.')),
    );

    return isMatched ? sum + item.count : sum;
  }, 0);
}

function toCountItems(items: EventDistributionResponse[] | PathDistributionResponse[]) {
  return items.map((item) => ({
    label: 'event' in item ? item.event : item.path,
    count: item.count,
  }));
}

function getKpiMetrics(data: DashboardResponse) {
  const posts = sumMatchingEvents(data.event_distribution, POST_KEYWORDS);
  const comments = sumMatchingEvents(data.event_distribution, COMMENT_KEYWORDS);
  const likes = sumMatchingEvents(data.event_distribution, LIKE_KEYWORDS);
  const scraps = sumMatchingEvents(data.event_distribution, SCRAP_KEYWORDS);

  return {
    posts,
    comments,
    likes,
    scraps,
    activityIndex: posts * 3 + comments * 2 + (likes + scraps),
  };
}

function getFunnelItems(data: DashboardResponse): FunnelItem[] {
  const definitions = [
    {
      funnel: 'Post Create',
      attemptKeywords: POST_KEYWORDS,
      successKeywords: ['post.succeeded', 'post.success', 'post.created'],
    },
    {
      funnel: 'Comment Create',
      attemptKeywords: COMMENT_KEYWORDS,
      successKeywords: ['comment.succeeded', 'comment.success', 'comment.created'],
    },
    {
      funnel: 'Like',
      attemptKeywords: LIKE_KEYWORDS,
      successKeywords: ['like.succeeded', 'like.success'],
    },
    {
      funnel: 'Scrap',
      attemptKeywords: SCRAP_KEYWORDS,
      successKeywords: ['scrap.succeeded', 'scrap.success'],
    },
  ];

  return definitions.map((item) => ({
    funnel: item.funnel,
    attemptEvents: sumMatchingEvents(data.event_distribution, item.attemptKeywords),
    successEvents: sumMatchingEvents(data.event_distribution, item.successKeywords),
  }));
}

function getHomeMatchRows(data: DashboardResponse) {
  return (
    sumMatchingEvents(data.event_distribution, ['home.view']) +
    data.path_distribution
      .filter((item) => item.path.includes('/home'))
      .reduce((sum, item) => sum + item.count, 0)
  );
}

const MetricCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="border-border-normal bg-background-normal-lighter rounded-6 border p-12">
      <div className="text-caption-caption6 text-foreground-tertiary">{label}</div>
      <div className="text-title-title2 text-foreground-normal mt-8">{value}</div>
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

const SimpleLineChart = ({ items }: { items: CountItem[] }) => {
  const width = 320;
  const height = 156;
  const padding = 18;
  const max = Math.max(...items.map((item) => item.count), 1);
  const points = items.map((item, index) => {
    const x =
      items.length <= 1
        ? width / 2
        : padding + (index / (items.length - 1)) * (width - padding * 2);
    const y = height - padding - (item.count / max) * (height - padding * 2);

    return { x, y, item };
  });
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

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
        {points.map((point) => (
          <circle
            key={point.item.label}
            cx={point.x}
            cy={point.y}
            r="3"
            className="fill-foreground-normal"
          />
        ))}
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

const SimpleBarChart = ({ items }: { items: CountItem[] }) => {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="flex flex-col gap-9">
      {items.map((item) => (
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

const DistributionTable = ({ items }: { items: CountItem[] }) => {
  return (
    <div className="border-border-normal overflow-hidden rounded-6 border">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            <th className="text-caption-caption6 text-foreground-tertiary w-44 px-8 py-8 text-left">
              #
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              name
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary w-70 px-8 py-8 text-right">
              cnt
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
            items.slice(0, 10).map((item, index) => (
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

const FunnelTable = ({ items }: { items: FunnelItem[] }) => {
  return (
    <div className="border-border-normal overflow-hidden rounded-6 border">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-background-quaternary">
          <tr>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              funnel
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary w-92 px-8 py-8 text-right">
              attempt
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary w-92 px-8 py-8 text-right">
              success
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.funnel} className="border-border-normal border-t">
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8">
                {item.funnel}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.attemptEvents)}
              </td>
              <td className="text-caption-caption6 text-foreground-normal px-8 py-8 text-right">
                {formatNumber(item.successEvents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TrafficPanel = ({ data }: { data: DashboardResponse }) => {
  const latestActivity = data.daily_activity.at(-1);

  return (
    <div className="flex flex-col gap-22">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="DAU latest" value={formatNumber(latestActivity?.active_users)} />
        <MetricCard label="Observed Users" value={formatNumber(data.summary.unique_users)} />
      </div>
      <Section title="DAU">
        <SimpleLineChart
          items={data.daily_activity.map((item) => ({
            label: item.date,
            count: item.active_users,
          }))}
        />
      </Section>
    </div>
  );
};

const KpiPanel = ({ data }: { data: DashboardResponse }) => {
  const metrics = getKpiMetrics(data);

  return (
    <div className="flex flex-col gap-22">
      <div className="grid grid-cols-2 gap-10">
        <MetricCard label="Posts" value={formatNumber(metrics.posts)} />
        <MetricCard label="Comments" value={formatNumber(metrics.comments)} />
        <MetricCard label="Likes add" value={formatNumber(metrics.likes)} />
        <MetricCard label="Scraps add" value={formatNumber(metrics.scraps)} />
        <MetricCard label="Activity Index" value={formatNumber(metrics.activityIndex)} />
      </div>
      <Section title="KPI total">
        <SimpleBarChart
          items={[
            { label: 'Posts', count: metrics.posts },
            { label: 'Comments', count: metrics.comments },
            { label: 'Likes add', count: metrics.likes },
            { label: 'Scraps add', count: metrics.scraps },
            { label: 'Activity Index', count: metrics.activityIndex },
          ]}
        />
      </Section>
    </div>
  );
};

const FunnelPanel = ({ data }: { data: DashboardResponse }) => {
  const funnels = getFunnelItems(data);

  return (
    <div className="flex flex-col gap-22">
      <FunnelTable items={funnels} />
      <Section title="Attempt events">
        <SimpleBarChart
          items={funnels.map((item) => ({
            label: item.funnel,
            count: item.attemptEvents,
          }))}
        />
      </Section>
    </div>
  );
};

const ContentPanel = ({ data }: { data: DashboardResponse }) => {
  return (
    <div className="flex flex-col gap-22">
      <Section title="page_path Top">
        <DistributionTable items={toCountItems(data.path_distribution)} />
      </Section>
    </div>
  );
};

const DebugPanel = ({ data }: { data: DashboardResponse }) => {
  const pageViewRows = sumMatchingEvents(data.event_distribution, PAGE_VIEW_KEYWORDS);
  const homeMatchedRows = getHomeMatchRows(data);

  return (
    <div className="flex flex-col gap-24">
      <Section title="event_type Top">
        <DistributionTable items={toCountItems(data.event_distribution)} />
      </Section>
      <Section title="page_view rows">
        <div className="text-body-body9 text-foreground-normal">
          page_view rows = {formatNumber(pageViewRows)}
        </div>
      </Section>
      <Section title="Active match check">
        <div className="text-body-body9 text-foreground-normal">
          active(home) matched rows = {formatNumber(homeMatchedRows)}
        </div>
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
  if (activeTab === 'content') return <ContentPanel data={data} />;

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
