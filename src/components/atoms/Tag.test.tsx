import React from 'react';
import { render, screen } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
  const defaultProps = {
    children: 'React',
  };

  const setup = (props = {}) => render(<Tag {...defaultProps} {...props} />);

  it('should render children as the tag content', () => {
    setup();

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render with the muted variant by default', () => {
    setup();

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render with the accent variant', () => {
    setup({ variant: 'accent' });

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render with the outline variant', () => {
    setup({ variant: 'outline' });

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should apply extra className when provided', () => {
    setup({ className: 'extra-class' });

    expect(screen.getByText('React')).toHaveClass('extra-class');
  });
});
