type InfoBadgeProps = {
  children: React.ReactNode;
};

export const InfoBadge = ({ children }: InfoBadgeProps) => {
  return (
    <span className="bg-background-senary text-foreground-static-white text-caption-caption6 rounded-2 inline-block h-[1.1875rem] px-7 py-5">
      {children}
    </span>
  );
};
