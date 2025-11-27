import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

export const POST_EDITOR_EXTENSIONS = [
  StarterKit,
  TextStyleKit,
  Placeholder.configure({
    placeholder: '글, 제목, 내용을 입력해주세요.',
  }),
];
