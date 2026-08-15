'use client';

import {
  DonutChart,
  EmptyState,
  HorizontalBarChart,
  MultiLineChart,
  SingleLineChart,
  VerticalBarChart,
  type CountItem,
} from '@surf/ui/charts';
import { Input } from '@surf/ui/input';
import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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
      {helper ? (
        <div className="text-caption-caption6 text-foreground-tertiary mt-6">{helper}</div>
      ) : null}
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <section className="flex min-w-0 flex-col gap-12">
      <h2 className="text-title-title3 text-foreground-normal">{title}</h2>
      {children}
    </section>
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
    <div className="border-border-normal min-w-0 overflow-hidden rounded-6 border">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-[2.5rem]" />
          <col />
          <col className="w-[5rem]" />
        </colgroup>
        <thead className="bg-background-quaternary">
          <tr>
            <th className="text-caption-caption6 text-foreground-tertiary px-8 py-8 text-left">
              #
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary min-w-0 truncate px-8 py-8 text-left">
              {labelHeader}
            </th>
            <th className="text-caption-caption6 text-foreground-tertiary px-10 py-8 text-right">
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
                <td className="text-caption-caption6 text-foreground-normal min-w-0 truncate px-8 py-8">
                  {item.label}
                </td>
                <td className="text-caption-caption6 text-foreground-normal truncate px-10 py-8 text-right">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
    <div className="flex flex-col gap-16">
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
  const tabIdPrefix = useId();
  const panelIdPrefix = useId();
  const tabRefs = useRef<Record<DashboardTab, HTMLButtonElement | null>>({
    traffic: null,
    kpi: null,
    funnel: null,
    churn: null,
    content: null,
    notice: null,
    debug: null,
  });
  const { preset, range, setPreset, setCustomRange } = useDashboardDateRange();
  const { data, isPending, isError, error, refetch } = useDashboardQuery(range);

  const periodText = useMemo(() => {
    if (!data) return `${range.startDate} ~ ${range.endDate}`;

    return `${data.period.start_date} ~ ${data.period.end_date}`;
  }, [data, range.endDate, range.startDate]);

  const getTabId = (tab: DashboardTab) => `${tabIdPrefix}-${tab}`;
  const getPanelId = (tab: DashboardTab) => `${panelIdPrefix}-${tab}-panel`;

  const focusTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tab: DashboardTab) => {
    const currentIndex = DASHBOARD_TABS.findIndex((item) => item.value === tab);
    const lastIndex = DASHBOARD_TABS.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight') {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    }

    if (event.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
    }

    if (event.key === 'End') {
      nextIndex = lastIndex;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    focusTab(DASHBOARD_TABS[nextIndex].value);
  };

  return (
    <main className="scroll-touch flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="bg-background-normal sticky top-0 z-10">
        <div className="relative">
          <div
            className="dashboard-tab-scrollbar border-border-normal flex gap-14 overflow-x-auto border-b px-13 pb-4"
            role="tablist"
            aria-label="대시보드 섹션"
            aria-orientation="horizontal"
          >
            {DASHBOARD_TABS.map((tab) => {
              const isActive = tab.value === activeTab;

              return (
                <button
                  key={tab.value}
                  ref={(node) => {
                    tabRefs.current[tab.value] = node;
                  }}
                  type="button"
                  id={getTabId(tab.value)}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={getPanelId(tab.value)}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => focusTab(tab.value)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.value)}
                  className={[
                    'relative shrink-0 py-12 text-body-body8 transition-colors',
                    isActive ? 'text-foreground-normal' : 'text-foreground-tertiary',
                  ].join(' ')}
                >
                  {tab.label}
                  {isActive ? (
                    <span
                      className="bg-foreground-normal absolute inset-x-0 bottom-0 h-2"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
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
          <div className="text-body-body9 text-foreground-tertiary py-19 text-center">
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

        {DASHBOARD_TABS.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <div
              key={tab.value}
              id={getPanelId(tab.value)}
              role="tabpanel"
              aria-labelledby={getTabId(tab.value)}
              hidden={!isActive}
            >
              {isActive && data ? <DashboardContent activeTab={tab.value} data={data} /> : null}
            </div>
          );
        })}
      </div>
    </main>
  );
};
