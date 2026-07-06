import { create } from 'zustand';
import { PostFormState } from './types';

export const usePostFormStore = create<PostFormState>((set, get) => ({
  postId: '',
  title: '',
  category: 'event',
  content: '',
  images: [],
  files: [],
  reserved: false,
  reservedAt: null,
  initialSnapshot: null,
  isInitialized: false,

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  resetForm: () => {
    // 1. 현재 스토어의 이미지들 가져오기
    const { images } = get();

    // 2. 메모리 클린업 (blob: URL만 선별하여 해제)
    images.forEach((img) => {
      // preview가 존재하고, 실제로 파일을 선택해서 생성된 blob URL인 경우에만 실행
      if (img.preview && img.preview.startsWith('blob:') && img.file) {
        URL.revokeObjectURL(img.preview);
      }
    });

    // 3. 상태 리셋
    set({
      title: '',
      category: 'event',
      content: '',
      images: [],
      files: [],
      reserved: false,
      reservedAt: null,
      initialSnapshot: null,
      isInitialized: false,
    });
  },
  setSnapshot: (snapshot) => set({ initialSnapshot: snapshot }),
  setIsInitialized: (isInit) => set({ isInitialized: isInit }),
}));

if (process.env.NODE_ENV === 'development') {
  usePostFormStore.subscribe((state, prevState) => {
    if (state.isInitialized !== prevState.isInitialized) {
      console.log('🔔 isInitialized 변경:', prevState.isInitialized, '->', state.isInitialized);
    }
    if (state.content !== prevState.content) {
      console.log('✍️ content 변경:', {
        before: prevState.content,
        after: state.content,
      });
    }
    if (state.images !== prevState.images) {
      console.log('🖼️ images 변경:', {
        before: prevState.images,
        after: state.images,
      });
    }
    if (state.reserved !== prevState.reserved) {
      console.log('⏰ reserved 변경:', {
        before: prevState.reserved,
        after: state.reserved,
      });
    }
  });
}
