import React from 'react';
import { render, screen } from '@testing-library/react';
import { TileSkeleton } from './TileSkeleton';

describe('TileSkeleton', () => {
  const defaultProps = {
    index: 0,
    label: 'Photo tile',
  };

  const setup = (props = {}) =>
    render(<TileSkeleton {...defaultProps} {...props} />);

  it('should render the tile label', () => {
    setup();

    expect(screen.getByText(/Photo tile/i)).toBeInTheDocument();
  });

  it('should format the index as a two-digit badge', () => {
    setup({ index: 2 });

    expect(screen.getByText(/03 · Photo/)).toBeInTheDocument();
  });

  it('should not render an image when no imageSrc is provided', () => {
    setup();

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render an image when imageSrc is provided', () => {
    setup({ imageSrc: '/photo.jpg', imageAlt: 'Landscape photo' });

    expect(screen.getByRole('img', { name: /landscape photo/i })).toBeInTheDocument();
  });

  it('should use the label as image alt when imageAlt is missing', () => {
    setup({ imageSrc: '/photo.jpg' });

    expect(screen.getByRole('img', { name: /photo tile/i })).toBeInTheDocument();
  });

  it('should render the hint when provided', () => {
    setup({ hint: 'Latam trip' });

    expect(screen.getByText('Latam trip')).toBeInTheDocument();
  });

  it('should apply the imagePosition to the image style when provided', () => {
    setup({ imageSrc: '/photo.jpg', imagePosition: 'top' });

    expect(screen.getByRole('img')).toHaveStyle({ objectPosition: 'top' });
  });

  it('should render the hint styled for image tiles when an image is present', () => {
    setup({
      imageSrc: '/photo.jpg',
      hint: 'Latam trip',
    });

    expect(screen.getByText('Latam trip')).toBeInTheDocument();
  });

  it('should apply extra className and style to the wrapper', () => {
    const { getByTestId } = setup({
      className: 'extra-class',
      style: { minHeight: '100px' },
    });

    const wrapper = getByTestId('molecule-tile-skeleton-0');
    expect(wrapper).toHaveClass('extra-class');
    expect(wrapper).toHaveStyle({ minHeight: '100px' });
  });
});
