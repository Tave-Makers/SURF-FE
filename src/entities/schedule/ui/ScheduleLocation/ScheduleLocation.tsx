export type ScheduleLocationProps = {
  title: string;
  location?: string;
};

export function ScheduleLocation({ title, location = '장소 입력' }: ScheduleLocationProps) {
  return (
    <div className="flex h-18 w-full flex-row items-center border py-7">
      <div className="text-foreground-foreground-normal text-body-body8 flex flex-1 border">
        {title}
      </div>

      <div className="text-foreground-foreground-quaternary text-caption-caption2 flex flex-1 justify-end border">
        {location}
      </div>
    </div>
  );
}
