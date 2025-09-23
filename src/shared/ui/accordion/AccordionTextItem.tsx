import { AccordionTextItemProps } from './types';

export const AccordionTextItem = ({
  index,
  title,
  scoreChange,
  descriptions,
}: AccordionTextItemProps) => {
  return (
    <div className="flex flex-col gap-[0.5rem]">
      <div className="flex justify-between">
        <p className="text-foreground-normal text-body-12-600">
          {index}) {title}
        </p>
        <p className="text-border-primary text-body-12-600">{scoreChange}</p>
      </div>
      <ul className="text-foreground-normal text-body-12-400--2">
        {descriptions?.map((item, idx) => (
          <li key={idx}>- {item}</li>
        ))}
      </ul>
    </div>
  );
};
