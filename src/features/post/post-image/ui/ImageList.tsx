import { useState } from 'react';
import { ImageDnD } from './ImageDnD';
import { ImageUploader } from './ImageUploader';
import { reorderArray } from '../lib/reorder';
import { ImageData } from '../model/types';

export function ImageList() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleSelect = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: crypto.randomUUID(), // 브라우저 내장 UUID
      file,
    }));
    setImages((prev) => [...prev, ...newImages]);
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
