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

export default function HomePage() {
  return (
    <MainLayout>
      <Navbar />
      <main>
        <HeroSection />
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
