import { REPORT_GUIDE_SECTIONS } from '../model/constants';

/** 신고 접수 및 처리 안내 */
export const ReportGuideSection = () => (
  <section className="border-border-normal text-foreground-normal flex flex-1 flex-col gap-8 border-b-[var(--stroke-weight-0)] px-15 py-13">
    <h2 className="text-body-body8">신고 접수 및 처리 안내</h2>
    {/* 안내 절차와 각 설명은 하나의 순서 목록으로 묶는다 (설명 ul은 해당 li의 자식) */}
    <ol className="flex list-decimal flex-col gap-5">
      {REPORT_GUIDE_SECTIONS.map(({ title, descriptions }) => (
        <li key={title} className="text-body-body9 ms-[1.3rem]">
          {title}
          {/* 시안에서 설명 불릿은 번호보다 3px 왼쪽에 놓여, 중첩으로 밀린 만큼 되돌린다 */}
          <ul className="flex list-disc flex-col pt-3">
            {descriptions.map((description) => (
              <li key={description} className="text-caption-caption4 ms-[-0.1875rem]">
                {description}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  </section>
);
