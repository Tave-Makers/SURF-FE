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
    });
  },
  setSnapshot: (snapshot) => set({ initialSnapshot: snapshot }),
  setCanInitialize: (canInit) => set({ canInitialize: canInit }),
}));
