'use client';

import { useEditor, Editor } from '@tiptap/react';
import { POST_EDITOR_EXTENSIONS } from '../config/tiptap';

/**
 * 게시글 작성/수정을 위한 TipTap 에디터 인스턴스를 생성합니다.
 * @param initialContent - 초기 HTML 콘텐츠 (옵션)
 * @param onUpdate - 에디터 내용 변경 시 호출되는 콜백 (옵션)
 * @returns TipTap Editor 인스턴스 또는 null
 */
export const usePostEditor = (
  initialContent?: string,
  onUpdate?: (html: string) => void,
): Editor | null => {
  return useEditor({
    extensions: POST_EDITOR_EXTENSIONS,
    content: initialContent || '',
    editorProps: {
      attributes: {
        // 추후 커스텀 스타일링을 위한 클래스 추가 가능
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': '게시글 편집기',
      },
    },
    onUpdate({ editor }) {
      onUpdate?.(editor.getHTML());
    },
    immediatelyRender: false,
  });
};
