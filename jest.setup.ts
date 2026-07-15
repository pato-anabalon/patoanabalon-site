import '@testing-library/jest-dom';

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn(() => []);
    root = null;
    rootMargin = '';
    thresholds = [];
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  class MockResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  });
}

jest.mock('next/image', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ src, alt, fill, priority, unoptimized, ...rest }: Record<string, unknown>) => {
      void fill;
      void priority;
      void unoptimized;
      return React.createElement('img', { src, alt, ...rest });
    },
  };
});

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));
