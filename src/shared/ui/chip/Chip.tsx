type ChipProps = {
  children: React.ReactNode;
};

export const Chip = ({ children }: ChipProps) => {
  return (
    <span className="bg-background-background-senary text-foreground-foreground-accent text-caption-caption6 rounded-2 inline-block h-[1.18rem] px-7 py-5">
      {children}
    </span>
  );
};
