'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { MenuIcon, Icon } from '@/components/atoms'
import { FullscreenMenu } from './FullscreenMenu'
import { useActiveSection } from '@/hooks/useActiveSection'
import { gsap } from '@/lib/animations/gsap'

const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'creative', 'offscreen', 'contact']

export function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)
  const activeSection = useActiveSection(SECTION_IDS)

  useEffect(() => {
    // Pin releases at scroll 100vh, About top hits viewport top at ~200vh.
    // 1.5vh drops the navbar mid-exit (About is ~50% up the viewport).
    const revealAt = () => window.innerHeight * 1.5

    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setPastHero(y > revealAt())
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!logoRef.current) return
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
    )
  }, [])

  // Navbar is visible when we're past the hero pin OR the fullscreen menu is open.
  const navbarVisible = pastHero || menuOpen

  const switchLocale = (target: 'en' | 'es') => {
    if (target === locale) return
    const newPath = pathname.replace(`/${locale}`, `/${target}`)
    router.push(newPath)
  }

  const LOCALES = ['en', 'es'] as const

  return (
    <>
      <header
        data-testid="navbar"
        data-visible={navbarVisible}
        className={`fixed top-0 left-0 right-0 z-50 transition-[transform,opacity,padding,background-color] duration-500 ease-out ${
          navbarVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          menuOpen
            ? 'py-4 bg-transparent'
            : scrolled
              ? 'py-4 bg-[rgba(15,23,42,0.85)] backdrop-blur-md border-b border-[var(--color-border)]'
              : 'py-6 bg-transparent'
        }`}
      >
        <nav className="w-full px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">
          {/* Logo */}
          <div ref={logoRef} className="opacity-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              data-testid="navbar-logo"
              className="relative group flex items-center gap-3"
              aria-label="Pato Anabalon"
            >
              <div className="relative w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-bg-primary)] text-sm font-heading tracking-tight group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <span className="relative z-10">PA</span>
                {/* Shine effect on hover */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  aria-hidden="true"
                />
              </div>
              <span className="hidden md:flex flex-col leading-tight">
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Pato Anabalon</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
                  {locale === 'es' ? 'Ingeniero de Software' : 'Software Engineer'}
                </span>
              </span>
            </a>
          </div>

          {/* Right side: locale switcher + menu icon */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div
              data-testid="navbar-locale-switcher"
              role="group"
              aria-label="Switch language"
              className="flex items-center rounded-full border border-[var(--color-border)] pl-2.5 p-0.5 gap-1 text-xs font-mono"
            >
              <Icon
                name="globe"
                size={12}
                className="text-[var(--color-text-muted)]"
              />
              {LOCALES.map((lang) => {
                const isActive = locale === lang
                return (
                  <button
                    key={lang}
                    data-testid={`navbar-locale-${lang}`}
                    onClick={() => switchLocale(lang)}
                    disabled={isActive}
                    aria-current={isActive ? 'true' : undefined}
                    className={`px-3 py-1 rounded-full uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] cursor-default'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-accent)] cursor-pointer'
                    }`}
                  >
                    {lang}
                  </button>
                )
              })}
            </div>

            <MenuIcon
              isOpen={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              label={t('menuOpen')}
            />
          </div>
        </nav>
      </header>

      <FullscreenMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeSection={activeSection}
      />
    </>
  )
}
