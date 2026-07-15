import React from 'react';
import { render } from '@testing-library/react';
import { TopographicLines } from './TopographicLines';

describe('TopographicLines', () => {
  const defaultProps = {
    paths: [
      { d: 'M0,0 L10,10' },
      { d: 'M0,10 L10,20', opacity: 0.5 },
    ],
  };

  const setup = (props = {}) =>
    render(<TopographicLines {...defaultProps} {...props} />);

  it('should render one path per entry', () => {
    const { container } = setup();

    expect(container.querySelectorAll('path')).toHaveLength(2);
  });

  it('should apply the opacity of a path when provided', () => {
    const { container } = setup();
    const paths = container.querySelectorAll('path');

    expect(paths[1]).toHaveAttribute('opacity', '0.5');
  });

  it('should render a use element that clones the group at the tile offset', () => {
    const { container } = setup({ tileWidth: 500 });
    const use = container.querySelector('use');

    expect(use).toHaveAttribute('x', '500');
  });

  it('should use the explicit groupId when provided so multiple instances stay isolated', () => {
    const { container } = setup({ groupId: 'my-topo' });

    expect(container.querySelector('g')).toHaveAttribute('id', 'my-topo');
    expect(container.querySelector('use')).toHaveAttribute('href', '#my-topo');
  });

  it('should generate a stable id when groupId is omitted', () => {
    const { container } = setup();
    const group = container.querySelector('g');
    const use = container.querySelector('use');

    expect(group?.getAttribute('id')).toMatch(/^topo-/);
    expect(use?.getAttribute('href')).toBe(`#${group?.getAttribute('id')}`);
  });

  it('should forward the stroke and stroke-width props to the group', () => {
    const { container } = setup({ stroke: '#000', strokeWidth: 3 });
    const group = container.querySelector('g');

    expect(group).toHaveAttribute('stroke', '#000');
    expect(group).toHaveAttribute('stroke-width', '3');
  });
});
