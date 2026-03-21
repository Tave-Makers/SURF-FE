import { create } from 'zustand';
import { PostFormState } from './types';

export const usePostFormStore = create<PostFormState>((set, get) => ({
  title: '',
  category: 'event',
  content: '',
  images: [],
  reserved: false,
  reservedAt: null,
  initialSnapshot: null,
  isEditorInitialized: false,
  canInitialize: false,
  isInitialized: false,

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setEditorState: (content, images) => set({ content, images }),
  setIsEditorInitialized: (isInit) => set({ isEditorInitialized: isInit }),
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
      reserved: false,
      reservedAt: null,
      initialSnapshot: null,
      isEditorInitialized: false,
      canInitialize: false,
    });
  },
  setSnapshot: (snapshot) => set({ initialSnapshot: snapshot }),
  setCanInitialize: (canInit) => set({ canInitialize: canInit }),
  setIsInitialized: (isInit) => set({ isInitialized: isInit }),
}));

if (process.env.NODE_ENV === 'development') {
  usePostFormStore.subscribe((state, prevState) => {
    if (state.canInitialize !== prevState.canInitialize) {
      console.log('🔔 canInitialize 변경:', prevState.canInitialize, '->', state.canInitialize);
    }
    if (state.isEditorInitialized !== prevState.isEditorInitialized) {
      console.log(
        '✅ isEditorInitialized 변경:',
        prevState.isEditorInitialized,
        '->',
        state.isEditorInitialized,
      );
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
  });
}
