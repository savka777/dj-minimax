'use client';

import Image from 'next/image';

interface AlbumArtGridProps {
  images: string[];
  size?: number;
}

export function AlbumArtGrid({ images, size = 192 }: AlbumArtGridProps) {
  // Ensure we have exactly 4 images, filling with first image if needed
  const gridImages = [...images];
  while (gridImages.length < 4) {
    gridImages.push(images[gridImages.length % images.length] || '');
  }

  return (
    <div
      className="grid grid-cols-2 grid-rows-2 overflow-hidden rounded-md shadow-2xl"
      style={{ width: size, height: size }}
    >
      {gridImages.slice(0, 4).map((src, index) => (
        <div key={index} className="relative overflow-hidden">
          <Image
            src={src}
            alt={`Album art ${index + 1}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
