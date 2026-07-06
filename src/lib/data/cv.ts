import type { Experience, Skill, Award } from '@/types'

export const companyLogos: Record<string, string> = {
  latam: '/images/company-logo/latam-airlines-logo.svg',
  globant: '/images/company-logo/globant-logo.svg',
  amicar: '/images/company-logo/amicar-logo.svg',
  mink: '/images/company-logo/mink-logo.png',
  indexa: '/images/company-logo/indexa-logo.png',
}

export const experiences: Experience[] = [
  {
    id: 'latam',
    company: 'LATAM Airlines',
    role: 'Senior Front End Developer',
    period: 'Mar 2024 – Present',
    description: [
      'Developed and maintained flight, fare and seat selection workflows across LATAM\'s e-commerce platforms.',
      'Designed and executed production experiments using ABSmartly, improving purchase conversion.',
      'Mentored peers, contributed to code reviews, and automated internal processes and reporting.',
    ],
  },
  {
    id: 'globant',
    company: 'Globant',
    role: 'Senior Software Engineer',
    period: 'Feb 2021 – Feb 2024',
    description: [
      'Designed and implemented responsive web solutions using Svelte framework.',
      'Delivered performance-focused UI components reducing load times and improving UX.',
      'Built sales and ancillary services modules using React.js, Next.js, Jest, RTL, Storybook and WebdriverIO.',
    ],
  },
  {
    id: 'amicar',
    company: 'Amicar S.A.',
    role: 'Software Development Manager',
    period: 'Apr 2019 – Dec 2020',
    description: [
      'Led digital transformation overseeing frontend, backend, and Salesforce teams via Scrum.',
      'Designed and implemented highly scalable cloud architecture on AWS.',
      'Drove alignment between business stakeholders and technical teams during platform digitalisation.',
    ],
  },
  {
    id: 'mink',
    company: 'Mink Startup',
    role: 'Co-Founder & CTO',
    period: 'Sep 2018 – Dec 2020',
    description: [
      'Co-founded and led the technical strategy of a proptech startup focused on real estate investment.',
      'Developed the "Webi" real estate investment platform as full-stack developer.',
      'Represented the startup in Start-Up Chile G19 acceleration programme.',
    ],
  },
  {
    id: 'indexa',
    company: 'Indexa S.A.',
    role: 'Developer Analyst & Technical Leader',
    period: 'Mar 2007 – Dec 2017',
    description: [
      'Led the development and technical direction of an automotive loan platform for Scotiabank, Bice Bank, and Amicar.',
      'Acted as Technical Lead guiding architectural decisions and mentoring junior developers.',
      'Designed, developed, and maintained automotive credit management systems over 10 years.',
    ],
  },
]

export const skills: Skill[] = [
  // Frontend
  { name: 'Next.js', category: 'frontend' },
  { name: 'React.js', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'Svelte', category: 'frontend' },
  { name: 'Vue', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'CSS', category: 'frontend' },
  { name: 'Storybook', category: 'frontend' },
  { name: 'Figma', category: 'frontend' },
  { name: 'A11y', category: 'frontend' },
  { name: 'i18n', category: 'frontend' },
  // Backend
  { name: 'Node.js', category: 'backend' },
  { name: 'Python', category: 'backend' },
  { name: '.NET C#', category: 'backend' },
  { name: 'GraphQL', category: 'backend' },
  { name: 'REST APIs', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'MongoDB', category: 'backend' },
  // Cloud
  { name: 'AWS', category: 'cloud' },
  { name: 'Google Cloud', category: 'cloud' },
  { name: 'Terraform', category: 'cloud' },
  { name: 'Vercel', category: 'cloud' },
  // AI
  { name: 'Claude', category: 'ai' },
  { name: 'Cursor', category: 'ai' },
  { name: 'Codex', category: 'ai' },
  // Tools
  { name: 'Git / GitHub', category: 'tools' },
  { name: 'Jira / Confluence', category: 'tools' },
  { name: 'CI/CD', category: 'tools' },
  { name: 'SonarQube', category: 'tools' },
  { name: 'WebdriverIO', category: 'tools' },
  { name: 'Scrum / Kanban', category: 'tools' },
  // Creative
  { name: 'After Effects', category: 'creative' },
  { name: 'DaVinci Resolve', category: 'creative' },
  { name: 'Adobe Premiere', category: 'creative' },
  { name: 'Photoshop', category: 'creative' },
]

export const awards: Award[] = [
  {
    title: 'LATAM Service Leader',
    company: 'LATAM Airlines',
    year: '2025',
    description: 'Recognised for contribution aligned with Safety, Sustainability and J.E.T.S. values.',
  },
  {
    title: 'Constantly Innovate',
    company: 'Globant',
    year: '2022',
    description: 'Annual award for the person most valued for delivering constant innovation across the company.',
  },
]

export const personalInfo = {
  name: 'Patricio Anabalon',
  location: 'Santiago, Chile',
  targetLocation: 'Auckland, New Zealand',
  email: 'pato.anabalon@gmail.com',
  phone: '+56 9 3431 0926',
  yearsOfExperience: 18,
}
