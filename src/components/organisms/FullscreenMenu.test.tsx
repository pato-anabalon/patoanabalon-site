import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let currentLocale = 'en';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => currentLocale,
}));

jest.mock('@/lib/animations/gsap', () => ({
  gsap: {
    fromTo: jest.fn(),
    set: jest.fn(),
    to: jest.fn(),
  },
}));

jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));

import { FullscreenMenu } from './FullscreenMenu';
import { trackEvent } from '@/lib/analytics';

describe('FullscreenMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    activeSection: 'about',
  };

  const setup = (props = {}) =>
    render(<FullscreenMenu {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    defaultProps.onClose = jest.fn();
    currentLocale = 'en';
  });

  it('should render the menu as a modal dialog', () => {
    setup();

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('should render one nav entry per section', () => {
    setup();

    // 6 menu sections
    expect(screen.getByTestId('molecule-menu-item-about')).toBeInTheDocument();
    expect(screen.getByTestId('molecule-menu-item-experience')).toBeInTheDocument();
    expect(screen.getByTestId('molecule-menu-item-skills')).toBeInTheDocument();
    expect(screen.getByTestId('molecule-menu-item-creative')).toBeInTheDocument();
    expect(screen.getByTestId('molecule-menu-item-offscreen')).toBeInTheDocument();
    expect(screen.getByTestId('molecule-menu-item-contact')).toBeInTheDocument();
  });

  it('should call onClose when the user clicks a menu link', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    setup({ onClose });

    await user.click(screen.getByTestId('molecule-menu-item-about'));

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when the user presses Escape while the menu is open', () => {
    const onClose = jest.fn();
    setup({ onClose });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should not react to Escape when the menu is closed', () => {
    const onClose = jest.fn();
    setup({ isOpen: false, onClose });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should track resume downloads from the menu footer PDF link', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('menu-resume-pdf'));

    expect(trackEvent).toHaveBeenCalledWith('resume_download', {
      format: 'pdf',
      source: 'menu',
    });
  });

  it('should track resume downloads from the menu footer DOCX link', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('menu-resume-docx'));

    expect(trackEvent).toHaveBeenCalledWith('resume_download', {
      format: 'docx',
      source: 'menu',
    });
  });

  it('should highlight the visual matching the activeSection when nothing is hovered', () => {
    setup({ activeSection: 'contact' });

    expect(
      screen.getByTestId('fullscreen-menu-visual-contact')
    ).toHaveAttribute('aria-hidden', 'false');
  });

  it('should fall back to the first visual when the activeSection is unknown', () => {
    setup({ activeSection: 'ghost' });

    expect(
      screen.getByTestId('fullscreen-menu-visual-about')
    ).toHaveAttribute('aria-hidden', 'false');
  });

  it('should render Spanish copy when the locale is es', () => {
    currentLocale = 'es';
    setup();

    expect(screen.getByText('Ubicación')).toBeInTheDocument();
    expect(screen.getByText('Currículum')).toBeInTheDocument();
  });

  it('should mark the dialog as hidden when the menu is closed', () => {
    setup({ isOpen: false });

    expect(screen.getByTestId('fullscreen-menu')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });
});
