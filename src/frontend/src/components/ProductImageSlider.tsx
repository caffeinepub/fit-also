import { cn } from "@/lib/utils";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProductImageSliderProps {
  images: string[];
  productId: string;
  onTap: () => void;
  className?: string;
  autoPlay?: boolean;
}

export function ProductImageSlider({
  images,
  productId,
  onTap,
  className,
  autoPlay = true,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTouch = useRef(false);

  const total = images.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    autoPlayRef.current = setInterval(next, 3000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, next, total]);

  const pauseAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };
  const resumeAutoPlay = () => {
    if (!autoPlay || total <= 1) return;
    autoPlayRef.current = setInterval(next, 3000);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouch.current = true;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(false);
    pauseAutoPlay();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      setIsDragging(true);
      if (deltaX < 0) {
        next(); // swipe left = next
      } else {
        prev(); // swipe right = prev
      }
    }
    resumeAutoPlay();
  };

  const handleClick = () => {
    if (!isDragging) {
      onTap();
    }
    setIsDragging(false);
  };

  if (total === 0) return null;
  if (total === 1) {
    return (
      <button
        type="button"
        onClick={onTap}
        className={cn("w-full h-full relative overflow-hidden", className)}
        aria-label="View product details"
      >
        <img
          src={images[0]}
          alt="Product"
          loading="lazy"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </button>
    );
  }

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Track */}
      <div
        className="flex h-full will-change-transform"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 300ms ease",
          width: `${total * 100}%`,
        }}
      >
        {images.map((src, i) => (
          <button
            key={`${productId}-slide-${src.slice(-8)}-${i}`}
            type="button"
            onClick={handleClick}
            className="relative shrink-0 h-full"
            style={{ width: `${100 / total}%` }}
            aria-label="View product details"
            tabIndex={i === currentIndex ? 0 : -1}
          >
            <img
              src={src}
              alt={`View ${i + 1} of ${total}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
        {images.map((src, i) => (
          <span
            key={`dot-${productId}-${src.slice(-6)}`}
            className={cn(
              "rounded-full transition-all duration-300",
              i === currentIndex
                ? "w-4 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/50",
            )}
          />
        ))}
      </div>
    </div>
  );
}
