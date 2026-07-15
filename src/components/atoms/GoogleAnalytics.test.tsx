import React from 'react';
import { render } from '@testing-library/react';

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ children, ...props }: { children?: React.ReactNode }) => (
    <script data-testid="next-script" {...props}>
      {children}
    </script>
  ),
}));

describe('GoogleAnalytics', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should render nothing when the measurement id env var is missing', async () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const { GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should render both scripts when the measurement id is set', async () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST';
    const { GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);

    const scripts = container.querySelectorAll('script');
    expect(scripts).toHaveLength(2);
    expect(scripts[0]).toHaveAttribute(
      'src',
      'https://www.googletagmanager.com/gtag/js?id=G-TEST'
    );
    expect(scripts[1]?.textContent).toContain("gtag('config', 'G-TEST')");
  });
});
