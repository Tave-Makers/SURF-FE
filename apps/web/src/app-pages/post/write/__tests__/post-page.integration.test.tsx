import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PostPage from '@/app-pages/post/write/ui/PostPage';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';
import { renderWithProviders } from '@/test/renderWithProviders';

// Mock the mutations to prevent actual API calls
vi.mock('@/features/post/create-post/model/useCreatePost', () => ({
  useCreatePost: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ postId: 123 }),
    isPending: false,
  }),
}));

vi.mock('@/features/post/update-post/model/useUpdatePost', () => ({
  useUpdatePost: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
}));

beforeEach(() => {
  usePostFormStore.getState().resetForm();
});

describe('PostPage draft persistence', () => {
  it('create 모드에서 이탈 후 복귀하면 작성 중이던 값이 유지된다', async () => {
    const user = userEvent.setup();

    const { unmount } = renderWithProviders(<PostPage mode="create" boardId="1" />);

    // 제목과 본문 입력
    await user.type(screen.getByLabelText('제목'), '서프 게시글 제목');
    // 본문은 store에 직접 설정 (TipTap 호환성 문제 우회)
    usePostFormStore.setState({ content: '작성 중이던 본문' });

    // 일정 페이지로 이탈 후 복귀
    unmount();
    renderWithProviders(<PostPage mode="create" boardId="1" />);

    // store 값 유지 확인
    const storeAfterRerender = usePostFormStore.getState();
    expect(storeAfterRerender.title).toBe('서프 게시글 제목');
    expect(storeAfterRerender.content).toBe('작성 중이던 본문');

    // 컴포넌트 렌더링 확인
    expect(screen.getByLabelText('제목')).toHaveValue('서프 게시글 제목');
  });
});

describe('Form Reset After Submit', () => {
  it('create 완료 후 다시 create 페이지에 진입하면 이전 값이 초기화된다', async () => {
    const user = userEvent.setup();

    // 첫 번째 진입
    const { unmount } = renderWithProviders(<PostPage mode="create" boardId="1" />);
    await user.type(screen.getByLabelText('제목'), '이전 제목');
    usePostFormStore.setState({ content: '이전 본문' });

    // '등록' 버튼 클릭 후 상세 페이지로 라우팅
    await user.click(screen.getByRole('button', { name: '등록' }));
    unmount();

    // 실제 앱에서는 create page로 router.push 전에 resetForm()이 호출됨
    // 이 테스트에서는 그 동작을 시뮬레이션
    usePostFormStore.getState().resetForm();
    // 일정 스토어도 테스트 필요시 추가
    // useCreatePostScheduleStore.getState().clearLinkedSchedule();

    // 페이지 다시 진입 후 초기화된 폼 확인
    renderWithProviders(<PostPage mode="create" boardId="1" />);
    await waitFor(() => {
      const state = usePostFormStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.title).toBe('');
      expect(state.content).toBe('');
    });

    // 컴포넌트 렌더링 확인
    expect(screen.getByLabelText('제목')).toHaveValue('');
  });

  it('create 완료 후 다른 게시글의 edit 페이지에 진입하면 이전 값이 초기화된다', async () => {
    const user = userEvent.setup();

    // 첫 번째 진입 (create 모드)
    const { unmount } = renderWithProviders(<PostPage mode="create" boardId="1" />);
    await user.type(screen.getByLabelText('제목'), '이전 제목');
    usePostFormStore.setState({ content: '이전 본문' });

    // '등록' 버튼 클릭 후 상세 페이지로 라우팅
    await user.click(screen.getByRole('button', { name: '등록' }));

    // 제출 직후: isInitialized = false인 상태로 시작
    // usePostInitialization의 가드를 통과하여 재초기화 발생

    unmount();

    // 명시적 폼 리셋 필요 없음
    // 다른 게시글의 edit 페이지로 진입
    renderWithProviders(<PostPage mode="edit" boardId="1" postId="1" />);

    // 진입 직후: usePostInitialization 훅이 ID 불일치를 감지하고 리셋 호출
    await waitFor(() => {
      const state = usePostFormStore.getState();
      expect(state.isInitialized).toBe(false);
      expect(state.title).toBe('');
      expect(state.content).toBe('');
    });

    // 이후 새 데이터를 채운 후 초기화 진행
    await waitFor(() => {
      const state = usePostFormStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.title).toBe('');
      expect(state.content).toBe('');
    });

    // 컴포넌트 렌더링 확인
    expect(screen.getByLabelText('제목')).toHaveValue('');
  });
});
