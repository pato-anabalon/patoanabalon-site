"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { SkillItem } from "@/components/molecules";
import { TopographicLines } from "@/components/atoms";
import { skills } from "@/lib/data/cv";
import { skillsTopoLayer1, skillsTopoLayer2 } from "@/lib/data/skillsTopo";
import type { Skill } from "@/types";

const CATEGORY_ORDER: Skill["category"][] = [
  "frontend",
  "backend",
  "cloud",
  "ai",
  "tools",
  "creative",
];

export function SkillsSection() {
  const t = useTranslations("skills");
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
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
    const pinScroll = window.innerHeight * (total - 1) * 0.9;

    const ctx = gsap.context(() => {
      // Initial: first slide visible, rest hidden below
      gsap.set(slides[0], { opacity: 1, y: 0, pointerEvents: "auto" });
      for (let i = 1; i < total; i++) {
        gsap.set(slides[i], { opacity: 0, y: 80, pointerEvents: "none" });
      }

      // Pin + scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${pinScroll}`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
      });

      // 5 transitions between 6 categories.
      // Each transition sits ~0.15 (15% of timeline) around its boundary.
      const step = 1 / (total - 1);
      for (let i = 0; i < total - 1; i++) {
        const at = i * step + step * 0.55; // trigger a bit past the mid-slot

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
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      id="skills"
      data-testid="skills-section"
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-bg-primary)]"
    >
      {/* Topographic contour lines — 2 layers drifting in opposite directions
          via CSS animations on `.skills-topo-1` / `.skills-topo-2` classes. */}
      <div
        aria-hidden="true"
        data-testid="skills-topo"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <TopographicLines
          className="skills-topo-layer skills-topo-1"
          paths={skillsTopoLayer1}
          stroke="#10B981"
          strokeWidth={1.2}
          groupId="topo-set-1"
        />
        <TopographicLines
          className="skills-topo-layer skills-topo-2"
          paths={skillsTopoLayer2}
          stroke="#34D399"
          strokeWidth={0.8}
          groupId="topo-set-2"
        />
      </div>

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
        {/* Header */}
        <div className="pt-24 md:pt-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-4">
                03 — {t("heading")}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--color-text-primary)] leading-tight">
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
          className="relative flex-1 px-6"
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
                  className="absolute inset-0 flex items-center will-change-transform"
                >
                  <div className="grid md:grid-cols-2 gap-10 md:gap-16 w-full items-center">
                    {/* Left: category info */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[var(--color-accent)] mb-4">
                        {t("chapterLabel")} · {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-[var(--color-text-primary)] leading-[0.95] tracking-tight mb-6">
                        {t(`categories.${cat}.title`)}
                      </h3>
                      <p className="text-base md:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-md">
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
