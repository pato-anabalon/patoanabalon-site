import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  const defaultProps = {
    label: 'About',
    href: '#about',
  };

  const setup = (props = {}) => render(<NavItem {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render an accessible link with the provided label', () => {
    setup();

    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('should point the href to the target section', () => {
    setup();

    expect(screen.getByRole('link')).toHaveAttribute('href', '#about');
  });

  it('should call the onClick handler when the user clicks the link', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    setup({ onClick });

    await user.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should scroll the target section into view smoothly when clicked', async () => {
    const scrollIntoView = jest.fn();
    const target = document.createElement('section');
    target.id = 'about';
    Object.defineProperty(target, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
    document.body.appendChild(target);

    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('link'));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(target);
  });

  it('should not throw when clicked without a matching target', async () => {
    const user = userEvent.setup();
    setup();

    await expect(user.click(screen.getByRole('link'))).resolves.not.toThrow();
  });
});
