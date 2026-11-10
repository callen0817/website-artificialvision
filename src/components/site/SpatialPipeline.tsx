import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Physical environment", detail: "Sensors traverse the real site" },
  { label: "Point cloud", detail: "LiDAR + imagery captured at walking speed" },
  { label: "Structured data", detail: "Registered, waypointed, classified" },
  { label: "Intelligent environment", detail: "A queryable digital twin" },
];

const STAGE_MS = 3600;

interface Pt {
  x: number;
  y: number;
  z: number;
  cls: 0 | 1 | 2 | 3; // floor, ceiling, wall, object
  jx: number;
  jy: number;
  jz: number;
}

function buildScene(): Pt[] {
  const pts: Pt[] = [];
  const rand = (n: number) => (Math.random() - 0.5) * n;
  const W = 9, D = 7, H = 3.2;

  const push = (x: number, y: number, z: number, cls: Pt["cls"]) =>
    pts.push({ x, y, z, cls, jx: rand(0.55), jy: rand(0.55), jz: rand(0.55) });

  for (let i = 0; i < 2200; i++) push(rand(W), 0, rand(D), 0);
  for (let i = 0; i < 1100; i++) push(rand(W), H, rand(D), 1);
  for (let i = 0; i < 1500; i++) push(-W / 2, Math.random() * H, rand(D), 2);
  for (let i = 0; i < 1500; i++) push(W / 2, Math.random() * H, rand(D), 2);
  for (let i = 0; i < 1200; i++) push(rand(W), Math.random() * H, -D / 2, 2);
  for (let i = 0; i < 1200; i++) push(rand(W), Math.random() * H, D / 2, 2);

  // columns + volumes (equipment, partitions)
  const cols = [
    [-2.4, -1.2],
    [2.4, -1.2],
    [-2.4, 1.6],
    [2.4, 1.6],
  ];
  cols.forEach(([cx, cz]) => {
    for (let i = 0; i < 420; i++) {
      const a = Math.random() * Math.PI * 2;
      push(cx + Math.cos(a) * 0.28, Math.random() * H, cz + Math.sin(a) * 0.28, 3);
    }
  });
  for (let i = 0; i < 500; i++) push(rand(2.2), Math.random() * 0.9, 2.2 + rand(1.2), 3);

  return pts;
}

const EDGES: [number[], number[]][] = (() => {
  const W = 9, D = 7, H = 3.2;
  const c = [
    [-W / 2, 0, -D / 2], [W / 2, 0, -D / 2], [W / 2, 0, D / 2], [-W / 2, 0, D / 2],
    [-W / 2, H, -D / 2], [W / 2, H, -D / 2], [W / 2, H, D / 2], [-W / 2, H, D / 2],
  ];
  const pairs = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  return pairs.map(([a, b]) => [c[a], c[b]] as [number[], number[]]);
})();

// Solid surfaces used for the "physical environment" stage
const SURFACES: { pts: number[][]; l: number }[] = (() => {
  const W = 9, D = 7, H = 3.2;
  const s: { pts: number[][]; l: number }[] = [
    { pts: [[-W / 2, 0, -D / 2], [W / 2, 0, -D / 2], [W / 2, 0, D / 2], [-W / 2, 0, D / 2]], l: 24 },
    { pts: [[-W / 2, H, -D / 2], [W / 2, H, -D / 2], [W / 2, H, D / 2], [-W / 2, H, D / 2]], l: 15 },
    { pts: [[-W / 2, 0, -D / 2], [-W / 2, H, -D / 2], [-W / 2, H, D / 2], [-W / 2, 0, D / 2]], l: 30 },
    { pts: [[W / 2, 0, -D / 2], [W / 2, H, -D / 2], [W / 2, H, D / 2], [W / 2, 0, D / 2]], l: 27 },
    { pts: [[-W / 2, 0, -D / 2], [W / 2, 0, -D / 2], [W / 2, H, -D / 2], [-W / 2, H, -D / 2]], l: 34 },
    { pts: [[-W / 2, 0, D / 2], [W / 2, 0, D / 2], [W / 2, H, D / 2], [-W / 2, H, D / 2]], l: 33 },
  ];
  // columns as boxes
  const cols = [[-2.4, -1.2], [2.4, -1.2], [-2.4, 1.6], [2.4, 1.6]];
  cols.forEach(([cx, cz]) => {
    const r = 0.28;
    const faces = [
      [[cx - r, 0, cz - r], [cx + r, 0, cz - r], [cx + r, H, cz - r], [cx - r, H, cz - r]],
      [[cx + r, 0, cz - r], [cx + r, 0, cz + r], [cx + r, H, cz + r], [cx + r, H, cz - r]],
      [[cx + r, 0, cz + r], [cx - r, 0, cz + r], [cx - r, H, cz + r], [cx - r, H, cz + r]],
      [[cx - r, 0, cz + r], [cx - r, 0, cz - r], [cx - r, H, cz - r], [cx - r, H, cz + r]],
    ];
    faces.forEach((f, i) => s.push({ pts: f, l: 40 + i * 4 }));
  });
  // equipment volume
  const ex = 2.2, ez0 = 1.6, ez1 = 3.0, eh = 0.9;
  s.push({ pts: [[-ex, 0, ez0], [ex, 0, ez0], [ex, eh, ez0], [-ex, eh, ez0]], l: 44 });
  s.push({ pts: [[-ex, eh, ez0], [ex, eh, ez0], [ex, eh, ez1], [-ex, eh, ez1]], l: 50 });
  return s;
})();

export const SpatialPipeline = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = buildScene();
    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    let lastStage = -1;

    const project = (x: number, y: number, z: number, ang: number) => {
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const cy = y - 1.5;
      const camZ = rz + 13;
      const f = 620;
      const s = f / Math.max(camZ, 0.6);
      return {
        sx: width / 2 + rx * s,
        sy: height / 2 - (cy - 0.35) * s * 0.92,
        s,
        depth: camZ,
      };
    };

    const frame = (now: number) => {
      const elapsed = now - start;
      const total = STAGE_MS * STAGES.length;
      const t = (elapsed % total) / STAGE_MS;
      const idx = Math.floor(t);
      const local = t - idx;
      const ease = local < 0.35 ? local / 0.35 : 1;

      if (idx !== lastStage) {
        lastStage = idx;
        setStage(idx);
      }

      const ang = reduce ? 0.5 : (elapsed / 1000) * 0.085 + 0.4;

      // stage weights
      // 0 physical environment (solid surfaces only)
      // 1 point cloud only
      // 2 structured data: boxy outlines only, no point cloud
      // 3 intelligent environment: everything overlaid
      const surf = idx === 0 ? 1 : idx === 1 ? Math.max(0, 1 - ease * 1.6) : 0;
      const cloud = idx === 0 ? 0 : idx === 1 ? ease : idx === 2 ? Math.max(0, 1 - ease * 1.6) : ease;
      const raw = idx === 1 ? Math.max(0, 0.6 - ease * 0.6) : 0;
      const classify = idx === 3 ? ease : 0;
      const twin = idx === 3 ? ease : 0;

      ctx.clearRect(0, 0, width, height);

      // solid physical environment
      if (surf > 0.01) {
        const faces = SURFACES.map((f, i) => {
          const proj = f.pts.map((p) => project(p[0], p[1], p[2], ang));
          const depth = proj.reduce((a, p) => a + p.depth, 0) / proj.length;
          return { proj, depth, l: f.l, room: i < 6 };
        })
          .filter((f) => !(f.room && f.depth < 12))
          .sort((a, b) => b.depth - a.depth);
        faces.forEach((f) => {
          ctx.beginPath();
          ctx.moveTo(f.proj[0].sx, f.proj[0].sy);
          for (let i = 1; i < f.proj.length; i++) ctx.lineTo(f.proj[i].sx, f.proj[i].sy);
          ctx.closePath();
          ctx.fillStyle = `hsla(35, 7%, ${f.l}%, ${0.98 * surf})`;
          ctx.fill();
          ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.09 * surf})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // structural wireframe
      const wire = idx === 2 ? Math.min(1, ease * 1.6) : idx === 3 ? 1 : 0;
      if (wire > 0.01) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `hsla(42, 38%, 60%, ${0.7 * wire})`;
        EDGES.forEach(([a, b]) => {
          const pa = project(a[0], a[1], a[2], ang);
          const pb = project(b[0], b[1], b[2], ang);
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        });
        // classified volumes as boxy outlines
        ctx.strokeStyle = `hsla(0, 0%, 100%, ${0.28 * wire})`;
        ctx.lineWidth = 1;
        SURFACES.slice(6).forEach((f) => {
          const proj = f.pts.map((p) => project(p[0], p[1], p[2], ang));
          ctx.beginPath();
          ctx.moveTo(proj[0].sx, proj[0].sy);
          for (let i = 1; i < proj.length; i++) ctx.lineTo(proj[i].sx, proj[i].sy);
          ctx.closePath();
          ctx.stroke();
        });
      }

      if (cloud > 0.01) for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const x = p.x + p.jx * raw;
        const y = p.y + p.jy * raw * 0.5;
        const z = p.z + p.jz * raw;
        const { sx, sy, s, depth } = project(x, y, z, ang);
        if (sx < -60 || sx > width + 60 || sy < -60 || sy > height + 60) continue;

        const fade = Math.max(0, Math.min(1, 1 - (depth - 6) / 18));
        let h = 0, sat = 0, l = 78;
        if (classify > 0) {
          if (p.cls === 0) { h = 220; sat = 5; l = 55; }
          else if (p.cls === 1) { h = 220; sat = 4; l = 40; }
          else if (p.cls === 2) { h = 0; sat = 0; l = 88; }
          else { h = 42; sat = 38 + twin * 20; l = 56; }
          sat *= classify;
        }
        const alpha = (0.14 + fade * 0.5) * cloud;
        ctx.fillStyle = `hsla(${h}, ${sat}%, ${l}%, ${alpha})`;
        const size = Math.max(0.6, s * 0.0022 + (p.cls === 3 ? 0.35 : 0));
        ctx.fillRect(sx, sy, size, size);
      }

      // capture waypoints appear at structured stage
      if (wire > 0.01) {
        const wp = [[-3, 0.1, -2], [0, 0.1, 0], [3, 0.1, 2], [-2, 0.1, 2.4]];
        wp.forEach(([x, y, z], i) => {
          const { sx, sy } = project(x, y, z, ang);
          const pulse = 0.5 + 0.5 * Math.sin(elapsed / 600 + i);
          ctx.beginPath();
          ctx.arc(sx, sy, 3 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(42, 38%, 60%, ${0.6 * wire})`;
          ctx.stroke();
        });
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 lg:p-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {STAGES.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "h-px w-6 transition-colors duration-500",
                  i === stage ? "bg-gold" : "bg-border"
                )}
              />
              <span
                className={cn(
                  "label-mono transition-colors duration-500",
                  i === stage ? "text-gold" : "text-muted-foreground/60"
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground transition-opacity duration-500">
          {STAGES[stage].detail}
        </p>
      </div>
    </div>
  );
};

export default SpatialPipeline;