interface InfoBadgeProps {
  text: string;
}

export const InfoBadge = ({ text }: InfoBadgeProps) => {
  const InfoBadgeStyle =
    'bg-background-senary text-foreground-static-white text-caption-caption6 rounded-2 inline-block h-[1.1875rem] px-7 py-5';
  return <span className={InfoBadgeStyle}>{text}</span>;
};
