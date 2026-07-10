"use client";

import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export interface VortexBackgroundProps {
  /** Palette of stroke colors. Each particle picks one at spawn. */
  colors?: string[];
  /** Vertical anchor of the particle spawn band. */
  position?: "top" | "center" | "bottom";
  /**
   * Vertical spread of the spawn band. Number = pixels; string ending in
   * `%` = fraction of the canvas height (e.g. `"50%"`). The band is clamped
   * to stay fully inside the canvas.
   */
  bandHeight?: number | string;
  /** Number of particles. */
  particleCount?: number;
  /** Global opacity multiplier applied to the canvas element. */
  opacity?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  /** Blur radii (px) applied as additive glow passes. Empty disables glow. */
  glowBlurs?: number[];
  /** CSS mix-blend-mode of the canvas over what's underneath. */
  blendMode?: React.CSSProperties["mixBlendMode"];
  /** Solid canvas fill; use "transparent" to composite over parent. */
  backgroundColor?: string;
  /** Extra classes on the wrapper div. */
  className?: string;
  /** Freeze animation when the user prefers reduced motion. */
  respectReducedMotion?: boolean;
}

const DEFAULT_COLORS = ["#10B981", "#34D399", "#6EE7B7"];
const DEFAULT_GLOW_BLURS = [4, 2];
const TAU = Math.PI * 2;
const NOISE_STEPS = 3;
const X_OFF = 0.00125;
const Y_OFF = 0.00125;
const Z_OFF = 0.0005;
const BASE_TTL = 50;
const RANGE_TTL = 150;
const PROPS_PER_PARTICLE = 9;

const POSITION_ANCHOR: Record<NonNullable<VortexBackgroundProps["position"]>, number> = {
  top: 0.15,
  center: 0.5,
  bottom: 0.85,
};

const rand = (n: number) => n * Math.random();
const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};

/**
 * Resolve `bandHeight` (number or "%" string) into a pixel value relative to
 * the current canvas height.
 */
const resolveBandHeightPx = (
  bandHeight: number | string,
  canvasHeight: number,
): number => {
  if (typeof bandHeight === "number") return bandHeight;
  const trimmed = bandHeight.trim();
  if (trimmed.endsWith("%")) {
    const pct = parseFloat(trimmed);
    return Number.isFinite(pct) ? (pct / 100) * canvasHeight : 0;
  }
  const asNum = parseFloat(trimmed);
  return Number.isFinite(asNum) ? asNum : 0;
};

export function VortexBackground({
  colors = DEFAULT_COLORS,
  position = "center",
  bandHeight = 100,
  particleCount = 250,
  opacity = 1,
  baseSpeed = 0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  glowBlurs = DEFAULT_GLOW_BLURS,
  blendMode = "screen",
  backgroundColor = "transparent",
  className,
  respectReducedMotion = true,
}: VortexBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // All runtime knobs go into refs so prop changes never restart the loop.
  // The effect only re-runs when *structural* props change (particleCount,
  // respectReducedMotion) — palette, band, speeds, glow, etc. update live.
  const colorsRef = useRef(colors);
  colorsRef.current = colors.length > 0 ? colors : DEFAULT_COLORS;

  const anchorRef = useRef(POSITION_ANCHOR[position]);
  anchorRef.current = POSITION_ANCHOR[position];

  const bandHeightRef = useRef(bandHeight);
  bandHeightRef.current = bandHeight;

  const speedRef = useRef({ base: baseSpeed, range: rangeSpeed });
  speedRef.current = { base: baseSpeed, range: rangeSpeed };

  const radiusRef = useRef({ base: baseRadius, range: rangeRadius });
  radiusRef.current = { base: baseRadius, range: rangeRadius };

  const glowBlursRef = useRef(glowBlurs);
  glowBlursRef.current = glowBlurs;

  const backgroundColorRef = useRef(backgroundColor);
  backgroundColorRef.current = backgroundColor;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      respectReducedMotion &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles = new Float32Array(particleCount * PROPS_PER_PARTICLE);
    const particleColors: string[] = new Array(particleCount).fill(
      colorsRef.current[0],
    );
    const noise3D = createNoise3D();
    let tick = 0;
    let rafId = 0;

    const pickColor = () =>
      colorsRef.current[Math.floor(Math.random() * colorsRef.current.length)];

    /**
     * Compute the vertical spawn range in canvas coordinates. Anchors around
     * the requested `position` and half-band, then shifts the range so it
     * stays fully inside [0, canvas.height]. Falls back to full-height when
     * the band is larger than the canvas.
     */
    const getSpawnRangeY = (): [number, number] => {
      const bandPx = resolveBandHeightPx(
        bandHeightRef.current,
        canvas.height / dpr,
      ) * dpr;
      const halfBand = bandPx * 0.5;
      const anchorY = canvas.height * anchorRef.current;
      let yMin = anchorY - halfBand;
      let yMax = anchorY + halfBand;
      if (yMax - yMin >= canvas.height) return [0, canvas.height];
      if (yMin < 0) {
        yMax -= yMin;
        yMin = 0;
      }
      if (yMax > canvas.height) {
        yMin -= yMax - canvas.height;
        yMax = canvas.height;
      }
      return [yMin, yMax];
    };

    const initParticle = (idx: number, life = 0) => {
      const i = idx * PROPS_PER_PARTICLE;
      const [yMin, yMax] = getSpawnRangeY();
      const ttl = BASE_TTL + rand(RANGE_TTL);
      const { base: sBase, range: sRange } = speedRef.current;
      const { base: rBase, range: rRange } = radiusRef.current;
      particles[i] = rand(canvas.width);
      particles[i + 1] = yMin + rand(yMax - yMin);
      particles[i + 2] = 0;
      particles[i + 3] = 0;
      particles[i + 4] = life;
      particles[i + 5] = ttl;
      particles[i + 6] = sBase + rand(sRange);
      particles[i + 7] = rBase + rand(rRange);
      particles[i + 8] = 0;
      particleColors[idx] = pickColor();
    };

    const initAll = () => {
      tick = 0;
      for (let idx = 0; idx < particleCount; idx++) {
        initParticle(idx, rand(BASE_TTL + RANGE_TTL));
      }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = wrapper;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      initAll();
    };

    const outOfBounds = (x: number, y: number) =>
      x < 0 || x > canvas.width || y < 0 || y > canvas.height;

    const updateAndDraw = (idx: number) => {
      const i = idx * PROPS_PER_PARTICLE;
      const x = particles[i];
      const y = particles[i + 1];
      const angle =
        noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
      const vx = lerp(particles[i + 2], Math.cos(angle), 0.5);
      const vy = lerp(particles[i + 3], Math.sin(angle), 0.5);
      const life = particles[i + 4];
      const ttl = particles[i + 5];
      const speed = particles[i + 6];
      const radius = particles[i + 7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = radius * dpr;
      ctx.strokeStyle = particleColors[idx];
      ctx.globalAlpha = fadeInOut(life, ttl);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();

      particles[i] = x2;
      particles[i + 1] = y2;
      particles[i + 2] = vx;
      particles[i + 3] = vy;
      particles[i + 4] = life + 1;

      if (outOfBounds(x2, y2) || life + 1 > ttl) initParticle(idx);
    };

    const paintBackground = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bg = backgroundColorRef.current;
      if (bg !== "transparent") {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    const applyGlow = () => {
      for (const blurPx of glowBlursRef.current) {
        ctx.save();
        ctx.filter = `blur(${blurPx * dpr}px) brightness(200%)`;
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    };

    // Track viewport intersection so the rAF loop can pause while off-screen.
    // The wrapper is the observation target — even at opacity 0 it still owns
    // layout, so IntersectionObserver reflects the actual viewport overlap.
    let visible = true;

    const frame = () => {
      if (!visible) {
        rafId = 0;
        return;
      }
      tick++;
      paintBackground();
      for (let idx = 0; idx < particleCount; idx++) updateAndDraw(idx);
      applyGlow();
      rafId = window.requestAnimationFrame(frame);
    };

    const start = () => {
      if (rafId === 0 && visible) {
        rafId = window.requestAnimationFrame(frame);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    if (reducedMotion) {
      for (let idx = 0; idx < particleCount; idx++) {
        particles[idx * PROPS_PER_PARTICLE + 4] =
          particles[idx * PROPS_PER_PARTICLE + 5] * 0.5;
      }
      paintBackground();
      for (let idx = 0; idx < particleCount; idx++) updateAndDraw(idx);
      applyGlow();
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
        },
        { rootMargin: '100px' },
      );
      io.observe(wrapper);

      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        io.disconnect();
      };
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [particleCount, respectReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      data-testid="atom-vortex-background"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          mixBlendMode: blendMode,
        }}
      />
    </div>
  );
}
