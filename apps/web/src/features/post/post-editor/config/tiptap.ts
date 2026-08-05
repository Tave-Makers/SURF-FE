import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { POST_VALIDATION } from '@/entities/post/model/validation';

const { MAX_CONTENT_LENGTH } = POST_VALIDATION;

export const POST_EDITOR_EXTENSIONS = [
  StarterKit,
  TextStyleKit,
  Placeholder.configure({
    placeholder: '글, 제목, 내용을 입력해주세요.',
  }),
  CharacterCount.configure({
    limit: MAX_CONTENT_LENGTH,
  }),
];
