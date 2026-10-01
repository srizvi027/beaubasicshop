"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ProductImage as Img } from "@/lib/types";
import { useScrollLock } from "@/components/store/ui";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/cn";

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0 }),
};

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [[index, dir], setIndex] = useState<[number, number]>([0, 0]);
  const [fullscreen, setFullscreen] = useState(false);
  const count = images.length;
  const go = useCallback((next: number) => setIndex(([i]) => [((next % count) + count) % count, next > i ? 1 : -1]), [count]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1);
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {count > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:flex-col" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show image ${i + 1} of ${count}`}
              onClick={() => go(i)}
              className={cn("relative aspect-square w-18 shrink-0 overflow-hidden bg-mist transition lg:w-full", i === index ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100")}
            >
              <ProductImage src={img.src} alt="" fill sizes="80px" className="p-1.5" />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-square flex-1 overflow-hidden bg-mist lg:aspect-[5/6]">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-zoom-in touch-pan-y"
            onClick={() => setFullscreen(true)}
          >
            <div className="absolute inset-[8%]">
              <ProductImage src={images[index].src} alt={images[index].alt || name} fill priority={index === 0} sizes="(min-width: 1024px) 50vw, 100vw" draggable={false} />
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={() => setFullscreen(true)} aria-label="Open fullscreen image viewer" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 transition hover:bg-white">
          <Maximize2 className="h-4 w-4" />
        </button>

        {count > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 lg:hidden">
              {images.map((_, i) => (
                <span key={i} className={cn("h-1 rounded-full transition-all", i === index ? "w-6 bg-ink" : "w-1.5 bg-black/25")} />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 hidden gap-2 lg:flex">
              <button onClick={() => go(index - 1)} aria-label="Previous image" className="grid h-10 w-10 place-items-center rounded-full bg-white transition hover:bg-ink hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => go(index + 1)} aria-label="Next image" className="grid h-10 w-10 place-items-center rounded-full bg-white transition hover:bg-ink hover:text-white"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {fullscreen && <Lightbox images={images} index={index} onIndex={go} onClose={() => setFullscreen(false)} name={name} />}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({ images, index, onIndex, onClose, name }: { images: Img[]; index: number; onIndex: (i: number) => void; onClose: () => void; name: string }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") { setZoom(false); onIndex(index + 1); }
      if (e.key === "ArrowLeft") { setZoom(false); onIndex(index - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onIndex, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} image viewer`}
      className="fixed inset-0 z-[80] flex flex-col bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm tabular-nums text-black/60">{index + 1} / {images.length}</p>
        <div className="flex gap-2">
          <button onClick={() => setZoom((z) => !z)} aria-label={zoom ? "Zoom out" : "Zoom in"} className="grid h-11 w-11 place-items-center rounded-full bg-mist hover:bg-fog">
            {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
          <button onClick={onClose} aria-label="Close image viewer" autoFocus className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className={cn("relative flex-1 overflow-hidden", zoom ? "cursor-zoom-out" : "cursor-zoom-in")}
        onClick={() => setZoom((z) => !z)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
      >
        <motion.div
          key={index}
          className="absolute inset-[6%]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: zoom ? 2.2 : 1 }}
          style={{ transformOrigin: origin }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductImage src={images[index].src} alt={images[index].alt} fill sizes="100vw" quality={90} blend={false} />
        </motion.div>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); setZoom(false); onIndex(index - 1); }} aria-label="Previous image" className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={(e) => { e.stopPropagation(); setZoom(false); onIndex(index + 1); }} aria-label="Next image" className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white shadow"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
    </motion.div>
  );
}
