"use client";

import Image from "next/image";
import { useState } from "react";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden rounded-t-xl sm:h-96">
        <Image src={images[active]} alt={title} fill sizes="100vw" className="object-cover" priority />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-6 pt-4">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 cursor-pointer ${
                i === active ? "border-primary" : "border-transparent"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
