import { useState } from 'react';
import { ImageDnD } from './ImageDnD';
import { ImageUploader } from './ImageUploader';
import { reorderArray } from '../lib/reorder';

export function ImageList() {
  const [images, setImages] = useState<File[]>([]);

  const handleSelect = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorder = (from: number, to: number) => {
    setImages((prev) => reorderArray(prev, from, to));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ImageUploader onSelect={handleSelect} />
      {images.length > 0 && (
        <ImageDnD images={images} onReorder={handleReorder} onRemove={handleRemove} />
      )}
    </div>
  );
}
