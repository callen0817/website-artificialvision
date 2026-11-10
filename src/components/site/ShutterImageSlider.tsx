import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { avShutterPhotos } from "@/data/avShutter";

export default function ShutterImageSlider() {
  const [index, setIndex] = useState(0);
  const photo = avShutterPhotos[index];
  if (!photo) return null;

  return (
    <div role="region" aria-label="AV Shutter 360 product photos">
      <div className="flex aspect-square w-full items-center justify-center bg-background">
        <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-contain" />
      </div>
      <div className="space-y-4 border-t border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p aria-live="polite" className="label-mono text-muted-foreground">{photo.caption}</p>
          <span className="label-mono shrink-0 text-muted-foreground">{index + 1} / {avShutterPhotos.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" aria-label="Previous AV Shutter photo" onClick={() => setIndex(current => (current + avShutterPhotos.length - 1) % avShutterPhotos.length)}><ChevronLeft /></Button>
          <Slider min={0} max={avShutterPhotos.length - 1} step={1} value={[index]} onValueChange={value => setIndex(value[0] ?? 0)} aria-label="AV Shutter photo" />
          <Button variant="outline" size="icon" aria-label="Next AV Shutter photo" onClick={() => setIndex(current => (current + 1) % avShutterPhotos.length)}><ChevronRight /></Button>
        </div>
      </div>
    </div>
  );
}