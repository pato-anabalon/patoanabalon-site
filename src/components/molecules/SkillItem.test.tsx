import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/lib/data/skillIcons', () => ({
  skillIcons: {
    React: {
      Icon: ({ size, color }: { size: number; color: string }) => (
        <span data-testid="mock-icon" data-size={size} data-color={color}>
          icon
        </span>
      ),
      color: '#61DAFB',
    },
  },
}));

import { SkillItem } from './SkillItem';

describe('SkillItem', () => {
  const setup = (props: React.ComponentProps<typeof SkillItem>) =>
    render(<SkillItem {...props} />);

  it('should render the skill name', () => {
    setup({ name: 'React' });

    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should render the mapped icon when the skill exists in the registry', () => {
    setup({ name: 'React' });

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should fall back to the initial letter when no icon is registered', () => {
    setup({ name: 'Unknown Skill' });

    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });
});
