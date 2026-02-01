import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupRequestListWidget } from './SignupRequestListWidget';
import { renderWithProviders } from '@/test/utils/renderWithProviders';

describe('SignupRequestListWidget', () => {
  test('목록을 불러오고 무한 스크롤 시 다음 페이지가 추가된다', async () => {
    renderWithProviders(<SignupRequestListWidget keyword="" />);

    await screen.findByText('테스트유저1');

    (globalThis as typeof globalThis & { __triggerIntersection?: () => void }).__triggerIntersection?.();

    await screen.findByText('테스트유저21');
  });

  test('선택 모드에서 항목을 선택하면 하단 액션바가 표시된다', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignupRequestListWidget keyword="" />);

    await screen.findByText('전체 20');
    await user.click(screen.getByRole('button', { name: '선택하기' }));

    const checkbox = await screen.findByLabelText('테스트유저1 선택');
    await user.click(checkbox);

    expect(screen.getByText('1개 선택됨')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '승인하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '거절하기' })).toBeInTheDocument();
  });
});
