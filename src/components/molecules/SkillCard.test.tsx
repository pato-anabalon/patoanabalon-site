import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkillCard } from './SkillCard';
import type { Skill } from '@/types';

describe('SkillCard', () => {
  const skills: Skill[] = [
    { name: 'React', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
  ];

  const defaultProps = {
    category: 'Frontend',
    skills,
  };

  const setup = (props = {}) =>
    render(<SkillCard {...defaultProps} {...props} />);

  it('should render the category name as a heading', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument();
  });

  it('should render one tag per skill', () => {
    setup();

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render an empty tag list when no skills are provided', () => {
    setup({ skills: [] });

    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('should apply the extra className to the container', () => {
    const { getByTestId } = setup({ className: 'extra' });

    expect(getByTestId('molecule-skill-card')).toHaveClass('extra');
  });
});
