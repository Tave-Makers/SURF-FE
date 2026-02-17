'use client';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SurfIcon } from '@surf/ui/icon';
import React, { useState } from 'react';
import type { Banner } from '../model/types';
import { ContentItem } from '@/shared/ui/content-item';

type BannerDndProps = {
  banners: Banner[];
  isReorderMode: boolean;
  onReorder: (from: number, to: number) => void;
  onClick?: (bannerId: number) => void;
};

export const BannerDnd = ({ banners, isReorderMode, onReorder, onClick }: BannerDndProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeBanner = activeId != null ? banners.find((b) => b.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    if (!isReorderMode) return;
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isReorderMode) return;
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

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
      <SortableContext items={banners.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex w-full flex-col overflow-x-auto">
          {banners.map((banner) => (
            <SortableBanner
              key={banner.id}
              isReorderMode={isReorderMode}
              banner={banner}
              onClick={() => onClick?.(banner.id)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {isReorderMode && activeBanner ? (
          <div className="flex cursor-grabbing gap-10 pl-14 opacity-80">
            <button
              className="cursor-grab"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <SurfIcon name="Menu" />
            </button>
            <ContentItem
              id={activeBanner.id}
              imageUrl={activeBanner.imageUrl}
              name={activeBanner.name}
              isReorderMode={isReorderMode}
              hasThumbnail
              badge={{ kind: 'active', active: activeBanner.isActive }}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

type SortableBannerProps = {
  banner: Banner;
  isReorderMode: boolean;
  onClick?: (bannerId: number) => void;
};

const SortableBanner = React.memo(
  ({ banner, isReorderMode, onClick }: SortableBannerProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
      setActivatorNodeRef,
    } = useSortable({
      id: banner.id,
      disabled: !isReorderMode,
    });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`border-border-normal flex gap-10 border-b ${isReorderMode ? 'pl-14' : 'pl-0'}`}
      >
        {/* 핸들 */}
        {isReorderMode && (
          <button
            className="cursor-grab"
            {...attributes}
            {...listeners}
            ref={setActivatorNodeRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <SurfIcon name="Menu" />
          </button>
        )}

        <ContentItem
          id={banner.id}
          imageUrl={banner.imageUrl}
          name={banner.name}
          isReorderMode={isReorderMode}
          hasThumbnail
          badge={{ kind: 'active', active: banner.isActive }}
          onClick={onClick}
        />
      </div>
    );
  },
  (prev, next) =>
    prev.banner.id === next.banner.id &&
    prev.banner.name === next.banner.name &&
    prev.banner.imageUrl === next.banner.imageUrl &&
    prev.banner.isActive === next.banner.isActive &&
    prev.isReorderMode === next.isReorderMode &&
    prev.onClick === next.onClick,
);

SortableBanner.displayName = 'SortableBanner';
