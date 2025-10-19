type ChipProps = {
  children: React.ReactNode;
};

export const Chip = ({ children }: ChipProps) => {
  return (
    <span className="bg-background-hint text-foreground-accent text-caption-10-400--1 inline-block h-[1.18rem] rounded-[0.12rem] px-[0.37rem] py-[0.25rem]">
      {children}
    </span>
  );
};
