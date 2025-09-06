import { useState, useRef, DragEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sampleNFTs } from "@/lib/mock";
import { hoverLift } from "@/lib/motion";

export function UploadDropzone({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="glass rounded-2xl p-8 text-center cursor-pointer"
      onClick={() => inputRef.current?.click()}
      role="button"
      aria-label="Upload artwork"
    >
      <UploadCloud className="w-6 h-6 mx-auto text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">Drag & drop image, or click to upload</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

export function ArtworkCarousel({ items = sampleNFTs }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((p) => (p + 1) % items.length);
  const prev = () => setIndex((p) => (p - 1 + items.length) % items.length);
  const item = items[index];
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={item.id}
            src={item.image}
            alt={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="aspect-video object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={prev} className="hover:underline">Prev</button>
        <div>
          {index + 1} / {items.length}
        </div>
        <button onClick={next} className="hover:underline">Next</button>
      </div>
    </div>
  );
}

export function NFTPreviewSpotlight({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div {...hoverLift} className="relative aspect-square w-full max-w-sm mx-auto">
      <div className="absolute inset-0 rounded-3xl bg-black/60 blur-2xl" />
      <Card className="relative overflow-hidden rounded-3xl border-white/10">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
      </Card>
    </motion.div>
  );
}
