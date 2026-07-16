'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap, SplitText } from '@/lib/animations/gsap';
import { CompanyCard, MilestoneCard, TileSkeleton } from '@/components/molecules';
import { experiences, companyLogos, companyLogosSmall } from '@/lib/data/cv';
import { trackItems } from '@/lib/data/experienceTrack';
import type { Experience } from '@/types';

// Photo tiles in the track — files live in public/images/experience/
const TRACK_PHOTOS: Record<string, string> = {
  latamCeremony: '/images/experience/award-latam.jpg',
  globantTeam: '/images/experience/award-globant.jpeg',
  minkPitch: '/images/experience/pitch-day.png'
};

export function ExperienceSection() {
  const t = useTranslations('experience');
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !pinRef.current) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    const label = section.querySelector<HTMLElement>('[data-exp-label]');
    const heading = section.querySelector<HTMLElement>('[data-exp-heading]');
    const sub = section.querySelector<HTMLElement>('[data-exp-sub]');

    let splitHeading: SplitText | undefined;
    let splitSub: SplitText | undefined;

    const scrambleChars = '!<>-_/=+*^?#01';

    const ctx = gsap.context(() => {
      // ── Header entrance ────────────────────────────────────────
      if (label) {
        const originalLabel = label.textContent ?? '';
        gsap.to(label, {
          scrambleText: { text: originalLabel, chars: scrambleChars, speed: 0.5 },
          duration: 0.7,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true }
        });
      }

      // H2: chars flip in 3D (rotationX -60 → 0) with back.out easing
      if (heading) {
        gsap.set(heading, { perspective: 400 });
        splitHeading = new SplitText(heading, { type: 'chars' });
        gsap.set(splitHeading.chars, { rotationX: -60, opacity: 0 });
        gsap.to(splitHeading.chars, {
          rotationX: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.03,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: heading, start: 'top 80%', once: true }
        });
      }

      // Subheading: word wave with blur
      if (sub) {
        splitSub = new SplitText(sub, { type: 'words' });
        gsap.set(splitSub.words, { opacity: 0, y: 15, filter: 'blur(6px)' });
        gsap.to(splitSub.words, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: { trigger: sub, start: 'top 85%', once: true }
        });
      }

      // ── Horizontal scroll timeline (unchanged behaviour) ───────
      const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(track, { x: () => -getScrollDistance(), ease: 'none' }, 0);

      if (progress) {
        tl.to(progress, { scaleX: 1, ease: 'none', transformOrigin: 'left center' }, 0);
      }

      // ── Per-item entrance tied to the horizontal timeline ──────
      // containerAnimation tells ScrollTrigger to evaluate positions
      // against the timeline's progress instead of window scroll.
      const items = Array.from(track.children) as HTMLElement[];
      gsap.set(items, { opacity: 0, scale: 0.92, y: 24 });

      items.forEach((item) => {
        gsap.to(item, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            containerAnimation: tl,
            start: 'left 90%',
            once: true
          }
        });
      });

      // Milestone "big" texts scramble in as each milestone card enters
      const milestoneBigs = track.querySelectorAll<HTMLElement>('[data-milestone-big]');
      milestoneBigs.forEach((el) => {
        const originalText = el.textContent ?? '';
        gsap.to(el, {
          scrambleText: {
            text: originalText,
            chars: scrambleChars,
            speed: 0.5
          },
          duration: 0.8,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            containerAnimation: tl,
            start: 'left 75%',
            once: true
          }
        });
      });
    }, section);

    return () => {
      ctx.revert();
      splitHeading?.revert();
      splitSub?.revert();
    };
  }, []);

  const experienceMap: Record<string, Experience> = experiences.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});

  return (
    <section
      id="experience"
      data-testid="experience-section"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        // Warm, deeper dark — distinct from hero and about
        background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 60%), #0A0F1C'
      }}
    >
      {/* Aurora orbs — animated depth backdrop */}
      <div
        aria-hidden="true"
        data-testid="experience-aurora"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="exp-orb exp-orb-1" />
        <div className="exp-orb exp-orb-2" />
        <div className="exp-orb exp-orb-3" />
      </div>

      {/* Subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      <div ref={pinRef} className="h-dvh flex flex-col">
        {/* Header */}
        <div ref={headerRef} className="pt-20 sm:pt-28 md:pt-32 pb-4 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <p
              data-exp-label
              className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-widest mb-3 sm:mb-4"
            >
              02 — {t('heading')}
            </p>
            <div className="flex flex-col md:flex-row md:items-end gap-3 sm:gap-6 justify-between">
              <h2
                data-exp-heading
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[var(--color-text-primary)] leading-tight max-w-xl"
              >
                {t('heading')}
              </h2>
              <p data-exp-sub className="text-[var(--color-text-muted)] max-w-sm text-sm leading-relaxed">
                {t('subheading')}
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal scrolling track */}
        <div className="flex-1 flex items-center relative" data-testid="experience-track-viewport">
          <div
            ref={trackRef}
            className="flex items-center gap-6 sm:gap-8 pl-[75vw] pr-[20vw] will-change-transform"
            style={{ width: 'max-content' }}
          >
            {trackItems.map((item, i) => {
              if (item.kind === 'company') {
                const exp = experienceMap[item.id];
                if (!exp) return null;
                const translatedExp: Experience = {
                  ...exp,
                  role: t(`companies.${item.id}.role`),
                  period: t(`companies.${item.id}.period`),
                  description: t.raw(`companies.${item.id}.description`) as string[]
                };
                return (
                  <CompanyCard
                    key={`company-${item.id}-${i}`}
                    experience={translatedExp}
                    logoSrc={companyLogos[item.id]}
                    logoSmallSrc={companyLogosSmall[item.id]}
                    isPresent={exp.id === 'latam'}
                    nowLabel={t('nowLabel')}
                  />
                );
              }

              if (item.kind === 'milestone') {
                return (
                  <MilestoneCard
                    key={`milestone-${item.slug}-${i}`}
                    slug={item.slug}
                    big={t(`milestones.${item.slug}.big`)}
                    year={t(`milestones.${item.slug}.year`)}
                    text={t(`milestones.${item.slug}.text`)}
                    label={t('milestoneLabel')}
                  />
                );
              }

              // photo tile — real image from public/images/experience/
              const photoSrc = TRACK_PHOTOS[item.slug];
              const photoLabel = t(`photos.${item.slug}`);
              return (
                <div
                  key={`photo-${item.slug}-${i}`}
                  className="flex-shrink-0 w-[320px] sm:w-[340px] h-[530px] sm:h-[575px] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]"
                >
                  <TileSkeleton
                    index={item.index}
                    label={photoLabel}
                    imageSrc={photoSrc}
                    imageAlt={photoLabel}
                    className="h-full w-full"
                  />
                </div>
              );
            })}

            {/* End card — closing marker + hint to continue scrolling */}
            <div
              data-testid="experience-track-end"
              className="flex-shrink-0 w-[240px] sm:w-[280px] h-[530px] sm:h-[575px] rounded-3xl border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-4 p-8 text-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                {t('trackEnd.label')}
              </span>
              <p className="text-lg font-heading text-[var(--color-text-primary)]">{t('trackEnd.message')}</p>
              <span className="text-xs text-[var(--color-text-muted)]">{t('trackEnd.hint')}</span>
            </div>
          </div>
        </div>

        {/* Progress bar + hint */}
        <div className="px-6 sm:px-10 lg:px-16 pt-6 sm:pt-0 pb-6 sm:pb-10 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap">
              {t('trackLabel')}
            </span>
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.15)] relative overflow-hidden">
              <div
                ref={progressRef}
                className="absolute inset-0 bg-[var(--color-accent)] scale-x-0"
                style={{ transformOrigin: 'left center' }}
              />
            </div>
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap">
              {t('scrollHint')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
