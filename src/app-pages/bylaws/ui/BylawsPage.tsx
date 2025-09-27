import { AccordionGroup } from '@/shared/ui/accordion/AccordionGroup';
import { bylawsData } from '@/app-pages/bylaws/model/data';

export default function BylawsPage() {
  return (
    <div className="flex flex-col pt-[1.25rem]">
      <AccordionGroup accordions={bylawsData} />
    </div>
  );
}
