'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageItem } from '@/entities/post/post-image/ui/ImageItem';

type ImageDnDProps = {
  images: File[]; // 현재 이미지 배열
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

  /**
   * 드래그 종료 시 실행되는 콜백
   * active.id = 드래그 시작한 아이템 인덱스
   * over.id = 드래그 놓은 위치의 아이템 인덱스
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(active.id as number, over.id as number);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* 드래그 가능한 아이템 컨텍스트 */}
      <SortableContext items={images.map((_, i) => i)} strategy={verticalListSortingStrategy}>
        <div className="flex gap-3 overflow-x-auto py-2">
          {images.map((file, index) => (
            <SortableImage key={index} id={index} file={file} onRemove={() => onRemove(index)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/**
 * 개별 이미지 아이템을 Sortable로 감싸는 컴포넌트
 *
 * @param id 각 이미지의 고유 인덱스 (드래그 식별용)
 */
function SortableImage({ id, file, onRemove }: { id: number; file: File; onRemove: () => void }) {
  // 이 이미지가 드래그 가능한 대상임을 선언
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  // 드래그 중일 때 위치 이동 애니메이션 적용
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ImageItem을 드래그 가능하게 감싸서 렌더링
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ImageItem file={file} onRemove={onRemove} />
    </div>
  );
}
