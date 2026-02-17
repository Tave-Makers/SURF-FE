import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemberGenerationAccordion } from './MemberGenerationAccordion';
import { renderWithProviders } from '@/test/utils/renderWithProviders';

describe('MemberGenerationAccordionInfinite', () => {
  test('아코디언 오픈 후 무한스크롤 트리거 시 다음 페이지를 로드한다', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <MemberGenerationAccordion generation={32} renderItem={(m) => <div>{m.name}</div>} />,
    );

    await user.click(screen.getByRole('button', { name: '32기' }));

    await screen.findByText('32기멤버1');

    (
      globalThis as typeof globalThis & { __triggerIntersection?: () => void }
    ).__triggerIntersection?.();

    await screen.findByText('32기멤버6');
  });
});
