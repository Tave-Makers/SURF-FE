import { UploadImage } from '@surf/utils';
import { ImageDnD } from './ImageDnD';

type ImageListProps = {
  images: UploadImage[];
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
};

export const ImageList = ({ images, onRemove, onReorder }: ImageListProps) => {
  return (
    <div className="flex w-full items-center gap-4">
      {images.length > 0 && <ImageDnD images={images} onReorder={onReorder} onRemove={onRemove} />}
    </div>
  );
};
