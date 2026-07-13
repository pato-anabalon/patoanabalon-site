"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { FaRegFilePdf, FaRegFileWord } from "react-icons/fa6";
import { gsap } from "@/lib/animations/gsap";
import { SocialLink } from "@/components/atoms";
import { MenuItem } from "@/components/molecules";
import { socialLinks } from "@/lib/data/social";
import { trackEvent } from "@/lib/analytics";

const RESUME_PDF_PATH = "/docs/patricio-anabalon-resume.pdf";
const RESUME_DOCX_PATH = "/docs/patricio-anabalon-resume.docx";

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

interface MenuNavItem {
  id: string;
  href: string;
  label: string;
  caption: string;
  visualLabel: string;
  gradient: string;
}

export function FullscreenMenu({
  isOpen,
  onClose,
  activeSection,
}: FullscreenMenuProps) {
  const t = useTranslations("nav");
  const tHero = useTranslations("hero");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const visualsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items: MenuNavItem[] = [
    {
      id: "about",
      href: "#about",
      label: t("about"),
      caption:
        locale === "es"
          ? "18+ años · Ingeniero Senior"
          : "18+ years · Senior Engineer",
      visualLabel: "PROFILE",
      gradient: "from-emerald-500/40 via-teal-500/20 to-slate-900",
    },
    {
      id: "experience",
      href: "#experience",
      label: t("experience"),
      caption:
        locale === "es"
          ? "LATAM · Globant · Amicar · Mink · Indexa"
          : "LATAM · Globant · Amicar · Mink · Indexa",
      visualLabel: "JOURNEY",
      gradient: "from-blue-500/40 via-emerald-500/30 to-slate-900",
    },
    {
      id: "skills",
      href: "#skills",
      label: t("skills"),
      caption:
        locale === "es"
          ? "Frontend · Backend · Cloud · AI"
          : "Frontend · Backend · Cloud · AI",
      visualLabel: "STACK",
      gradient: "from-emerald-500/50 via-cyan-500/30 to-slate-900",
    },
    {
      id: "creative",
      href: "#creative",
      label: t("creative"),
      caption:
        locale === "es" ? "Motion · Video · Diseño" : "Motion · Video · Design",
      visualLabel: "CREATE",
      gradient: "from-purple-500/40 via-emerald-500/30 to-slate-900",
    },
    {
      id: "offscreen",
      href: "#offscreen",
      label: t("offScreen"),
      caption:
        locale === "es"
          ? "Vida entre commits"
          : "Life between commits",
      visualLabel: "OFF-SCREEN",
      gradient: "from-amber-500/30 via-emerald-500/30 to-slate-900",
    },
    {
      id: "contact",
      href: "#contact",
      label: t("contact"),
      caption:
        locale === "es" ? "Auckland, Nueva Zelanda" : "Auckland, New Zealand",
      visualLabel: "CONNECT",
      gradient: "from-emerald-400/50 via-teal-500/30 to-slate-900",
    },
  ];

  // Entrance / exit animation
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const leftPanel = panelLeftRef.current;
    const rightPanel = panelRightRef.current;
    const items = itemsRef.current?.querySelectorAll("[data-menu-item]");
    const footerLinks =
      footerRef.current?.querySelectorAll("[data-footer-item]");

    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Container fades in — no more instant background snap
      gsap.set(container, { visibility: "visible", pointerEvents: "auto" });
      gsap.fromTo(
        container,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );

      // Left panel slide down from top
      if (leftPanel) {
        gsap.fromTo(
          leftPanel,
          { yPercent: -100 },
          { yPercent: 0, duration: 0.9, ease: "power4.inOut" },
        );
      }

      // Right panel slide up from bottom
      if (rightPanel) {
        gsap.fromTo(
          rightPanel,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.9, ease: "power4.inOut" },
        );
      }

      // Menu items stagger
      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 60, rotationX: -30 },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.5,
            ease: "power3.out",
          },
        );
      }

      // Footer stagger
      if (footerLinks?.length) {
        gsap.fromTo(
          footerLinks,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            delay: 0.9,
            ease: "power2.out",
          },
        );
      }
    } else {
      document.body.style.overflow = "";
      // Exit: panels slide out; container fades out on the tail end
      if (leftPanel && rightPanel) {
        gsap.to(leftPanel, {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        });
        gsap.to(rightPanel, {
          yPercent: 100,
          duration: 0.7,
          ease: "power4.inOut",
        });
        gsap.to(container, {
          opacity: 0,
          duration: 0.35,
          delay: 0.4,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
          },
        });
      } else {
        gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
      }
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Determine which visual to show (hovered > active > first)
  const activeVisualIndex = (() => {
    if (hoveredIndex !== null) return hoveredIndex;
    const activeIdx = items.findIndex((i) => i.id === activeSection);
    return activeIdx >= 0 ? activeIdx : 0;
  })();

  const handleNavigate = (href: string) => {
    onClose();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 700);
  };

  return (
    <div
      data-testid="fullscreen-menu"
      ref={containerRef}
      className="fixed inset-0 z-40 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 bg-[var(--color-bg-primary)] invisible opacity-0 pointer-events-none"
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal={isOpen}
      aria-label="Site navigation"
    >
      <div className="relative w-full h-full flex flex-col lg:flex-row overflow-hidden rounded-2xl border border-[var(--color-border)]">
        {/* LEFT PANEL — Visual */}
        <div
          data-testid="fullscreen-menu-left-panel"
          ref={panelLeftRef}
          className="relative w-full lg:w-[42%] h-[25vh] lg:h-full bg-[var(--color-bg-secondary)] overflow-hidden"
        >
          {/* Stack of visual cards — one per section, revealed based on active/hover */}
          <div ref={visualsRef} className="absolute inset-0">
            {items.map((item, i) => (
              <div
                key={item.id}
                data-testid={`fullscreen-menu-visual-${item.id}`}
                className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  i === activeVisualIndex
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-110"
                }`}
                aria-hidden={i !== activeVisualIndex}
              >
                {/* Gradient background per section */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                />

                {/* Noise texture overlay */}
                <div
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16,185,129,0.2) 0%, transparent 50%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                  aria-hidden="true"
                />

                {/* Big label */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-8 lg:p-12">
                  <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent-light)] mb-3">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </p>
                  <h3 className="font-heading text-6xl lg:text-8xl font-bold text-[var(--color-text-primary)] leading-none mb-4 tracking-tight">
                    {item.visualLabel}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] font-mono max-w-xs">
                    {item.caption}
                  </p>
                </div>

                {/* Accent corner marker */}
                <div className="absolute top-8 right-8 flex items-center gap-2 text-[var(--color-accent)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Live
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical text label */}
          <div className="hidden lg:flex absolute top-0 bottom-0 left-8 items-center pointer-events-none">
            <p
              className="text-xs font-mono uppercase tracking-[0.4em] text-[var(--color-text-muted)] whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Pato Anabalon · {tHero("role")}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL — Navigation */}
        <div
          data-testid="fullscreen-menu-right-panel"
          ref={panelRightRef}
          className="relative flex-1 bg-[var(--color-bg-primary)] flex flex-col overflow-hidden"
        >
          {/* Top mini header inside panel — hidden on mobile to reclaim vertical space */}
          <div className="hidden sm:block px-6 sm:px-10 lg:px-16 pt-8 lg:pt-12 pb-2">
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
              {locale === "es" ? "Navegación" : "Navigation"} — {items.length}
            </p>
          </div>

          {/* Menu items */}
          <nav
            data-testid="fullscreen-menu-nav"
            ref={itemsRef}
            className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-4 sm:py-8 gap-0"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                data-menu-item
                className="border-t border-[var(--color-border)] last:border-b"
              >
                <MenuItem
                  index={i}
                  label={item.label}
                  href={item.href}
                  isActive={activeSection === item.id}
                  onHover={setHoveredIndex}
                  onClick={handleNavigate}
                />
              </div>
            ))}
          </nav>

          {/* Footer: social links + location */}
          <div
            data-testid="fullscreen-menu-footer"
            ref={footerRef}
            className="px-6 sm:px-10 lg:px-16 pb-10 pt-6 border-t border-[var(--color-border)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Location */}
              <div data-footer-item className="hidden sm:block">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                  {locale === "es" ? "Ubicación" : "Location"}
                </p>
                <p className="text-sm text-[var(--color-text-primary)]">
                  Santiago, Chile{" "}
                  <span className="text-[var(--color-accent)]">→</span>{" "}
                  Auckland, NZ
                </p>
              </div>

              {/* Resume */}
              <div data-footer-item>
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                  {locale === "es" ? "Currículum" : "Resume"}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <a
                    href={RESUME_PDF_PATH}
                    download
                    onClick={() => {
                      trackEvent("resume_download", {
                        format: "pdf",
                        source: "menu",
                      });
                      onClose();
                    }}
                    data-testid="menu-resume-pdf"
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <FaRegFilePdf aria-hidden="true" />
                    PDF
                  </a>
                  <span className="text-[var(--color-text-muted)]">·</span>
                  <a
                    href={RESUME_DOCX_PATH}
                    download
                    onClick={() => {
                      trackEvent("resume_download", {
                        format: "docx",
                        source: "menu",
                      });
                      onClose();
                    }}
                    data-testid="menu-resume-docx"
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <FaRegFileWord aria-hidden="true" />
                    DOCX
                  </a>
                </div>
              </div>

              {/* Social */}
              <div
                data-footer-item
                className="flex flex-col items-start sm:items-end gap-3"
              >
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                  {locale === "es" ? "Sígueme" : "Follow"}
                </p>
                <div className="flex items-center gap-2">
                  {socialLinks.map((link) => (
                    <SocialLink key={link.platform} link={link} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
