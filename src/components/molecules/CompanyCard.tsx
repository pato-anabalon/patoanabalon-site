import React from 'react';
import Image from 'next/image';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiSvelte,
  SiStorybook,
  SiJest,
  SiWebdriverio,
  SiNodedotjs,
  SiTerraform,
  SiJira,
  SiMongodb,
  SiJavascript,
  SiDotnet,
  SiPhp,
  SiMysql,
  SiJquery,
  SiCursor,
  SiGrafana,
  SiGooglecloud,
  SiSwagger,
  SiMui,
  SiGithub,
  SiCircleci,
  SiCss,
} from 'react-icons/si';
import {
  FaAws,
  FaUniversalAccess,
  FaGlobe,
  FaDatabase,
  FaServer,
} from 'react-icons/fa';
import { FaCodeBranch } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { Experience } from '@/types';

interface CompanyCardProps {
  experience: Experience;
  logoSrc: string;
  logoSmallSrc: string;
  isPresent?: boolean;
  nowLabel: string;
}

const TECH_ICONS: Record<string, IconType> = {
  react: SiReact,
  typescript: SiTypescript,
  next: SiNextdotjs,
  svelte: SiSvelte,
  storybook: SiStorybook,
  jest: SiJest,
  webdriverio: SiWebdriverio,
  node: SiNodedotjs,
  terraform: SiTerraform,
  jira: SiJira,
  mongodb: SiMongodb,
  javascript: SiJavascript,
  dotnet: SiDotnet,
  php: SiPhp,
  mysql: SiMysql,
  jquery: SiJquery,
  cursor: SiCursor,
  grafana: SiGrafana,
  googlecloud: SiGooglecloud,
  swagger: SiSwagger,
  mui: SiMui,
  github: SiGithub,
  circleci: SiCircleci,
  css: SiCss,
  aws: FaAws,
  i18n: FaGlobe,
  mssql: FaDatabase,
  complus: FaServer,
  a11y: FaUniversalAccess,
  tortoise: FaCodeBranch,
};

const TECH_LABELS: Record<string, string> = {
  react: 'React',
  typescript: 'TypeScript',
  next: 'Next.js',
  svelte: 'Svelte',
  storybook: 'Storybook',
  jest: 'Jest',
  webdriverio: 'WebdriverIO',
  node: 'Node.js',
  terraform: 'Terraform',
  jira: 'Jira',
  mongodb: 'MongoDB',
  javascript: 'JavaScript',
  dotnet: '.NET',
  php: 'PHP',
  mysql: 'MySQL',
  jquery: 'jQuery',
  cursor: 'Cursor',
  grafana: 'Grafana',
  googlecloud: 'Google Cloud',
  swagger: 'Swagger',
  mui: 'Material UI',
  github: 'GitHub',
  circleci: 'CircleCI',
  i18n: 'i18n',
  css: 'CSS',
  aws: 'AWS',
  mssql: 'Microsoft SQL',
  a11y: 'A11y',
  complus: 'COM+',
  tortoise: 'TortoiseSVN',
};

function TechIcon({ slug }: { slug: string }) {
  const Icon = TECH_ICONS[slug];
  if (!Icon) return null;
  const label = TECH_LABELS[slug] ?? slug;
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
      title={label}
      aria-label={label}
    >
      <Icon size={18} />
    </span>
  );
}

export function CompanyCard({ experience, logoSrc, logoSmallSrc, isPresent, nowLabel }: CompanyCardProps) {
  const hasTech = experience.tech && experience.tech.length > 0;

  return (
    <article
      data-testid={`molecule-company-card-${experience.id}`}
      className="relative flex-shrink-0 w-[320px] sm:w-[420px] h-[476px] sm:h-[520px] rounded-3xl border border-[rgba(16,185,129,0.12)] bg-[var(--color-bg-secondary)] p-6 sm:p-8 flex flex-col shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* Mobile watermark — small logo variant */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-6 h-[100px] w-[260px] sm:hidden opacity-50"
        style={{ mixBlendMode: 'luminosity' }}
      >
        <Image
          src={logoSmallSrc}
          alt=""
          fill
          sizes="260px"
          className="object-contain object-right"
        />
      </div>

      {/* Desktop watermark — small logo variant */}
      <div
        aria-hidden="true"
        data-testid={`company-card-logo-${experience.id}`}
        className="pointer-events-none hidden sm:block absolute right-4 bottom-8 h-[140px] w-[130px] opacity-50"
        style={{ mixBlendMode: 'luminosity' }}
      >
        <Image
          src={logoSmallSrc}
          alt=""
          fill
          sizes="130px"
          className="object-contain object-right"
        />
      </div>

      {/* Present badge (LATAM only) */}
      {isPresent && (
        <span className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent)] bg-[rgba(16,185,129,0.1)] px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          {nowLabel}
        </span>
      )}

      {/* Content — above watermark + gradient */}
      <div className="relative flex flex-col flex-1 min-h-0 min-w-0 w-full">
        {/* Period */}
        <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent)] mb-2 sm:mb-3">
          {experience.period}
        </p>

        {/* Company */}
        <h3 className="text-2xl font-heading font-bold text-[var(--color-text-primary)] leading-tight">
          {experience.company}
        </h3>

        {/* Role */}
        <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4 sm:mb-6">
          {experience.role}
        </p>

        {/* Divider */}
        <div className="h-px w-12 bg-[var(--color-accent)] mb-4 sm:mb-6" />

        {/* Achievements */}
        <ul className="space-y-2.5 sm:space-y-3 overflow-hidden">
          {experience.description.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[12px] sm:text-[13px] leading-relaxed text-[var(--color-text-muted)]"
            >
              <span className="mt-1.5 h-1 w-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              <span className="flex-1 min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>

        {/* Tech icons — bottom left */}
        {hasTech && (
          <div className="mt-auto pt-4 flex items-center gap-2.5 sm:gap-3 justify-start">
            {experience.tech!.map((slug) => (
              <TechIcon key={slug} slug={slug} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
