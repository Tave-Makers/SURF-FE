type ReportTargetSummaryProps = {
  writer: string;
  contentLabel: string;
  content: string;
};

/** 신고 대상(게시글/댓글)의 작성자와 제목·내용 요약 */
export const ReportTargetSummary = ({
  writer,
  contentLabel,
  content,
}: ReportTargetSummaryProps) => (
  <dl className="border-border-normal text-foreground-normal flex flex-col border-b-[var(--stroke-weight-0)] px-15 py-13">
    <div className="flex items-start gap-5">
      <dt className="text-body-body8 w-[2.25rem] shrink-0">작성자</dt>
      <dd className="text-body-body9 min-w-0 flex-1">{writer}</dd>
    </div>
    <div className="flex items-start gap-5">
      <dt className="text-body-body8 w-[2.25rem] shrink-0">{contentLabel}</dt>
      <dd className="text-body-body9 min-w-0 flex-1 truncate">{content}</dd>
    </div>
  </dl>
);
