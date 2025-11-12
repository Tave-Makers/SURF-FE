import { ImageDnD } from './ImageDnD';

type ImageListProps = {
  files: File[];
  onRemove: (index: number) => void;
  onReorder: (from: number, to: number) => void;
};

export function ImageList({ files, onRemove, onReorder }: ImageListProps) {
  const images = files.map((file) => ({
    id: crypto.randomUUID(),
    file,
    preview: URL.createObjectURL(file),
  }));

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {images.length > 0 && <ImageDnD images={images} onReorder={onReorder} onRemove={onRemove} />}
    </div>
  );
}
