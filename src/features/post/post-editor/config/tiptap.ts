import StarterKit from '@tiptap/starter-kit';
import { TextStyleExtension } from '../lib/extensions/text-style';
import Placeholder from '@tiptap/extension-placeholder';

export const POST_EDITOR_EXTENSIONS = [
  StarterKit,
  TextStyleExtension,
  Placeholder.configure({
    placeholder: '글, 제목, 내용을 입력해주세요.',
  }),
];
