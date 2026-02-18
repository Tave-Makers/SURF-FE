import { AlertViewport } from '@surf/ui/alert';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { ImgHTMLAttributes, ReactNode } from 'react';
import { SignupRequestBottomSheet } from './SignupRequestBottomSheet';
import { server } from '@/test/mocks/server';
import { renderWithProviders } from '@/test/utils/renderWithProviders';

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt="img" />,
}));

vi.mock('react-modal-sheet', () => {
  const Sheet = ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => {
    if (!isOpen) return null;
    return <div data-testid="modal-sheet">{children}</div>;
  };

  const Container = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  const Content = ({ children }: { children: ReactNode }) => <div>{children}</div>;

  // Attach subcomponents expected by SignupRequestBottomSheet

  Sheet.Container = Container;

  Sheet.Content = Content;

  return { Sheet };
});

const mockMemberInfoResponse = {
  code: 200,
  message: 'SUCCESS',
  data: {
    username: '테스트유저',
    profileImageUrl: '',
    phoneNumber: '01012345678',
    email: 'test@example.com',
    university: '테스트대학교',
    role: 'MEMBER',
    activityScore: 0,
    createdAt: '2024-01-01',
    memberStatus: 'WAITING',
    isActive: true,
    trackList: [{ generation: 15, part: 'BACKEND' }],
    careerList: [],
  },
};

describe('SignupRequestBottomSheet', () => {
  test('대기 상태이면 승인/거절 버튼이 노출된다', async () => {
    server.use(
      http.get('/api/proxy/v1/manager/member/:memberId', () =>
        HttpResponse.json(mockMemberInfoResponse, { status: 200 }),
      ),
    );

    renderWithProviders(
      <>
        <AlertViewport />
        <SignupRequestBottomSheet isOpen onClose={vi.fn()} memberId={1} />
      </>,
    );

    expect(await screen.findByRole('button', { name: '거절하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '승인하기' })).toBeInTheDocument();
  });

  test('승인 확인 시 요청이 실행되고 시트가 닫힌다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    let requestBody: unknown;
    let statusParam: string | undefined;

    server.use(
      http.get('/api/proxy/v1/manager/member/:memberId', () =>
        HttpResponse.json(mockMemberInfoResponse, { status: 200 }),
      ),
      http.patch('/api/proxy/v1/admin/members/:status', async ({ request, params }) => {
        requestBody = await request.json();
        statusParam = params.status as string;
        return HttpResponse.json(
          {
            code: 200,
            message: 'SUCCESS',
            data: null,
          },
          { status: 200 },
        );
      }),
    );

    renderWithProviders(
      <>
        <AlertViewport />
        <SignupRequestBottomSheet isOpen onClose={onClose} memberId={1} />
      </>,
    );

    await user.click(await screen.findByRole('button', { name: '승인하기' }));

    const dialog = await screen.findByRole('dialog', {
      name: '회원 가입을 승인하시겠습니까?',
    });
    await user.click(within(dialog).getByRole('button', { name: '승인하기' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    expect(statusParam).toBe('approve');
    expect(requestBody).toEqual([1]);
  });

  test('거절 확인 시 요청이 실행되고 시트가 닫힌다', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    let requestBody: unknown;
    let statusParam: string | undefined;

    server.use(
      http.get('/api/proxy/v1/manager/member/:memberId', () =>
        HttpResponse.json(mockMemberInfoResponse, { status: 200 }),
      ),
      http.patch('/api/proxy/v1/admin/members/:status', async ({ request, params }) => {
        requestBody = await request.json();
        statusParam = params.status as string;
        return HttpResponse.json(
          {
            code: 200,
            message: 'SUCCESS',
            data: null,
          },
          { status: 200 },
        );
      }),
    );

    renderWithProviders(
      <>
        <AlertViewport />
        <SignupRequestBottomSheet isOpen onClose={onClose} memberId={1} />
      </>,
    );

    await user.click(await screen.findByRole('button', { name: '거절하기' }));

    const dialog = await screen.findByRole('dialog', {
      name: '회원 가입을 거절하시겠습니까?',
    });
    await user.click(within(dialog).getByRole('button', { name: '거절하기' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
    expect(statusParam).toBe('reject');
    expect(requestBody).toEqual([1]);
  });
});
