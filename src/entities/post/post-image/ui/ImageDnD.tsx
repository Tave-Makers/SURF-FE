'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ImageItem } from '@/entities/post/post-image/ui/ImageItem';
import { UploadImage } from '@/shared/types/image';
import React, { useState } from 'react';

type ImageDnDProps = {
  images: UploadImage[]; // 현재 이미지 배열
  onReorder: (from: number, to: number) => void; // 드래그 종료 시 순서 변경
  onRemove: (index: number) => void; // 이미지 삭제 핸들러
};

/**
 * 이미지 리스트를 드래그 앤 드롭으로 정렬 가능한 컴포넌트
 *
 * 역할:
 * - `@dnd-kit`을 사용해 이미지 순서 변경
 * - 내부적으로 SortableImage로 각 아이템을 감쌈
 */
export function ImageDnD({ images, onReorder, onRemove }: ImageDnDProps) {
  // 마우스 드래그 이벤트 인식 센서 등록
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeImage = activeId ? images.find((img) => img.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  /**
   * 드래그 종료 시 실행되는 콜백
   * active.id = 드래그 시작한 아이템 인덱스
   * over.id = 드래그 놓은 위치의 아이템 인덱스
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);

    // 유효하지 않은 인덱스 방어
    if (oldIndex === -1 || newIndex === -1) {
      console.warn('Invalid drag indices:', { oldIndex, newIndex });
      return;
    }

    onReorder(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      {/* 드래그 가능한 아이템 컨텍스트 */}
      <SortableContext items={images.map((img) => img.id)} strategy={horizontalListSortingStrategy}>
        <div className="scrollbar-hide flex w-full gap-11 overflow-x-auto px-13 py-10">
          <SortableImageList images={images} onRemove={onRemove} />
        </div>
      </SortableContext>

      {/**
       * 드래그 시 재정렬된 복제본(시각적 피드백)을 표시하는 역할.
       * 실제 데이터 변경은 onReorder에서 처리
       */}
      <DragOverlay>
        {activeImage ? (
          <div
            className="scale-105 cursor-grabbing opacity-80"
            role="img"
            aria-label="드래그 중인 이미지"
          >
            <img
              src={activeImage.uploadedUrl ?? activeImage.preview}
              alt="드래그 중인 이미지 미리보기"
              className="rounded-2 h-20 w-20 object-cover"
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/** ImageDnD의 activeId 상태 변화에 의한 리렌더 방지 memo */
const SortableImageList = React.memo(
  function SortableImageList({
    images,
    onRemove,
  }: {
    images: UploadImage[];
    onRemove: (index: number) => void;
  }) {
    return (
      <>
        {images.map((image, index) => (
          <SortableImage
            key={image.id}
            id={image.id}
            preview={image.preview}
            uploadedUrl={image.uploadedUrl}
            status={image.status}
            onRemove={() => onRemove(index)}
          />
        ))}
      </>
    );
  },
  // 리스트 shallow 비교
  (prev, next) => prev.images === next.images && prev.onRemove === next.onRemove,
);

/**
 * 개별 이미지 아이템을 Sortable로 감싸는 컴포넌트
 * 리스트 안의 개별 이미지 리렌더 방지 memo
 *
 * @param id 각 이미지의 고유 인덱스 (드래그 식별용)
 */
const SortableImage = React.memo(
  function SortableImage({
    id,
    preview,
    uploadedUrl,
    status,
    onRemove,
  }: {
    id: string;
    preview: string;
    uploadedUrl?: string;
    status: UploadImage['status'];
    onRemove: () => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id,
    });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab">
        <ImageItem
          preview={preview}
          uploadedUrl={uploadedUrl}
          status={status}
          onRemove={onRemove}
        />
      </div>
    );
  },
  (prev, next) => {
    // 불필요한 리렌더 방지 커스텀 비교
    return (
      prev.id === next.id &&
      prev.preview === next.preview &&
      prev.uploadedUrl === next.uploadedUrl &&
      prev.status === next.status &&
      prev.onRemove === next.onRemove
    );
  },
);
