import React from 'react';
import { render, screen } from '@testing-library/react';
import { CompanyCard } from './CompanyCard';
import type { Experience } from '@/types';

describe('CompanyCard', () => {
  const experience: Experience = {
    id: 'latam',
    company: 'LATAM Airlines',
    role: 'Senior Front End Developer',
    period: 'Mar 2024 – Present',
    description: ['Delivered flight workflows', 'Ran A/B experiments'],
    tech: ['react', 'typescript'],
  };

  const defaultProps = {
    experience,
    logoSrc: '/logo.svg',
    logoSmallSrc: '/logo-small.png',
    nowLabel: 'Now',
  };

  const setup = (props = {}) =>
    render(<CompanyCard {...defaultProps} {...props} />);

  it('should render the company name as a heading', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'LATAM Airlines' })
    ).toBeInTheDocument();
  });

  it('should render the role and period', () => {
    setup();

    expect(screen.getByText('Senior Front End Developer')).toBeInTheDocument();
    expect(screen.getByText('Mar 2024 – Present')).toBeInTheDocument();
  });

  it('should render every description entry', () => {
    setup();

    expect(screen.getByText('Delivered flight workflows')).toBeInTheDocument();
    expect(screen.getByText('Ran A/B experiments')).toBeInTheDocument();
  });

  it('should render the present badge when isPresent is true', () => {
    setup({ isPresent: true });

    expect(screen.getByText('Now')).toBeInTheDocument();
  });

  it('should not render the present badge when isPresent is false', () => {
    setup({ isPresent: false });

    expect(screen.queryByText('Now')).not.toBeInTheDocument();
  });

  it('should render a tech icon for known slugs', () => {
    setup();

    expect(screen.getByLabelText('React')).toBeInTheDocument();
    expect(screen.getByLabelText('TypeScript')).toBeInTheDocument();
  });

  it('should ignore tech slugs that are not registered', () => {
    setup({
      experience: { ...experience, tech: ['unknown-slug', 'react'] },
    });

    expect(screen.getByLabelText('React')).toBeInTheDocument();
    expect(screen.queryByLabelText('unknown-slug')).not.toBeInTheDocument();
  });

  it('should hide the tech row when the experience has no tech list', () => {
    setup({
      experience: { ...experience, tech: undefined },
    });

    expect(screen.queryByLabelText('React')).not.toBeInTheDocument();
  });

  it('should render both watermark logos referencing logoSmallSrc', () => {
    const { container } = setup();

    const images = Array.from(container.querySelectorAll('img'));
    expect(images.length).toBeGreaterThanOrEqual(2);
    images.forEach((img) => {
      expect(img).toHaveAttribute('src', '/logo-small.png');
    });
  });
});
