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

  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setEditorState: (content, images) => set({ content, images }),
  resetForm: () =>
    set({
      title: '',
      category: 'event',
      content: '',
      images: [],
      reserved: false,
      reservedAt: null,
      initialSnapshot: null,
    }),
  setSnapshot: (snapshot) => set({ initialSnapshot: snapshot }),
}));
