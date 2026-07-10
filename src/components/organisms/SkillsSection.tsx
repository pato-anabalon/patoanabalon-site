"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger, SplitText } from "@/lib/animations/gsap";
import { SkillItem } from "@/components/molecules";
import { VortexBackground } from "@/components/atoms";
import { skills } from "@/lib/data/cv";
import { SKILL_PALETTES } from "@/lib/data/skillPalettes";
import type { Skill } from "@/types";

const CATEGORY_ORDER: Skill["category"][] = [
  "frontend",
  "design",
  "backend",
  "database",
  "cloud",
  "ai",
  "testing",
  "devops",
  "observability",
  "tools",
  "creative",
];

export function SkillsSection() {
  const t = useTranslations("skills");
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const cascadeSlideFnRef = useRef<((index: number) => void) | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Skills grouped by category (frozen at module load — pure derivation)
  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => ({ ...acc, [cat]: skills.filter((s) => s.category === cat) }),
    {} as Record<Skill["category"], Skill[]>,
  );

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !stackRef.current) return;

    const section = sectionRef.current;
    const stack = stackRef.current;
    const slides = Array.from(
      stack.querySelectorAll<HTMLElement>("[data-cat-index]"),
    );
    if (!slides.length) return;

    const total = slides.length;
    // 0.6 → each slide costs ~60% of viewport of scroll (down from ~90%).
    // Was 0.9; users had to scroll a lot per skill.
    const pinScroll = window.innerHeight * (total - 1) * 0.6;
    const scrambleChars = "!<>-_/=+*^?#01";

    const label = section.querySelector<HTMLElement>("[data-skills-label]");
    const heading = section.querySelector<HTMLElement>("[data-skills-heading]");

    // Split the section H2 for the "from edges" char stagger
    let splitHeading: SplitText | undefined;
    if (heading) {
      gsap.set(heading, { perspective: 400 });
      splitHeading = new SplitText(heading, { type: "chars" });
      gsap.set(splitHeading.chars, { autoAlpha: 0, y: 30 });
    }

    // Per-slide setup — grab element refs, no SplitText per slide (was creating
    // ~400 DOM nodes across 11 slides which pushed the tab over the OOM edge).
    type SlideAssets = {
      label: HTMLElement | null;
      title: HTMLElement | null;
      desc: HTMLElement | null;
      cards: HTMLElement[];
    };

    const slideAssets: SlideAssets[] = slides.map((slide) => ({
      label: slide.querySelector<HTMLElement>("[data-cat-label]"),
      title: slide.querySelector<HTMLElement>("[data-cat-title]"),
      desc: slide.querySelector<HTMLElement>("[data-cat-desc]"),
      cards: Array.from(
        slide.querySelectorAll<HTMLElement>(
          '[data-testid^="molecule-skill-item-"]',
        ),
      ),
    }));

    // Hide every slide's internals so cascadeSlide() can reveal them
    slideAssets.forEach(({ label, title, desc, cards }) => {
      if (label) gsap.set(label, { autoAlpha: 0, x: -20 });
      if (title) gsap.set(title, { autoAlpha: 0, y: 24 });
      if (desc) gsap.set(desc, { autoAlpha: 0, y: 16 });
      // Cards animate in as a flat fade + small vertical drift + stagger.
      // Previously used rotationY: 45 with perspective — created 3D compositing
      // layers per card that persisted after the cascade and accumulated GPU
      // memory across the 11 slides, causing OOM.
      if (cards.length) gsap.set(cards, { autoAlpha: 0, y: 20 });
    });

    // Cascade a slide once — subsequent calls for the same index are no-ops
    const cascadedIndices = new Set<number>();
    const cascadeSlide = (index: number) => {
      if (cascadedIndices.has(index)) return;
      cascadedIndices.add(index);
      const assets = slideAssets[index];
      if (!assets) return;

      const tl = gsap.timeline();
      if (assets.label) {
        tl.to(assets.label, {
          autoAlpha: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
      if (assets.title) {
        tl.to(
          assets.title,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.2",
        );
      }
      if (assets.desc) {
        tl.to(
          assets.desc,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.35",
        );
      }
      if (assets.cards.length) {
        const rows = Math.ceil(assets.cards.length / 2);
        tl.to(
          assets.cards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: {
              grid: [rows, 2],
              from: "start",
              amount: 0.4,
            },
            ease: "power3.out",
          },
          "-=0.3",
        );
      }
    };
    cascadeSlideFnRef.current = cascadeSlide;

    const ctx = gsap.context(() => {
      // ── Header entrance ────────────────────────────────────────
      if (label) {
        const originalLabel = label.textContent ?? "";
        gsap.to(label, {
          scrambleText: {
            text: originalLabel,
            chars: scrambleChars,
            speed: 0.5,
          },
          duration: 0.7,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });
      }

      if (splitHeading) {
        gsap.to(splitHeading.chars, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: { from: "edges", amount: 0.35 },
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading ?? section,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Cascade slide 0 as the section approaches viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        once: true,
        onEnter: () => cascadeSlide(0),
      });

      // Initial: first slide visible, rest hidden below
      gsap.set(slides[0], { opacity: 1, y: 0, pointerEvents: "auto" });
      for (let i = 1; i < total; i++) {
        gsap.set(slides[i], { opacity: 0, y: 80, pointerEvents: "none" });
      }

      // Pin + scrub timeline (crossfade between slides unchanged)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${pinScroll}`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Snap to slide boundaries when the user stops scrolling so we
          // never rest mid-transition between two skills.
          snap: {
            snapTo: 1 / (total - 1),
            duration: { min: 0.15, max: 0.4 },
            delay: 0.05,
            ease: "power2.inOut",
          },
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
      });

      const step = 1 / (total - 1);
      for (let i = 0; i < total - 1; i++) {
        const at = i * step + step * 0.55;

        tl.to(
          slides[i],
          { opacity: 0, y: -80, duration: step * 0.4, ease: "power2.inOut" },
          at,
        );
        tl.to(
          slides[i + 1],
          {
            opacity: 1,
            y: 0,
            duration: step * 0.4,
            ease: "power2.inOut",
            onStart: () => {
              slides[i + 1].style.pointerEvents = "auto";
            },
            onReverseComplete: () => {
              slides[i + 1].style.pointerEvents = "none";
            },
          },
          at,
        );
      }
    }, section);

    return () => {
      ctx.revert();
      splitHeading?.revert();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  // Fire the cascade when activeIndex changes (skip index 0 — handled on entry)
  useEffect(() => {
    if (activeIndex === 0) return;
    cascadeSlideFnRef.current?.(activeIndex);
  }, [activeIndex]);

  return (
    <section
      id="skills"
      data-testid="skills-section"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-bg-primary)]"
    >
      {/* Subtle static dot texture underneath everything */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div
        ref={pinRef}
        className="relative h-dvh flex flex-col"
        data-testid="skills-pin"
      >
        {/* Vortex particle band — sits behind everything else and swaps
            palette per active category. */}
        <VortexBackground
          className="absolute inset-0 z-0 pointer-events-none"
          position="bottom"
          bandHeight="80%"
          particleCount={100}
          glowBlurs={[]}
          colors={SKILL_PALETTES[CATEGORY_ORDER[activeIndex]]}
        />

        {/* Header */}
        <div className="pt-24 md:pt-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div>
              <p
                data-skills-label
                className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4"
              >
                03 — {t("heading")}
              </p>
              <h2
                data-skills-heading
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--color-text-primary)] leading-tight"
              >
                {t("heading")}
              </h2>
            </div>

            {/* Progress dots */}
            <div
              className="hidden sm:flex items-center gap-3 pt-4"
              data-testid="skills-progress"
              aria-hidden="true"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(CATEGORY_ORDER.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {CATEGORY_ORDER.map((_, i) => (
                  <span
                    key={i}
                    data-testid={`skills-progress-dot-${i}`}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === activeIndex
                        ? "w-8 bg-[var(--color-accent)]"
                        : i < activeIndex
                          ? "w-1.5 bg-[var(--color-accent)] opacity-60"
                          : "w-1.5 bg-[var(--color-border)]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deck stack — all slides layered, GSAP crossfades between them */}
        <div
          ref={stackRef}
          className="relative z-10 flex-1 px-6"
          data-testid="skills-deck"
        >
          <div className="max-w-7xl mx-auto h-full relative">
            {CATEGORY_ORDER.map((cat, i) => {
              const categorySkills = grouped[cat];
              return (
                <div
                  key={cat}
                  data-cat-index={i}
                  data-testid={`skills-slide-${cat}`}
                  className="absolute inset-0 flex items-center"
                >
                  <div className="grid md:grid-cols-2 gap-10 md:gap-16 w-full items-center">
                    {/* Left: category info */}
                    <div>
                      <p
                        data-cat-label
                        className="text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--color-accent)] mb-4"
                      >
                        {t("chapterLabel")} · {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3
                        data-cat-title
                        className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-[var(--color-text-primary)] leading-[0.95] tracking-tight mb-6"
                      >
                        {t(`categories.${cat}.title`)}
                      </h3>
                      <p
                        data-cat-desc
                        className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-md"
                      >
                        {t(`categories.${cat}.description`)}
                      </p>
                    </div>

                    {/* Right: skills grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 max-h-[70vh] overflow-hidden">
                      {categorySkills.map((skill) => (
                        <SkillItem key={skill.name} name={skill.name} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer scroll hint */}
        <div className="pb-8 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>{t("subheading")}</span>
            <span className="hidden sm:inline">Scroll ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
