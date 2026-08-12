import type { ReactNode } from 'react';

export type CountItem = {
  label: string;
  count: number;
};

export type LineSeries = {
  label: string;
  color: string;
  points: CountItem[];
};

const formatNumber = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return value.toLocaleString('ko-KR');
};

const formatPercent = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return `${value.toFixed(1)}%`;
};

const formatShortLabel = (label: string) => {
  if (/^\d{4}[-/.]\d{2}[-/.]\d{2}/.test(label)) return label.slice(5);
  return label;
};

const buildLinePath = (
  points: CountItem[],
  width: number,
  height: number,
  padding: number,
  max: number,
) => {
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
};

const buildLineAreaPath = (
  points: CountItem[],
  width: number,
  height: number,
  padding: number,
  max: number,
) => {
  if (points.length === 0) return '';

  const linePath = buildLinePath(points, width, height, padding, max);
  const firstX = points.length <= 1 ? width / 2 : padding;
  const lastX = points.length <= 1 ? width / 2 : width - padding;
  const baseY = height - padding;

  return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
};

const getLinePointPosition = (
  point: CountItem,
  index: number,
  pointsLength: number,
  width: number,
  height: number,
  padding: number,
  max: number,
) => {
  const x =
    pointsLength <= 1 ? width / 2 : padding + (index / (pointsLength - 1)) * (width - padding * 2);
  const y = height - padding - (point.count / max) * (height - padding * 2);

  return { x, y };
};

const LinePointTooltip = ({
  label,
  value,
  x,
  y,
  color = 'var(--color-foreground-normal)',
}: {
  label: string;
  value: number;
  x: number;
  y: number;
  color?: string;
}) => {
  const tooltipWidth = 140;
  const tooltipHeight = 42;
  const tooltipX = Math.min(Math.max(x - tooltipWidth / 2, 4), 320 - tooltipWidth - 4);
  const tooltipY = Math.max(y - tooltipHeight - 10, 4);

  return (
    <g className="group">
      <circle
        cx={x}
        cy={y}
        r="3"
        className="fill-background-normal"
        stroke={color}
        strokeWidth="2"
      />
      <circle cx={x} cy={y} r="12" fill="transparent" className="cursor-pointer" />
      <circle
        cx={x}
        cy={y}
        r="6"
        fill="transparent"
        stroke={color}
        className="opacity-0 transition-opacity group-hover:opacity-25"
        strokeWidth="3"
      />
      <g className="pointer-events-none opacity-0 transition-opacity group-hover:opacity-100">
        <rect
          x={tooltipX}
          y={tooltipY}
          width={tooltipWidth}
          height={tooltipHeight}
          rx="6"
          className="fill-background-normal stroke-border-normal"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12))' }}
        />
        <text
          x={tooltipX + 10}
          y={tooltipY + 16}
          className="fill-foreground-tertiary text-caption-caption6"
        >
          {formatShortLabel(label)}
        </text>
        <text
          x={tooltipX + 10}
          y={tooltipY + 32}
          className="fill-foreground-normal text-caption-caption6"
        >
          {formatNumber(value)}
        </text>
      </g>
    </g>
  );
};

export const EmptyState = ({ children = '데이터 없음' }: { children?: ReactNode }) => {
  return (
    <div className="border-border-normal rounded-6 text-body-body9 text-foreground-tertiary border p-16 text-center">
      {children}
    </div>
  );
};

export const SingleLineChart = ({ items }: { items: CountItem[] }) => {
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
        <path
          d={buildLineAreaPath(items, width, height, padding, max)}
          className="fill-foreground-normal opacity-[0.08]"
        />
        <path d={path} fill="none" className="stroke-foreground-normal" strokeWidth="2" />
        {items.map((item, index) => {
          const { x, y } = getLinePointPosition(
            item,
            index,
            items.length,
            width,
            height,
            padding,
            max,
          );

          return (
            <LinePointTooltip
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.count}
              x={x}
              y={y}
            />
          );
        })}
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

export const MultiLineChart = ({ series }: { series: LineSeries[] }) => {
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
            key={`${item.label}-area`}
            d={buildLineAreaPath(item.points, width, height, padding, max)}
            fill={item.color}
            opacity="0.08"
          />
        ))}
        {visibleSeries.map((item) => (
          <path
            key={`${item.label}-line`}
            d={buildLinePath(item.points, width, height, padding, max)}
            fill="none"
            stroke={item.color}
            strokeWidth="2"
          />
        ))}
        {visibleSeries.map((item) =>
          item.points.map((point, index) => {
            const { x, y } = getLinePointPosition(
              point,
              index,
              item.points.length,
              width,
              height,
              padding,
              max,
            );

            return (
              <LinePointTooltip
                key={`${item.label}-${point.label}-${index}`}
                label={`${item.label} · ${formatShortLabel(point.label)}`}
                value={point.count}
                x={x}
                y={y}
                color={item.color}
              />
            );
          }),
        )}
      </svg>
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
        {visibleSeries.map((item) => (
          <div
            key={item.label}
            className="text-caption-caption6 text-foreground-tertiary flex items-center gap-4"
          >
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

export const HorizontalBarChart = ({
  items,
  maxItems = 10,
}: {
  items: CountItem[];
  maxItems?: number;
}) => {
  const slicedItems = items.slice(0, maxItems);
  if (slicedItems.length === 0) return <EmptyState />;

  const max = Math.max(...slicedItems.map((item) => item.count), 1);

  return (
    <div className="flex flex-col gap-9">
      {slicedItems.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-8"
          title={`${item.label}: ${formatNumber(item.count)}`}
        >
          <div className="min-w-0">
            <div className="text-caption-caption6 text-foreground-tertiary mb-5 truncate">
              {item.label}
            </div>
            <div className="bg-background-quaternary rounded-max h-8 overflow-hidden">
              <div
                className="bg-foreground-normal rounded-max h-full"
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

export const VerticalBarChart = ({ items }: { items: CountItem[] }) => {
  if (items.length === 0) return <EmptyState />;

  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="border-border-normal rounded-6 border p-12">
      <div className="h-156 flex items-end gap-8">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-6"
            title={`${item.label}: ${formatNumber(item.count)}`}
          >
            <div className="text-caption-caption6 text-foreground-tertiary">
              {formatNumber(item.count)}
            </div>
            <div
              className="bg-foreground-normal rounded-t-3 w-full"
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

export const DonutChart = ({ percent }: { percent: number | null }) => {
  if (percent === null) return <EmptyState>Open Rate 데이터 없음</EmptyState>;

  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;

  return (
    <div
      className="border-border-normal rounded-6 p-18 flex items-center justify-center border"
      title={`Open Rate: ${formatPercent(percent)}`}
    >
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
