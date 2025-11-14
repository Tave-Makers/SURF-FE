export type EventTitleProps = {
  isTitle: boolean;
  title: string;
};

export function EventTitle({ isTitle, title = '제목을 입력해주세요.' }: EventTitleProps) {
  return (
    <div className="text-body-body3 flex w-full flex-col gap-10 self-stretch">
      {isTitle ? (
        <div className="text-foreground-foreground-normal">{title}</div>
      ) : (
        <div className="text-foreground-foreground-tertiary-lighter">{title}</div>
      )}
    </div>
  );
}
