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
  SiBootstrap,
  SiStyledcomponents,
  SiMui,
  SiMaterialdesign,
  SiStorybook,
  SiFigma,
  SiNodedotjs,
  SiPython,
  SiDotnet,
  SiPhp,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiGooglecloud,
  SiTerraform,
  SiVercel,
  SiClaude,
  SiCursor,
  SiJest,
  SiTestinglibrary,
  SiCypress,
  SiWebdriverio,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiGithubactions,
  SiCircleci,
  SiJenkins,
  SiGrafana,
  SiDynatrace,
  SiLooker,
  SiSwagger,
  SiJira,
  SiTrello,
  SiSonarqubeserver,
  SiAutodesk,
  SiSketchup,
  SiDavinciresolve,
} from 'react-icons/si'
import {
  FaAws,
  FaUniversalAccess,
  FaGlobe,
  FaSalesforce,
  FaSlack,
  FaDatabase,
  FaServer,
  FaFlask,
} from 'react-icons/fa'
import { FaCodeBranch } from 'react-icons/fa6'
import { BiLogoAdobe } from 'react-icons/bi'
import { TbApi, TbBrandOpenai, TbChartHistogram } from 'react-icons/tb'
import { MdOutlineBackpack, MdOutlineMail, MdOutlineScience } from 'react-icons/md'

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
  'Next.js':           { Icon: SiNextdotjs,       color: '#FFFFFF' },
  'React.js':          { Icon: SiReact,           color: '#61DAFB' },
  'TypeScript':        { Icon: SiTypescript,      color: '#3178C6' },
  'JavaScript':        { Icon: SiJavascript,      color: '#F7DF1E' },
  'Svelte':            { Icon: SiSvelte,          color: '#FF3E00' },
  'Vue':               { Icon: SiVuedotjs,        color: '#4FC08D' },
  'Tailwind CSS':      { Icon: SiTailwindcss,     color: '#06B6D4' },
  'CSS':               { Icon: SiCss,             color: '#1572B6' },
  'Bootstrap':         { Icon: SiBootstrap,       color: '#7952B3' },
  'Styled Components': { Icon: SiStyledcomponents,color: '#DB7093' },
  'Material UI':       { Icon: SiMui,             color: '#007FFF' },
  'Material Design':   { Icon: SiMaterialdesign,  color: '#757575' },
  'Storybook':         { Icon: SiStorybook,       color: '#FF4785' },
  'Figma':             { Icon: SiFigma,           color: '#F24E1E' },
  'A11y':              { Icon: FaUniversalAccess, color: '#10B981' },
  'i18n':              { Icon: FaGlobe,           color: '#10B981' },

  // Backend
  'Node.js':      { Icon: SiNodedotjs,      color: '#5FA04E' },
  'Python':       { Icon: SiPython,         color: '#3776AB' },
  '.NET C#':      { Icon: SiDotnet,         color: '#512BD4' },
  'PHP':          { Icon: SiPhp,            color: '#777BB4' },
  'GraphQL':      { Icon: SiGraphql,        color: '#E10098' },
  'REST APIs':    { Icon: TbApi,            color: '#10B981' },
  'COM+':         { Icon: FaServer,         color: '#A78BFA' },

  // Database
  'PostgreSQL':           { Icon: SiPostgresql, color: '#4169E1' },
  'MongoDB':              { Icon: SiMongodb,    color: '#47A248' },
  'Microsoft SQL Server': { Icon: FaDatabase,   color: '#CC2927' },
  'MySQL':                { Icon: SiMysql,      color: '#4479A1' },

  // Cloud
  'AWS':          { Icon: FaAws,            color: '#FF9900' },
  'Google Cloud': { Icon: SiGooglecloud,    color: '#4285F4' },
  'Terraform':    { Icon: SiTerraform,      color: '#7B42BC' },
  'Vercel':       { Icon: SiVercel,         color: '#FFFFFF' },

  // AI
  'Claude':       { Icon: SiClaude,         color: '#D97757' },
  'Cursor':       { Icon: SiCursor,         color: '#FFFFFF' },
  'Codex':        { Icon: TbBrandOpenai,    color: '#10A37F' },

  // Testing
  'Jest':                  { Icon: SiJest,           color: '#C21325' },
  'React Testing Library': { Icon: SiTestinglibrary, color: '#E33332' },
  'Cypress':               { Icon: SiCypress,        color: '#69D3A7' },
  'Playwright':            { Icon: MdOutlineScience, color: '#2EAD33' },
  'WebdriverIO':           { Icon: SiWebdriverio,    color: '#EA5906' },

  // Tools
  'GitHub':            { Icon: SiGithub,          color: '#FFFFFF' },
  'GitLab':            { Icon: SiGitlab,          color: '#FC6D26' },
  'Bitbucket':         { Icon: SiBitbucket,       color: '#2684FF' },
  'TortoiseSVN':       { Icon: FaCodeBranch,      color: '#7A9EC2' },
  'GitHub Actions':    { Icon: SiGithubactions,   color: '#2088FF' },
  'CircleCI':          { Icon: SiCircleci,        color: '#FFFFFF' },
  'Jenkins':           { Icon: SiJenkins,         color: '#D24939' },
  'Heroku':            { Icon: FaServer,          color: '#430098' },
  'Grafana':           { Icon: SiGrafana,         color: '#F46800' },
  'Dynatrace':         { Icon: SiDynatrace,       color: '#1496FF' },
  'Looker Studio':     { Icon: SiLooker,          color: '#4285F4' },
  'Swagger':           { Icon: SiSwagger,         color: '#85EA2D' },
  'SendGrid':          { Icon: MdOutlineMail,     color: '#1A82E2' },
  'Slack API':         { Icon: FaSlack,           color: '#36C5F0' },
  'ABSmartly':         { Icon: TbChartHistogram,  color: '#10B981' },
  'Salesforce':        { Icon: FaSalesforce,      color: '#00A1E0' },
  'SonarQube':         { Icon: SiSonarqubeserver, color: '#4E9BCD' },
  'Jira / Confluence': { Icon: SiJira,            color: '#0052CC' },
  'Trello':            { Icon: SiTrello,          color: '#0079BF' },
  'Scrum / Kanban':    { Icon: MdOutlineBackpack, color: '#10B981' },
  'Lean':              { Icon: FaFlask,           color: '#10B981' },
  'AutoCAD':           { Icon: SiAutodesk,        color: '#E51937' },
  'SketchUp':          { Icon: SiSketchup,        color: '#005F9E' },

  // Creative
  'After Effects':  { Icon: BiLogoAdobe,      color: '#D291FF' },
  'DaVinci Resolve':{ Icon: SiDavinciresolve, color: '#FDB515' },
  'Adobe Premiere': { Icon: BiLogoAdobe,      color: '#9999FF' },
  'Photoshop':      { Icon: BiLogoAdobe,      color: '#31A8FF' },
}
