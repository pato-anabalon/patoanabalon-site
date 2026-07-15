import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () =>
    function MockMuxPlayer(props: Record<string, unknown>) {
      return <div data-testid="mock-mux-player" data-props={JSON.stringify(props)} />;
    },
}));

import { VideoCard } from './VideoCard';

describe('VideoCard', () => {
  const defaultProps = {
    slug: 'demo',
    playbackId: 'playback123',
  };

  const setup = (props = {}) =>
    render(<VideoCard {...defaultProps} {...props} />);

  it('should render the poster button before the user starts the video', () => {
    setup();

    expect(
      screen.getByRole('button', { name: /playVideo/i })
    ).toBeInTheDocument();
  });

  it('should not render the video player before the user clicks play', () => {
    setup();

    expect(screen.queryByTestId('mock-mux-player')).not.toBeInTheDocument();
  });

  it('should render the video title from the i18n key', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'videos.demo.title' })).toBeInTheDocument();
  });

  it('should render the video description from the i18n key', () => {
    setup();

    expect(screen.getByText('videos.demo.description')).toBeInTheDocument();
  });

  it('should render the mux player after the user clicks play', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('button', { name: /playVideo/i }));

    expect(screen.getByTestId('mock-mux-player')).toBeInTheDocument();
  });

  it('should build the poster url from the playbackId', () => {
    setup();

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://image.mux.com/playback123/thumbnail.webp?width=960&fit_mode=preserve'
    );
  });
});
