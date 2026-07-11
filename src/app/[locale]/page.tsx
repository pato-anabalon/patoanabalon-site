import { headers } from 'next/headers'
import { MainLayout } from '@/components/templates'
import {
  Navbar,
  HeroSection,
  AboutSection,
  ExperienceSection,
  SkillsSection,
  CreativeSection,
  OffScreenSection,
  ContactSection,
} from '@/components/organisms'

// Rough UA sniff — good enough to pick the initial hero variant server-side
// so SSR and hydration render the same tree (no post-hydrate swap → no
// removeChild NotFoundError from GSAP-mutated DOM being unmounted).
// Client-side matchMedia still takes over after mount for responsive changes.
function detectMobile(userAgent: string): boolean {
  return /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  )
}

export default async function HomePage() {
  const ua = (await headers()).get('user-agent') ?? ''
  const initialIsMobile = detectMobile(ua)

  return (
    <MainLayout>
      <Navbar />
      <main>
        <HeroSection initialIsMobile={initialIsMobile} />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <CreativeSection />
        <OffScreenSection />
        <ContactSection />
      </main>
    </MainLayout>
  )
}
