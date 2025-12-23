import { create } from 'zustand';
import { PostFormState } from './types';

export const usePostFormStore = create<PostFormState>((set) => ({
  title: '',
  category: 'event',
  content: '',
  images: [],
  reserved: false,
  reservedAt: null,
  initialSnapshot: null,
  isEditorInitialized: false,

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setEditorState: (content, images) => set({ content, images }),
  setIsEditorInitialized: (isInit) => set({ isEditorInitialized: isInit }),
  resetForm: () =>
    set({
      title: '',
      category: 'event',
      content: '',
      images: [],
      reserved: false,
      reservedAt: null,
      initialSnapshot: null,
      isEditorInitialized: false,
    }),
  setSnapshot: (snapshot) => set({ initialSnapshot: snapshot }),
}));
