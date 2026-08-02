"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type ReactNode,
} from "react";
import "./PixelCard.css";

type PixelCardVariant = "default" | "blue" | "yellow" | "pink";

type PixelCardProps = {
  variant?: PixelCardVariant;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  alwaysActive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  const parsed = Number.parseInt(String(value), 10);

  if (parsed <= min || reducedMotion) {
    return min;
  }
  if (parsed >= max) {
    return max * throttle;
  }
  return parsed * throttle;
}

const VARIANTS: Record<
  PixelCardVariant,
  {
    activeColor: string | null;
    gap: number;
    speed: number;
    colors: string;
    noFocus: boolean;
  }
> = {
  default: {
    activeColor: null,
    gap: 5,
    speed: 35,
    colors: "#f8fafc,#f1f5f9,#cbd5e1",
    noFocus: false,
  },
  blue: {
    activeColor: "#e0f2fe",
    gap: 10,
    speed: 25,
    colors: "#e0f2fe,#7dd3fc,#0ea5e9",
    noFocus: false,
  },
  yellow: {
    activeColor: "#fef08a",
    gap: 3,
    speed: 20,
    colors: "#fef08a,#fde047,#eab308",
    noFocus: false,
  },
  pink: {
    activeColor: "#fecdd3",
    gap: 6,
    speed: 80,
    colors: "#fecdd3,#fda4af,#e11d48",
    noFocus: true,
  },
};

export default function PixelCard({
  variant = "default",
  gap,
  speed,
  colors,
  noFocus,
  alwaysActive = false,
  className = "",
  style,
  children,
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(0);
  const modeRef = useRef<"appear" | "disappear" | null>(null);
  const reducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;

  const variantCfg = VARIANTS[variant] || VARIANTS.default;
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;
  const finalNoFocus = noFocus ?? variantCfg.noFocus;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stopLoop = () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      modeRef.current = null;
    };

    const initPixels = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      if (width < 2 || height < 2) {
        pixelsRef.current = [];
        return false;
      }

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const colorsArray = finalColors.split(",");
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      // Fewer pixels on mobile = smoother frame rate
      const baseGap = Number.parseInt(String(finalGap), 10) || 5;
      const gapSize = isMobile ? Math.max(baseGap + 3, 8) : baseGap;
      const effectiveSpeed = getEffectiveSpeed(
        isMobile ? Math.min(finalSpeed, 40) : finalSpeed,
        reducedMotion,
      );
      const pxs: Pixel[] = [];

      for (let x = 0; x < width; x += gapSize) {
        for (let y = 0; y < height; y += gapSize) {
          const color =
            colorsArray[Math.floor(Math.random() * colorsArray.length)];
          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotion
            ? 0
            : alwaysActive
              ? distance * (isMobile ? 0.12 : 0.2)
              : distance;

          const pixel = new Pixel(
            canvas,
            ctx,
            x,
            y,
            color,
            alwaysActive
              ? Math.max(effectiveSpeed, isMobile ? 0.022 : 0.03)
              : effectiveSpeed,
            delay,
          );

          if (alwaysActive && !reducedMotion) {
            pixel.size = pixel.maxSize;
            pixel.isShimmer = true;
            pixel.isIdle = false;
            pixel.counter = pixel.delay + 1;
          } else if (reducedMotion) {
            pixel.size = pixel.maxSize;
            pixel.isShimmer = false;
            pixel.isIdle = true;
          }

          pxs.push(pixel);
        }
      }

      pixelsRef.current = pxs;
      return pxs.length > 0;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixelsRef.current.forEach((pixel) => pixel.draw());
    };

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const frameMs = isMobile ? 1000 / 45 : 1000 / 60;

    const tick = (now: number) => {
      animationRef.current = requestAnimationFrame(tick);

      const mode = modeRef.current;
      if (!mode) return;

      if (!timePreviousRef.current) {
        timePreviousRef.current = now;
      }

      const timePassed = now - timePreviousRef.current;
      if (timePassed < frameMs) return;
      timePreviousRef.current = now - (timePassed % frameMs);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allIdle = true;
      for (const pixel of pixelsRef.current) {
        pixel[mode]();
        if (!pixel.isIdle) allIdle = false;
      }

      if (allIdle && !alwaysActive) {
        stopLoop();
      }
    };

    const startMode = (mode: "appear" | "disappear") => {
      modeRef.current = mode;
      timePreviousRef.current = 0;
      if (animationRef.current === null) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    const boot = () => {
      const ready = initPixels();
      if (!ready) return;

      if (reducedMotion) {
        drawStatic();
        return;
      }

      if (alwaysActive) {
        startMode("appear");
      }
    };

    boot();

    const observer = new ResizeObserver(() => {
      const ready = initPixels();
      if (!ready) return;
      if (reducedMotion) {
        drawStatic();
        return;
      }
      if (alwaysActive) {
        startMode("appear");
      }
    });
    observer.observe(container);

    const onMouseEnter = () => {
      if (alwaysActive || reducedMotion) return;
      startMode("appear");
    };
    const onMouseLeave = () => {
      if (alwaysActive || reducedMotion) return;
      startMode("disappear");
    };
    const onFocus = (e: FocusEvent<HTMLDivElement>) => {
      if (alwaysActive || reducedMotion || finalNoFocus) return;
      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
      startMode("appear");
    };
    const onBlur = (e: FocusEvent<HTMLDivElement>) => {
      if (alwaysActive || reducedMotion || finalNoFocus) return;
      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
      startMode("disappear");
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("focusin", onFocus as unknown as EventListener);
    container.addEventListener("focusout", onBlur as unknown as EventListener);

    return () => {
      observer.disconnect();
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener(
        "focusin",
        onFocus as unknown as EventListener,
      );
      container.removeEventListener(
        "focusout",
        onBlur as unknown as EventListener,
      );
      stopLoop();
    };
  }, [
    alwaysActive,
    finalColors,
    finalGap,
    finalNoFocus,
    finalSpeed,
    reducedMotion,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${alwaysActive ? "pixel-card-always" : ""} ${className}`.trim()}
      style={style}
      tabIndex={finalNoFocus || alwaysActive ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      <div className="pixel-card-scrim" aria-hidden />
      {children}
    </div>
  );
}
