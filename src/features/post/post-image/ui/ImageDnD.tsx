'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { ImageItem } from '@/entities/post/post-image/ui/ImageItem';
import { ImageData } from '../model/types';
import { useState } from 'react';

type ImageDnDProps = {
  images: ImageData[]; // 현재 이미지 배열
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
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);

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
          {images.map((image, index) => (
            <SortableImage
              key={image.id}
              id={image.id}
              file={image.file}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      </SortableContext>

      {/**
       * 드래그 시 재정렬된 복제본(시각적 피드백)을 표시하는 역할.
       * 실제 데이터 변경은 onReorder에서 처리
       */}
      <DragOverlay>
        {activeId ? (
          <div className="scale-105 cursor-grabbing opacity-80">
            <ImageItem file={images.find((img) => img.id === activeId)!.file} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * 개별 이미지 아이템을 Sortable로 감싸는 컴포넌트
 *
 * @param id 각 이미지의 고유 인덱스 (드래그 식별용)
 */
function SortableImage({ id, file, onRemove }: { id: string; file: File; onRemove: () => void }) {
  // 이 이미지가 드래그 가능한 대상임을 선언
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  // 드래그 중일 때 위치 이동 애니메이션 적용
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    willChange: 'transform',
    opacity: isDragging ? 0 : 1, // 드래그 중이면 투명 처리
  };

  // ImageItem을 드래그 가능하게 감싸서 렌더링
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={'cursor-grab'}
      role="button"
      aria-label={`이미지 ${file.name}, 드래그하여 순서 변경`}
    >
      <ImageItem file={file} onRemove={onRemove} />
    </div>
  );
}
