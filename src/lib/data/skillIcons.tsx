import type { IconType } from 'react-icons'
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiSvelte,
  SiVuedotjs,
  SiTailwindcss,
  SiCss,
  SiStorybook,
  SiFigma,
  SiNodedotjs,
  SiPython,
  SiDotnet,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiGooglecloud,
  SiTerraform,
  SiVercel,
  SiClaude,
  SiCursor,
  SiGithub,
  SiJira,
  SiSonarqubeserver,
  SiWebdriverio,
  SiDavinciresolve,
} from 'react-icons/si'
import { FaAws, FaUniversalAccess, FaGlobe } from 'react-icons/fa'
import { FaCodeMerge } from 'react-icons/fa6'
import { BiLogoAdobe } from 'react-icons/bi'
import { TbApi, TbBrandOpenai } from 'react-icons/tb'
import { MdOutlineBackpack } from 'react-icons/md'

export type SkillIconConfig = {
  Icon: IconType
  color: string
}

/**
 * Maps a skill name (as declared in cv.ts) to its brand icon + color.
 * Icons that don't have a canonical brand mark fall back to a semantic
 * generic icon (accessibility, api, globe, etc.) so every row keeps a visual.
 */
export const skillIcons: Record<string, SkillIconConfig> = {
  // Frontend
  'Next.js':      { Icon: SiNextdotjs,      color: '#FFFFFF' },
  'React.js':     { Icon: SiReact,          color: '#61DAFB' },
  'TypeScript':   { Icon: SiTypescript,     color: '#3178C6' },
  'JavaScript':   { Icon: SiJavascript,     color: '#F7DF1E' },
  'Svelte':       { Icon: SiSvelte,         color: '#FF3E00' },
  'Vue':          { Icon: SiVuedotjs,       color: '#4FC08D' },
  'Tailwind CSS': { Icon: SiTailwindcss,    color: '#06B6D4' },
  'CSS':          { Icon: SiCss,            color: '#1572B6' },
  'Storybook':    { Icon: SiStorybook,      color: '#FF4785' },
  'Figma':        { Icon: SiFigma,          color: '#F24E1E' },
  'A11y':         { Icon: FaUniversalAccess,color: '#10B981' },
  'i18n':         { Icon: FaGlobe,          color: '#10B981' },

  // Backend
  'Node.js':      { Icon: SiNodedotjs,      color: '#5FA04E' },
  'Python':       { Icon: SiPython,         color: '#3776AB' },
  '.NET C#':      { Icon: SiDotnet,         color: '#512BD4' },
  'GraphQL':      { Icon: SiGraphql,        color: '#E10098' },
  'REST APIs':    { Icon: TbApi,            color: '#10B981' },
  'PostgreSQL':   { Icon: SiPostgresql,     color: '#4169E1' },
  'MongoDB':      { Icon: SiMongodb,        color: '#47A248' },

  // Cloud
  'AWS':          { Icon: FaAws,            color: '#FF9900' },
  'Google Cloud': { Icon: SiGooglecloud,    color: '#4285F4' },
  'Terraform':    { Icon: SiTerraform,      color: '#7B42BC' },
  'Vercel':       { Icon: SiVercel,         color: '#FFFFFF' },

  // AI
  'Claude':       { Icon: SiClaude,         color: '#D97757' },
  'Cursor':       { Icon: SiCursor,         color: '#FFFFFF' },
  'Codex':        { Icon: TbBrandOpenai,    color: '#10A37F' },

  // Tools
  'Git / GitHub':      { Icon: SiGithub,          color: '#FFFFFF' },
  'Jira / Confluence': { Icon: SiJira,            color: '#0052CC' },
  'CI/CD':             { Icon: FaCodeMerge,       color: '#10B981' },
  'SonarQube':         { Icon: SiSonarqubeserver, color: '#4E9BCD' },
  'WebdriverIO':       { Icon: SiWebdriverio,     color: '#EA5906' },
  'Scrum / Kanban':    { Icon: MdOutlineBackpack, color: '#10B981' },

  // Creative
  'After Effects':  { Icon: BiLogoAdobe,    color: '#D291FF' },
  'DaVinci Resolve':{ Icon: SiDavinciresolve, color: '#233A51' },
  'Adobe Premiere': { Icon: BiLogoAdobe,    color: '#9999FF' },
  'Photoshop':      { Icon: BiLogoAdobe,    color: '#31A8FF' },
}
