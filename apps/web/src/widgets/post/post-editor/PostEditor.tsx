'use client';

import { useKeyboardOffset } from '@surf/hooks';
import { useToastStore } from '@surf/ui/store/toastStore';
import { UploadFile, UploadImage } from '@surf/utils';
import { EditorContent } from '@tiptap/react';
import { memo, useCallback, useEffect } from 'react';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import { POST_FILE_ACCEPT, POST_VALIDATION } from '@/entities/post/model/validation';
import { FileCard } from '@/entities/post/post-file/ui/FileCard';
import { ImageList } from '@/entities/post/post-image/ui/ImageList';
import { useImageManager } from '@/features/image/model/useImageManager';
import { usePostEditor } from '@/features/post/post-editor/lib/usePostEditor';
import styles from '@/features/post/post-editor/ui/PostEditor.module.css';
import {
  ALL_TOOLBAR_ITEMS,
  PostEditorToolbar,
  type ToolbarKey,
} from '@/features/post/post-editor/ui/PostEditorToolbar';
import { useFileManager } from '@/features/post/post-file/model/useFileManager';
import { PostFormState } from '@/features/post/post-form/model/types';
import { ScheduleFormData } from '@/features/schedule/create/model/types';

export type PostEditorProps = {
  content: string;
  images: UploadImage[];
  files: UploadFile[];
  setField: <K extends keyof PostFormState>(field: K, value: PostFormState[K]) => void;
  linkedSchedule: ScheduleFormData | null;
  onScheduleRemove: () => void;
  onReservationClick: () => void;
  isPublished: boolean;
  disabledToolbarKeys?: ToolbarKey[];
};

export const PostEditor = memo(
  ({
    content: storeContent,
    images: storeImages,
    files: storeFiles,
    setField,
    linkedSchedule,
    onScheduleRemove,
    onReservationClick,
    isPublished,
    disabledToolbarKeys = [],
  }: PostEditorProps) => {
    const showToast = useToastStore((s) => s.show);

    const toolbarItems = ALL_TOOLBAR_ITEMS.filter(
      (item) => !disabledToolbarKeys.includes(item.key),
    );

    const {
      inputRef,
      images: localImages,
      handleSelectAndUpload,
      handleRemove,
      handleReorder,
      openPicker,
    } = useImageManager({ initialImages: storeImages });

    const {
      inputRef: fileInputRef,
      files: localFiles,
      handleSelectAndUpload: handleFileSelectAndUpload,
      handleRemove: handleFileRemove,
      openPicker: openFilePicker,
    } = useFileManager({ initialFiles: storeFiles });

    const keyboardOffset = useKeyboardOffset();
    const { MAX_IMAGES, MAX_IMAGE_SIZE, MAX_FILES, MAX_FILE_SIZE } = POST_VALIDATION;

    // --- 3. Side Effects ---

    /**
     * [본문 변경]
     * 변경 사항을 전역 스토어로 전달
     */

    const onContentChange = useCallback(
      (html: string) => {
        setField('content', html);
      },
      [setField],
    );

    const editor = usePostEditor(storeContent, onContentChange);

    useEffect(() => {
      setField('images', localImages);
    }, [localImages, setField]);

    useEffect(() => {
      setField('files', localFiles);
    }, [localFiles, setField]);

    // --- 4. Handlers & Render Helpers ---

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;

      const oversized = Array.from(selected).some((f) => f.size > MAX_IMAGE_SIZE);
      if (oversized) {
        showToast('이미지는 최대 15MB까지 업로드할 수 있어요');
        e.target.value = '';
        return;
      }

      if (localImages.length + selected.length > MAX_IMAGES) {
        showToast(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있어요`);
        e.target.value = '';
        return;
      }

      await handleSelectAndUpload(e);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files;
      if (!selected) return;

      const oversized = Array.from(selected).some((f) => f.size > MAX_FILE_SIZE);
      if (oversized) {
        showToast('파일은 최대 20MB까지 업로드할 수 있어요');
        e.target.value = '';
        return;
      }

      if (localFiles.length + selected.length > MAX_FILES) {
        showToast(`파일은 최대 ${MAX_FILES}개까지 첨부할 수 있어요`);
        e.target.value = '';
        return;
      }

      await handleFileSelectAndUpload(e);
    };

    const renderScheduleCard = () => {
      if (!linkedSchedule) return null;

      return (
        <div className="px-13 pt-10">
          <EventCard
            category={linkedSchedule.category}
            title={linkedSchedule.title}
            startDate={linkedSchedule.startDate}
            endDate={linkedSchedule.endDate}
            location={linkedSchedule.location}
            mode="reservation"
            isAdmin={true}
            onDeleteSchedule={onScheduleRemove}
          />
        </div>
      );
    };

    if (!editor) return null;

    return (
      <div className="flex h-full w-full min-w-0 flex-col">
        {/* 스크롤 컨테이너 — block으로 flex-shrink 압축 방지 */}
        <div className="flex-1 overflow-y-auto">
          {/* min-h-full로 mt-auto가 짧은 텍스트일 때도 동작하도록 */}
          <div className="flex min-h-full flex-col">
            <div
              role="button"
              tabIndex={-1}
              aria-label="본문"
              className={`text-foreground-normal text-body-body7 min-h-40 w-full cursor-text px-13 break-all ${styles.editor}`}
              onClick={() => {
                if (!editor.isFocused) editor.commands.focus('end');
              }}
              onKeyDown={() => {
                if (!editor.isFocused) editor.commands.focus('end');
              }}
            >
              <EditorContent editor={editor} />
            </div>

            <div className="mt-auto flex flex-col">
              {renderScheduleCard()}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  void handleImageUpload(e);
                }}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept={POST_FILE_ACCEPT}
                multiple
                className="hidden"
                onChange={(e) => {
                  void handleFileUpload(e);
                }}
              />

              {localFiles.length > 0 && (
                <div className="flex w-full flex-col gap-10 px-13 pt-10">
                  {localFiles.map((file, index) => (
                    <FileCard
                      key={file.id}
                      fileName={file.originalFileName}
                      status={file.status}
                      onRemove={() => handleFileRemove(index)}
                    />
                  ))}
                </div>
              )}

              {localImages.length > 0 && (
                <div className="overflow-x-auto">
                  <ImageList
                    images={localImages}
                    onRemove={handleRemove}
                    onReorder={handleReorder}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: keyboardOffset }}>
          <PostEditorToolbar
            editor={editor}
            items={toolbarItems}
            onCameraClick={openPicker}
            onReservationClick={onReservationClick}
            onFileClick={openFilePicker}
            isReservationDisabled={isPublished}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.content === nextProps.content &&
      prevProps.images === nextProps.images &&
      prevProps.linkedSchedule === nextProps.linkedSchedule &&
      prevProps.isPublished === nextProps.isPublished
    );
  },
);

PostEditor.displayName = 'PostEditor';
