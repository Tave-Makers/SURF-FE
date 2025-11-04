import { AccordionTextItemProps } from './types';

export const AccordionTextItem = ({
  index,
  title,
  scoreChange,
  descriptions,
  showIndex = true,
}: AccordionTextItemProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <p className="text-foreground-foreground-normal text-body-body9">
          {showIndex ? `${index}) ` : ''}
          {title}
        </p>
        <p className="text-foreground-foreground-primary text-body-body9">{scoreChange}</p>
      </div>
      <ul className="text-foreground-foreground-normal text-body-body10">
        {descriptions?.map((item, idx) => (
          <li key={idx}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};
