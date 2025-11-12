import { ImageDnD } from './ImageDnD';
import type { ImageData } from '@/shared/types/image';

type ImageListProps = {
  images: ImageData[];
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
};

export function ImageList({ images, onRemove, onReorder }: ImageListProps) {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {images.length > 0 && <ImageDnD images={images} onReorder={onReorder} onRemove={onRemove} />}
    </div>
  );
}
