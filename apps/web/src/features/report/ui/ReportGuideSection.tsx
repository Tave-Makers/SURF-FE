import { REPORT_GUIDE_SECTIONS } from '../model/constants';

/** 신고 접수 및 처리 안내 */
export const ReportGuideSection = () => (
  <section className="border-border-normal text-foreground-normal flex flex-1 flex-col gap-8 border-b-[var(--stroke-weight-0)] px-15 py-13">
    <h2 className="text-body-body8">신고 접수 및 처리 안내</h2>
    <div className="flex flex-col gap-5">
      {REPORT_GUIDE_SECTIONS.map(({ title, descriptions }, index) => (
        <div key={title} className="flex flex-col gap-3">
          <ol start={index + 1} className="list-decimal">
            <li className="text-body-body9 ms-[1.3rem]">{title}</li>
          </ol>
          <ul className="list-disc">
            {descriptions.map((description) => (
              <li key={description} className="text-caption-caption4 ms-[1.125rem]">
                {description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </section>
);
