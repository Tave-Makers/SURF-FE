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
import React, { useMemo, useState } from 'react';
import type { Banner } from '../model/types';
import { BannerItem } from './BannerItem';

type BannerDndProps = {
  banners: Banner[];
  onReorder: (from: number, to: number) => void;
  onClickMore?: (bannerId: number) => void;
};

export const BannerDnd = ({ banners, onReorder, onClickMore }: BannerDndProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeBanners = useMemo(() => banners.filter((b) => b.isActive), [banners]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeBanner = activeId != null ? activeBanners.find((b) => b.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = activeBanners.findIndex((b) => b.id === active.id);
    const newIndex = activeBanners.findIndex((b) => b.id === over.id);

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
      <SortableContext
        items={activeBanners.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex w-full flex-col overflow-x-auto">
          {activeBanners.map((banner) => (
            <SortableBanner
              key={banner.id}
              banner={banner}
              onClickMore={() => onClickMore?.(banner.id)}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBanner ? (
          <div className="scale-105 cursor-grabbing opacity-80">
            <BannerItem
              id={activeBanner.id}
              imageUrl={activeBanner.imageUrl}
              name={activeBanner.name}
              isActive={activeBanner.isActive}
              onClickMore={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

type SortableBannerProps = {
  banner: Banner;
  onClickMore?: () => void;
};

const SortableBanner = React.memo(
  ({ banner, onClickMore }: SortableBannerProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: banner.id,
      disabled: !banner.isActive, // 활성화만 드래그 가능
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
        {...attributes}
        {...listeners}
        className={banner.isActive ? 'cursor-grab' : 'cursor-default'}
      >
        <BannerItem
          id={banner.id}
          imageUrl={banner.imageUrl}
          name={banner.name}
          isActive={banner.isActive}
          onClickMore={onClickMore ?? (() => {})}
        />
      </div>
    );
  },
  (prev, next) =>
    prev.banner.id === next.banner.id &&
    prev.banner.name === next.banner.name &&
    prev.banner.imageUrl === next.banner.imageUrl &&
    prev.banner.isActive === next.banner.isActive &&
    prev.onClickMore === next.onClickMore,
);

SortableBanner.displayName = 'SortableBanner';
