import { trackEvent } from '@/lib/analytics';

jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
}));

import { track as vercelTrack } from '@vercel/analytics';

describe('trackEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it('should forward the event to Vercel Analytics', () => {
    trackEvent('cta_click', { section: 'hero' });

    expect(vercelTrack).toHaveBeenCalledWith('cta_click', { section: 'hero' });
  });

  it('should call gtag when defined on window', () => {
    const gtag = jest.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;

    trackEvent('cta_click', { section: 'hero' });

    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', { section: 'hero' });
  });

  it('should not throw when gtag is not defined', () => {
    expect(() => trackEvent('cta_click')).not.toThrow();
  });

  it('should forward undefined properties to Vercel Analytics', () => {
    trackEvent('cta_click');

    expect(vercelTrack).toHaveBeenCalledWith('cta_click', undefined);
  });
});
