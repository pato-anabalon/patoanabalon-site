import React from 'react';
import { render, screen } from '@testing-library/react';
import { SocialLink } from './SocialLink';
import type { SocialLink as SocialLinkType } from '@/types';

describe('SocialLink', () => {
  const link: SocialLinkType = {
    platform: 'github',
    url: 'https://github.com/pato-anabalon',
    handle: 'pato-anabalon',
  };

  const defaultProps = { link };

  const setup = (props = {}) =>
    render(<SocialLink {...defaultProps} {...props} />);

  it('should render an accessible link labelled with the platform and handle', () => {
    setup();

    expect(
      screen.getByRole('link', { name: /github — pato-anabalon/i })
    ).toBeInTheDocument();
  });

  it('should point the anchor href to the provided url', () => {
    setup();

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/pato-anabalon'
    );
  });

  it('should open in a new tab with safe rel attributes', () => {
    setup();
    const anchor = screen.getByRole('link');

    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should hide the handle by default', () => {
    setup();

    expect(screen.queryByText('pato-anabalon')).not.toBeInTheDocument();
  });

  it('should show the handle when showHandle is true', () => {
    setup({ showHandle: true });

    expect(screen.getByText('pato-anabalon')).toBeInTheDocument();
  });

  it('should merge the custom className', () => {
    setup({ className: 'custom' });

    expect(screen.getByRole('link')).toHaveClass('custom');
  });

  it.each(['sm', 'md', 'lg'] as const)(
    'should render with the %s size',
    (size) => {
      setup({ size });

      expect(screen.getByRole('link')).toBeInTheDocument();
    }
  );
});
