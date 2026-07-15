import React from 'react';
import { render } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  const setup = (props: React.ComponentProps<typeof Icon>) =>
    render(<Icon {...props} />);

  it('should render the requested icon by name', () => {
    const { container } = setup({ name: 'github' });

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should use the default size when none is provided', () => {
    const { container } = setup({ name: 'linkedin' });
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('should apply the custom size when provided', () => {
    const { container } = setup({ name: 'menu', size: 32 });
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('should merge the custom className', () => {
    const { container } = setup({ name: 'close', className: 'custom-icon' });

    expect(container.querySelector('svg')).toHaveClass('custom-icon');
  });

  it('should be hidden from assistive technologies', () => {
    const { container } = setup({ name: 'mail' });

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    'linkedin',
    'github',
    'instagram',
    'twitter',
    'whatsapp',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'menu',
    'close',
    'external-link',
    'mail',
    'globe',
    'shuffle',
  ] as const)('should render the %s icon variant', (name) => {
    const { container } = setup({ name });

    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
