import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneCard } from './MilestoneCard';

describe('MilestoneCard', () => {
  const defaultProps = {
    slug: 'launched',
    big: '18+',
    year: '2025',
    text: 'Years shipping products',
    label: 'Milestone',
  };

  const setup = (props = {}) =>
    render(<MilestoneCard {...defaultProps} {...props} />);

  it('should render the big statement', () => {
    setup();

    expect(screen.getByText('18+')).toBeInTheDocument();
  });

  it('should render the year', () => {
    setup();

    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('should render the body text', () => {
    setup();

    expect(screen.getByText('Years shipping products')).toBeInTheDocument();
  });

  it('should render the corner label', () => {
    setup();

    expect(screen.getByText('Milestone')).toBeInTheDocument();
  });
});
