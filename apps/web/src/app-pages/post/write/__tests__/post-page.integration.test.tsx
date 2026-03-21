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

    await user.type(screen.getByLabelText('제목'), '서프 게시글 제목');

    // 본문은 store에 직접 설정 (TipTap 호환성 문제 우회)
    usePostFormStore.setState({ content: '작성 중이던 본문' });

    // 일정 페이지로 이탈
    unmount();

    // 복귀
    renderWithProviders(<PostPage mode="create" boardId="1" />);

    // store 값 유지 확인
    const storeAfterRerender = usePostFormStore.getState();

    expect(storeAfterRerender.title).toBe('서프 게시글 제목');
    expect(storeAfterRerender.content).toBe('작성 중이던 본문');

    // 컴포넌트 렌더링 확인
    expect(screen.getByLabelText('제목')).toHaveValue('서프 게시글 제목');
  });
});

describe('PostPage reset after create success', () => {
  it('create 완료 후 다시 create 페이지에 진입하면 이전 값이 초기화된다', async () => {
    const user = userEvent.setup();

    const { unmount } = renderWithProviders(<PostPage mode="create" boardId="1" />);

    await user.type(screen.getByLabelText('제목'), '이전 제목');

    // 본문은 store에 직접 설정 (TipTap 호환성 문제 우회)
    usePostFormStore.setState({ content: '이전 본문' });

    // '등록' 버튼 클릭
    await user.click(screen.getByRole('button', { name: '등록' }));

    // store reset 확인
    await waitFor(() => {
      const state = usePostFormStore.getState();
      expect(state.title).toBe('');
      expect(state.content).toBe('');
      expect(state.canInitialize).toBe(false);
    });

    // 상세 페이지로 라우팅
    unmount();

    // 다시 create 페이지 진입
    renderWithProviders(<PostPage mode="create" boardId="1" />);

    // 컴포넌트 렌더링 확인
    expect(screen.getByLabelText('제목')).toHaveValue('');
  });
});
