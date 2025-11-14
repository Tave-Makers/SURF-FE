export type ScheduleLocationProps = {
  title: string;
  location?: string;
};

export function ScheduleLocation({ title, location = '장소 입력' }: ScheduleLocationProps) {
  return (
    <div className="flex h-18 w-full flex-row items-center py-7">
      <div className="text-foreground-foreground-normal text-body-body8 flex flex-1">{title}</div>

      <div className="text-foreground-foreground-quaternary text-caption-caption2 flex flex-1 justify-end">
        {location}
      </div>
    </div>
  );
}
