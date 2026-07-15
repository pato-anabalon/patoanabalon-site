const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-intl|use-intl|@formatjs)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/**/icon.tsx',
    '!src/app/**/apple-icon.tsx',
    '!src/app/**/opengraph-image.tsx',
    '!src/app/**/twitter-image.tsx',
    '!src/app/manifest.ts',
    '!src/app/robots.ts',
    '!src/app/sitemap.ts',
    '!src/proxy.ts',
    '!src/types/**',
    '!src/i18n/**',
    '!src/lib/three/**',
    '!src/lib/animations/**',
    '!src/lib/data/**',
    '!src/components/atoms/VortexBackground.tsx',
    '!src/components/organisms/HeroSection.tsx',
    '!src/components/organisms/HeroSectionDesktop.tsx',
    '!src/components/organisms/HeroSectionMobile.tsx',
    '!src/components/organisms/ExperienceSection.tsx',
    '!src/components/organisms/SkillsSection.tsx',
    '!src/components/organisms/CreativeSection.tsx',
    '!src/components/organisms/OffScreenSection.tsx',
    '!src/components/organisms/AboutSection.tsx',
    '!src/components/templates/MainLayout.tsx',
    '!src/hooks/useLenis.ts',
    '!src/hooks/useGSAP.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 95,
      statements: 95,
    },
  },
};

module.exports = createJestConfig(config);
