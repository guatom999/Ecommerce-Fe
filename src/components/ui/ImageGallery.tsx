"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
    images: ProductImage[];
    title?: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <span>ไม่มีรูปภาพ</span>
            </div>
        );
    }

    const prev = () =>
        setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () =>
        setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={images[activeIndex].url}
                    alt={title ?? "product image"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow hover:bg-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIndex(idx)}
                            className={cn(
                                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition",
                                idx === activeIndex
                                    ? "border-blue-500"
                                    : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={img.url}
                                alt={`thumbnail-${idx}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
