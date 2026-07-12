import type { Experience, Skill, Award } from "@/types";

export const companyLogos: Record<string, string> = {
  latam: "/images/company-logo/latam-airlines-logo.svg",
  globant: "/images/company-logo/globant-logo.svg",
  amicar: "/images/company-logo/amicar-logo.svg",
  mink: "/images/company-logo/mink-logo.png",
  indexa: "/images/company-logo/indexa-logo.png",
};

export const companyLogosSmall: Record<string, string> = {
  latam: "/images/company-logo/latam-airlines-logo-small.png",
  globant: "/images/company-logo/globant-logo-small.png",
  amicar: "/images/company-logo/amicar-logo-small.png",
  mink: "/images/company-logo/mink-logo-small.png",
  indexa: "/images/company-logo/indexa-logo-small.png",
};

export const experiences: Experience[] = [
  {
    id: "latam",
    company: "LATAM Airlines",
    role: "Senior Front End Developer",
    period: "Mar 2024 – Present",
    description: [
      "Developed and maintained flight, fare and seat selection workflows across LATAM's e-commerce platforms.",
      "Designed and executed production experiments using ABSmartly, improving purchase conversion.",
      "Mentored peers, contributed to code reviews, and automated internal processes and reporting.",
    ],
    tech: ["react", "typescript", "next", "storybook", "jest"],
  },
  {
    id: "globant",
    company: "Globant",
    role: "Senior Software Engineer",
    period: "Feb 2021 – Feb 2024",
    description: [
      "Designed and implemented responsive web solutions using Svelte framework.",
      "Delivered performance-focused UI components reducing load times and improving UX.",
      "Built sales and ancillary services modules using React.js, Next.js, Jest, RTL, Storybook and WebdriverIO.",
    ],
    tech: ["svelte", "react", "next", "storybook", "webdriverio"],
  },
  {
    id: "amicar",
    company: "Amicar S.A.",
    role: "Software Development Manager",
    period: "Apr 2019 – Dec 2020",
    description: [
      "Led digital transformation overseeing frontend, backend, and Salesforce teams via Scrum.",
      "Designed and implemented highly scalable cloud architecture on AWS.",
      "Drove alignment between business stakeholders and technical teams during platform digitalisation.",
    ],
    tech: ["react", "typescript", "node", "terraform", "jira"],
  },
  {
    id: "mink",
    company: "Mink Startup",
    role: "Co-Founder & CTO",
    period: "Sep 2018 – Dec 2020",
    description: [
      "Co-founded and led the technical strategy of a proptech startup focused on real estate investment.",
      'Developed the "Webi" real estate investment platform as full-stack developer.',
      "Represented the startup in Start-Up Chile G19 acceleration programme.",
    ],
    tech: ["node", "react", "mongodb", "javascript"],
  },
  {
    id: "indexa",
    company: "Indexa S.A.",
    role: "Developer Analyst & Technical Leader",
    period: "Mar 2007 – Dec 2017",
    description: [
      "Led the development and technical direction of an automotive loan platform for Scotiabank, Bice Bank, and Amicar.",
      "Acted as Technical Lead guiding architectural decisions and mentoring junior developers.",
      "Designed, developed, and maintained automotive credit management systems over 10 years.",
    ],
    tech: ["dotnet", "php", "mysql", "jquery"],
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "Next.js", category: "frontend" },
  { name: "React.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "Svelte", category: "frontend" },
  { name: "Vue", category: "frontend" },
  // Design
  { name: "CSS", category: "design" },
  { name: "Tailwind CSS", category: "design" },
  { name: "Bootstrap", category: "design" },
  { name: "Styled Components", category: "design" },
  { name: "Material UI", category: "design" },
  { name: "Material Design", category: "design" },
  { name: "Storybook", category: "design" },
  { name: "Figma", category: "design" },
  { name: "A11y", category: "design" },
  { name: "i18n", category: "design" },
  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Python", category: "backend" },
  { name: ".NET C#", category: "backend" },
  { name: "PHP", category: "backend" },
  { name: "GraphQL", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "COM+", category: "backend" },
  // Database
  { name: "PostgreSQL", category: "database" },
  { name: "MongoDB", category: "database" },
  { name: "Microsoft SQL Server", category: "database" },
  { name: "MySQL", category: "database" },
  // Cloud
  { name: "AWS", category: "cloud" },
  { name: "Google Cloud", category: "cloud" },
  { name: "Terraform", category: "cloud" },
  { name: "Vercel", category: "cloud" },
  // AI
  { name: "Claude", category: "ai" },
  { name: "Cursor", category: "ai" },
  { name: "Codex", category: "ai" },
  // Testing
  { name: "Jest", category: "testing" },
  { name: "React Testing Library", category: "testing" },
  { name: "Cypress", category: "testing" },
  { name: "Playwright", category: "testing" },
  { name: "WebdriverIO", category: "testing" },
  // DevOps
  { name: "GitHub", category: "devops" },
  { name: "GitLab", category: "devops" },
  { name: "Bitbucket", category: "devops" },
  { name: "TortoiseSVN", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "CircleCI", category: "devops" },
  { name: "Jenkins", category: "devops" },
  { name: "Heroku", category: "devops" },
  // Observability
  { name: "Grafana", category: "observability" },
  { name: "Dynatrace", category: "observability" },
  { name: "Looker Studio", category: "observability" },
  { name: "Swagger", category: "observability" },
  { name: "SendGrid", category: "observability" },
  { name: "Slack API", category: "observability" },
  { name: "ABSmartly", category: "observability" },
  // Tools
  { name: "SonarQube", category: "tools" },
  { name: "Jira / Confluence", category: "tools" },
  { name: "Trello", category: "tools" },
  { name: "Scrum / Kanban", category: "tools" },
  { name: "Lean", category: "tools" },
  { name: "Salesforce", category: "tools" },
  // Creative
  { name: "After Effects", category: "creative" },
  { name: "DaVinci Resolve", category: "creative" },
  { name: "Adobe Premiere", category: "creative" },
  { name: "Photoshop", category: "creative" },
  { name: "AutoCAD", category: "creative" },
  { name: "SketchUp", category: "creative" },
];

export const awards: Award[] = [
  {
    title: "LATAM Service Leader",
    company: "LATAM Airlines",
    year: "2025",
    description:
      "Recognised for contribution aligned with Safety, Sustainability and J.E.T.S. values.",
  },
  {
    title: "Constantly Innovate",
    company: "Globant",
    year: "2022",
    description:
      "Annual award for the person most valued for delivering constant innovation across the company.",
  },
];

export const personalInfo = {
  name: "Patricio Anabalon",
  location: "Santiago, Chile",
  targetLocation: "Auckland, New Zealand",
  email: "pato.anabalon@gmail.com",
  phone: "+56 9 3431 0926",
  yearsOfExperience: 18,
};
