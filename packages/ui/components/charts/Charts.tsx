'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type CountItem = {
  label: string;
  count: number;
};

export type LineSeries = {
  label: string;
  color: string;
  points: CountItem[];
};

type TooltipRow = {
  label?: string;
  color?: string;
  value: number;
};

type Plot = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  innerWidth: number;
  innerHeight: number;
};

const CHART_HEIGHT = 132;
const DEFAULT_WIDTH = 320;
const TICK_COUNT = 4;
const PADDING = { top: 10, right: 12, bottom: 22, left: 40 };

const formatNumber = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return value.toLocaleString('ko-KR');
};

const formatPercent = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return `${value.toFixed(1)}%`;
};

const formatAxisNumber = (value: number) => {
  if (value === 0) return '0';
  if (Math.abs(value) >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (Math.abs(value) >= 1_000) return `${Number((value / 1_000).toFixed(1))}k`;
  return `${Number(value.toFixed(1))}`;
};

const formatShortLabel = (label: string) => {
  if (/^\d{4}[-/.]\d{2}[-/.]\d{2}/.test(label)) return label.slice(5);
  return label;
};

const truncateLabel = (label: string, maxChars: number) => {
  if (maxChars <= 1 || label.length <= maxChars) return label;
  return `${label.slice(0, Math.max(maxChars - 1, 1))}…`;
};

const buildScale = (rawMax: number, tickCount = TICK_COUNT) => {
  const safeMax = Math.max(rawMax, 1);
  const rawStep = safeMax / tickCount;
  const exponent = Math.floor(Math.log10(rawStep));
  const base = 10 ** exponent;
  const fraction = rawStep / base;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;

  let step = niceFraction * base;
  if (Number.isInteger(safeMax) && step < 1) step = 1;

  const max = step * tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => step * index);

  return { max, ticks };
};

const getPlot = (width: number): Plot => {
  const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);

  return {
    left: PADDING.left,
    right: PADDING.left + innerWidth,
    top: PADDING.top,
    bottom: CHART_HEIGHT - PADDING.bottom,
    innerWidth,
    innerHeight: CHART_HEIGHT - PADDING.top - PADDING.bottom,
  };
};

const getPointX = (index: number, length: number, plot: Plot) => {
  if (length <= 1) return plot.left + plot.innerWidth / 2;
  return plot.left + (index / (length - 1)) * plot.innerWidth;
};

const getPointY = (value: number, max: number, plot: Plot) => {
  return plot.bottom - (value / max) * plot.innerHeight;
};

const getHoverBand = (index: number, length: number, plot: Plot) => {
  if (length <= 1) return { x: plot.left, width: plot.innerWidth };

  const step = plot.innerWidth / (length - 1);
  const start = index === 0 ? plot.left : plot.left + (index - 0.5) * step;
  const end = index === length - 1 ? plot.right : plot.left + (index + 0.5) * step;

  return { x: start, width: Math.max(end - start, 1) };
};

const buildLinePath = (points: CountItem[], max: number, plot: Plot) => {
  return points
    .map((item, index) => {
      const x = getPointX(index, points.length, plot);
      const y = getPointY(item.count, max, plot);

      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
};

const buildLineAreaPath = (points: CountItem[], max: number, plot: Plot) => {
  if (points.length === 0) return '';

  const linePath = buildLinePath(points, max, plot);
  const firstX = getPointX(0, points.length, plot);
  const lastX = getPointX(points.length - 1, points.length, plot);

  return `${linePath} L ${lastX} ${plot.bottom} L ${firstX} ${plot.bottom} Z`;
};

const useChartWidth = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width;
      if (nextWidth && nextWidth > 0) setWidth(nextWidth);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
};

const ChartGrid = ({ ticks, max, plot }: { ticks: number[]; max: number; plot: Plot }) => {
  return (
    <g aria-hidden="true">
      {ticks.map((tick) => {
        const y = getPointY(tick, max, plot);
        const isBaseline = tick === 0;

        return (
          <g key={tick}>
            <line
              x1={plot.left}
              y1={y}
              x2={plot.right}
              y2={y}
              className="stroke-border-normal"
              strokeWidth="1"
              strokeDasharray={isBaseline ? undefined : '3 3'}
              opacity={isBaseline ? 1 : 0.6}
            />
            <text
              x={plot.left - 6}
              y={y + 3}
              textAnchor="end"
              className="fill-foreground-tertiary text-caption-caption6"
            >
              {formatAxisNumber(tick)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const XAxisLabels = ({ labels, plot }: { labels: string[]; plot: Plot }) => {
  if (labels.length === 0) return null;

  const maxLabels = Math.max(2, Math.min(5, Math.floor(plot.innerWidth / 58)));
  const indices =
    labels.length <= maxLabels
      ? labels.map((_, index) => index)
      : Array.from({ length: maxLabels }, (_, index) =>
          Math.round((index / (maxLabels - 1)) * (labels.length - 1)),
        );

  return (
    <g aria-hidden="true">
      {Array.from(new Set(indices)).map((index) => {
        const x = getPointX(index, labels.length, plot);
        const anchor =
          labels.length === 1
            ? 'middle'
            : index === 0
              ? 'start'
              : index === labels.length - 1
                ? 'end'
                : 'middle';

        return (
          <text
            key={index}
            x={x}
            y={CHART_HEIGHT - 6}
            textAnchor={anchor}
            className="fill-foreground-tertiary text-caption-caption6"
          >
            {formatShortLabel(labels[index])}
          </text>
        );
      })}
    </g>
  );
};

const HoverBands = ({
  length,
  plot,
  onHover,
  getBand = getHoverBand,
}: {
  length: number;
  plot: Plot;
  onHover: (index: number | null) => void;
  getBand?: (index: number, length: number, plot: Plot) => { x: number; width: number };
}) => {
  return (
    <g onMouseLeave={() => onHover(null)}>
      {Array.from({ length }, (_, index) => {
        const band = getBand(index, length, plot);

        return (
          <rect
            key={index}
            x={band.x}
            y={plot.top}
            width={band.width}
            height={plot.innerHeight}
            fill="transparent"
            className="cursor-pointer"
            onMouseEnter={() => onHover(index)}
          />
        );
      })}
    </g>
  );
};

const ChartTooltip = ({
  x,
  y,
  title,
  rows,
  width,
  showGuide = true,
  plot,
}: {
  x: number;
  y: number;
  title: string;
  rows: TooltipRow[];
  width: number;
  showGuide?: boolean;
  plot: Plot;
}) => {
  const rowHeight = 14;
  const tooltipWidth = 148;
  const tooltipHeight = 22 + rows.length * rowHeight;
  const maxX = Math.max(width - tooltipWidth - 4, 4);
  const tooltipX = Math.min(Math.max(x - tooltipWidth / 2, 4), maxX);
  const tooltipY = Math.max(y - tooltipHeight - 10, 4);

  return (
    <g className="pointer-events-none">
      {showGuide ? (
        <line
          x1={x}
          y1={plot.top}
          x2={x}
          y2={plot.bottom}
          className="stroke-border-normal"
          strokeWidth="1"
        />
      ) : null}
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
        y={tooltipY + 15}
        className="fill-foreground-tertiary text-caption-caption6"
      >
        {title}
      </text>
      {rows.map((row, index) => {
        const rowY = tooltipY + 15 + rowHeight * (index + 1);

        return (
          <g key={`${row.label ?? 'value'}-${index}`}>
            {row.color ? <circle cx={tooltipX + 13} cy={rowY - 3} r="3" fill={row.color} /> : null}
            {row.label ? (
              <text
                x={tooltipX + (row.color ? 21 : 10)}
                y={rowY}
                className="fill-foreground-tertiary text-caption-caption6"
              >
                {row.label}
              </text>
            ) : null}
            <text
              x={tooltipX + tooltipWidth - 10}
              y={rowY}
              textAnchor="end"
              className="fill-foreground-normal text-caption-caption6"
            >
              {formatNumber(row.value)}
            </text>
          </g>
        );
      })}
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
  const { ref, width } = useChartWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = getPlot(width);
  const { max, ticks } = buildScale(Math.max(...items.map((item) => item.count), 0));
  const activeIndex = hoverIndex !== null && hoverIndex < items.length ? hoverIndex : null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  if (items.length === 0) return <EmptyState />;

  return (
    <div ref={ref} className="border-border-normal rounded-6 border p-12">
      <svg
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        width={width}
        height={CHART_HEIGHT}
        className="block w-full"
        role="img"
      >
        <ChartGrid ticks={ticks} max={max} plot={plot} />
        <path
          d={buildLineAreaPath(items, max, plot)}
          className="fill-foreground-normal opacity-[0.08]"
        />
        <path
          d={buildLinePath(items, max, plot)}
          fill="none"
          className="stroke-foreground-normal"
          strokeWidth="2"
        />
        {items.map((item, index) => (
          <circle
            key={`${item.label}-${index}`}
            cx={getPointX(index, items.length, plot)}
            cy={getPointY(item.count, max, plot)}
            r="2.5"
            className="fill-foreground-normal"
          />
        ))}
        <XAxisLabels labels={items.map((item) => item.label)} plot={plot} />
        <HoverBands length={items.length} plot={plot} onHover={setHoverIndex} />
        {activeItem && activeIndex !== null ? (
          <>
            <circle
              cx={getPointX(activeIndex, items.length, plot)}
              cy={getPointY(activeItem.count, max, plot)}
              r="5"
              fill="transparent"
              className="stroke-foreground-normal pointer-events-none opacity-30"
              strokeWidth="3"
            />
            <ChartTooltip
              x={getPointX(activeIndex, items.length, plot)}
              y={getPointY(activeItem.count, max, plot)}
              title={formatShortLabel(activeItem.label)}
              rows={[{ value: activeItem.count }]}
              width={width}
              plot={plot}
            />
          </>
        ) : null}
      </svg>
    </div>
  );
};

export const MultiLineChart = ({ series }: { series: LineSeries[] }) => {
  const { ref, width } = useChartWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const visibleSeries = series.filter((item) => item.points.length > 0);
  const plot = getPlot(width);
  const { max, ticks } = buildScale(
    Math.max(...visibleSeries.flatMap((item) => item.points.map((point) => point.count)), 0),
  );
  const labelSource = visibleSeries.reduce<CountItem[]>(
    (longest, item) => (item.points.length > longest.length ? item.points : longest),
    [],
  );
  const activeIndex = hoverIndex !== null && hoverIndex < labelSource.length ? hoverIndex : null;
  const activeRows =
    activeIndex === null
      ? []
      : visibleSeries
          .map((item) => ({
            label: item.label,
            color: item.color,
            value: item.points[activeIndex]?.count,
          }))
          .filter(
            (row): row is { label: string; color: string; value: number } =>
              row.value !== undefined,
          );

  if (visibleSeries.length === 0) return <EmptyState />;

  return (
    <div ref={ref} className="border-border-normal rounded-6 border p-12">
      <svg
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        width={width}
        height={CHART_HEIGHT}
        className="block w-full"
        role="img"
      >
        <ChartGrid ticks={ticks} max={max} plot={plot} />
        {visibleSeries.map((item) => (
          <path
            key={`${item.label}-area`}
            d={buildLineAreaPath(item.points, max, plot)}
            fill={item.color}
            opacity="0.08"
          />
        ))}
        {visibleSeries.map((item) => (
          <path
            key={`${item.label}-line`}
            d={buildLinePath(item.points, max, plot)}
            fill="none"
            stroke={item.color}
            strokeWidth="2"
          />
        ))}
        <XAxisLabels labels={labelSource.map((item) => item.label)} plot={plot} />
        <HoverBands length={labelSource.length} plot={plot} onHover={setHoverIndex} />
        {activeIndex !== null && activeRows.length > 0 ? (
          <>
            {visibleSeries.map((item) => {
              const point = item.points[activeIndex];
              if (!point) return null;

              return (
                <circle
                  key={`${item.label}-active`}
                  cx={getPointX(activeIndex, item.points.length, plot)}
                  cy={getPointY(point.count, max, plot)}
                  r="3.5"
                  className="pointer-events-none"
                  fill={item.color}
                />
              );
            })}
            <ChartTooltip
              x={getPointX(activeIndex, labelSource.length, plot)}
              y={plot.top}
              title={formatShortLabel(labelSource[activeIndex]?.label ?? '')}
              rows={activeRows}
              width={width}
              plot={plot}
            />
          </>
        ) : null}
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
  const { ref, width } = useChartWidth();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = getPlot(width);
  const { max, ticks } = buildScale(Math.max(...items.map((item) => item.count), 0));
  const slotWidth = plot.innerWidth / Math.max(items.length, 1);
  const barWidth = Math.min(Math.max(slotWidth - 14, 6), 44);
  const maxLabelChars = Math.max(Math.floor(slotWidth / 6), 2);
  const activeIndex = hoverIndex !== null && hoverIndex < items.length ? hoverIndex : null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const getBarBand = (index: number) => ({
    x: plot.left + slotWidth * index,
    width: slotWidth,
  });

  if (items.length === 0) return <EmptyState />;

  return (
    <div ref={ref} className="border-border-normal rounded-6 border p-12">
      <svg
        viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
        width={width}
        height={CHART_HEIGHT}
        className="block w-full"
        role="img"
      >
        <ChartGrid ticks={ticks} max={max} plot={plot} />
        {items.map((item, index) => {
          const band = getBarBand(index);
          const centerX = band.x + slotWidth / 2;
          const y = getPointY(item.count, max, plot);

          return (
            <g key={`${item.label}-${index}`}>
              <rect
                x={centerX - barWidth / 2}
                y={y}
                width={barWidth}
                height={Math.max(plot.bottom - y, 2)}
                rx="3"
                className="fill-foreground-normal"
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
              />
              <text
                x={centerX}
                y={CHART_HEIGHT - 6}
                textAnchor="middle"
                className="fill-foreground-tertiary text-caption-caption6"
              >
                {truncateLabel(item.label, maxLabelChars)}
              </text>
            </g>
          );
        })}
        <HoverBands
          length={items.length}
          plot={plot}
          onHover={setHoverIndex}
          getBand={(index) => getBarBand(index)}
        />
        {activeItem && activeIndex !== null ? (
          <ChartTooltip
            x={plot.left + slotWidth * activeIndex + slotWidth / 2}
            y={getPointY(activeItem.count, max, plot)}
            title={activeItem.label}
            rows={[{ value: activeItem.count }]}
            width={width}
            showGuide={false}
            plot={plot}
          />
        ) : null}
      </svg>
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
      className="border-border-normal rounded-6 flex items-center justify-center border p-16"
      title={`Open Rate: ${formatPercent(percent)}`}
    >
      <svg viewBox="0 0 120 120" className="h-[140px] w-[140px]" role="img">
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
