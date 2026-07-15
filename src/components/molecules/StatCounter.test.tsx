import React from 'react';
import { render, screen } from '@testing-library/react';

const gsapTo = jest.fn((counter: { val: number }, options: { val: number; onUpdate: () => void }) => {
  counter.val = options.val;
  options.onUpdate();
  return {};
});

jest.mock('@/lib/animations/gsap', () => ({
  gsap: {
    to: (...args: unknown[]) => (gsapTo as unknown as (...args: unknown[]) => unknown)(...args),
  },
}));

import { StatCounter } from './StatCounter';

describe('StatCounter', () => {
  const defaultProps = {
    value: 18,
    label: 'Years',
  };

  const observers: Array<(entries: Array<{ isIntersecting: boolean }>) => void> = [];

  beforeEach(() => {
    observers.length = 0;
    gsapTo.mockClear();
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      jest.fn().mockImplementation((cb: (entries: Array<{ isIntersecting: boolean }>) => void) => {
        observers.push(cb);
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
          unobserve: jest.fn(),
        };
      });
  });

  const setup = (props = {}) =>
    render(<StatCounter {...defaultProps} {...props} />);

  it('should render the label', () => {
    setup();

    expect(screen.getByText('Years')).toBeInTheDocument();
  });

  it('should render zero before the intersection triggers', () => {
    setup();

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render the suffix when provided', () => {
    setup({ suffix: '+' });

    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should animate the counter when the container becomes visible', () => {
    setup();

    observers[0]([{ isIntersecting: true }]);

    expect(gsapTo).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ val: 18 })
    );
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('should not animate when the intersection reports no visibility', () => {
    setup();

    observers[0]([{ isIntersecting: false }]);

    expect(gsapTo).not.toHaveBeenCalled();
  });
});
