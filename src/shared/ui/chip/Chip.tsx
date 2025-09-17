type ChipProps = {
  children: React.ReactNode;
};

export const Chip = ({ children }: ChipProps) => {
  return (
    <span className="font-pretendard bg-background-hint text-foreground-accent inline-block h-[1.18rem] rounded-[0.12rem] px-[0.37rem] py-[0.25rem] text-center text-[0.625rem] leading-[0.6875rem] font-semibold tracking-[-0.00625rem] [font-feature-settings:'liga_off','clig_off']">
      {children}
    </span>
  );
};
