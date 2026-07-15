import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuItem } from './MenuItem';

describe('MenuItem', () => {
  const defaultProps = {
    index: 0,
    label: 'About',
    href: '#about',
  };

  const setup = (props = {}) =>
    render(<MenuItem {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the label', () => {
    setup();

    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should format the index prefix as two digits starting at 1', () => {
    setup({ index: 4 });

    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('should call onClick with the href when the link is clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    setup({ onClick });

    await user.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledWith('#about');
  });

  it('should not throw when onClick is not provided', async () => {
    const user = userEvent.setup();
    setup();

    await expect(user.click(screen.getByRole('link'))).resolves.not.toThrow();
  });

  it('should call onHover with the index when the user hovers over the link', async () => {
    const onHover = jest.fn();
    const user = userEvent.setup();
    setup({ onHover, index: 2 });

    await user.hover(screen.getByRole('link'));

    expect(onHover).toHaveBeenCalledWith(2);
  });

  it('should call onHover with the index when the link receives focus', () => {
    const onHover = jest.fn();
    setup({ onHover, index: 3 });

    screen.getByRole('link').focus();

    expect(onHover).toHaveBeenCalledWith(3);
  });

  it('should announce the current page when isActive is true', () => {
    setup({ isActive: true });

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('should not set aria-current when isActive is false', () => {
    setup({ isActive: false });

    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });
});
