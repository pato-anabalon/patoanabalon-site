import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = jest.fn();

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/en',
}));

jest.mock('@/lib/animations/gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
  },
}));

jest.mock('@/hooks/useActiveSection', () => ({
  useActiveSection: () => 'hero',
}));

jest.mock('./FullscreenMenu', () => ({
  FullscreenMenu: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="fullscreen-menu-mock" data-open={isOpen} />
  ),
}));

import { Navbar } from './Navbar';

describe('Navbar', () => {
  const setup = () => render(<Navbar />);

  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollY = 0;
  });

  it('should render the logo link labelled with the name', () => {
    setup();

    expect(screen.getByRole('link', { name: /pato anabalon/i })).toBeInTheDocument();
  });

  it('should render the locale switcher with the current locale marked as active', () => {
    setup();

    const enButton = screen.getByRole('button', { name: 'en' });
    expect(enButton).toBeDisabled();
    expect(enButton).toHaveAttribute('aria-current', 'true');
  });

  it('should call router.push with the new locale path when switching language', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: 'es' }));

    expect(push).toHaveBeenCalledWith('/es');
  });

  it('should not push when the user clicks the already active locale', async () => {
    const user = userEvent.setup();
    setup();

    // The active button is disabled; force the click through instead
    const enButton = screen.getByRole('button', { name: 'en' });
    enButton.removeAttribute('disabled');
    await user.click(enButton);

    expect(push).not.toHaveBeenCalled();
  });

  it('should toggle the fullscreen menu when the menu icon is clicked', async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByTestId('fullscreen-menu-mock')).toHaveAttribute(
      'data-open',
      'false'
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    expect(screen.getByTestId('fullscreen-menu-mock')).toHaveAttribute(
      'data-open',
      'true'
    );
  });

  it('should reveal the navbar when the user scrolls past the hero pin', () => {
    setup();

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 2000,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
  });

  it('should scroll to the top when the logo is clicked', async () => {
    const scrollTo = jest.fn();
    window.scrollTo = scrollTo;
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('navbar-logo'));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should apply the mobile reveal threshold when the media query matches', () => {
    (window.matchMedia as unknown as jest.Mock) = jest.fn().mockReturnValue({
      matches: true,
      media: '(max-width: 767px)',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    setup();

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 600,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('navbar')).toHaveAttribute('data-visible', 'true');
  });

  it('should keep the navbar hidden while still inside the hero pin', () => {
    setup();

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 100,
    });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('navbar')).toHaveAttribute('data-visible', 'false');
  });
});
