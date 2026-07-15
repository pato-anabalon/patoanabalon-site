import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Preloader } from './Preloader';

describe('Preloader', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    delete (window as unknown as { __preloaderDone?: boolean }).__preloaderDone;
  });

  it('should render the preloader status region', () => {
    render(<Preloader />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should lock the body scroll while visible', () => {
    render(<Preloader />);

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('should reveal each boot line as time advances', async () => {
    render(<Preloader />);

    expect(screen.queryByText('steps.init')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('steps.ready')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should call onComplete and dispatch preloader:done once the fade is done', async () => {
    const onComplete = jest.fn();
    const eventListener = jest.fn();
    window.addEventListener('preloader:done', eventListener);

    render(<Preloader onComplete={onComplete} />);

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: 3000,
    });
    expect(eventListener).toHaveBeenCalledTimes(1);
    expect((window as unknown as { __preloaderDone?: boolean }).__preloaderDone).toBe(true);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    window.removeEventListener('preloader:done', eventListener);
  });

  it('should restore body overflow when the preloader is gone', async () => {
    const onComplete = jest.fn();
    render(<Preloader onComplete={onComplete} />);

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: 3000,
    });
    await waitFor(() => expect(document.body.style.overflow).toBe(''), {
      timeout: 3000,
    });
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('should still run when document.fonts is unavailable', async () => {
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: undefined,
    });
    const onComplete = jest.fn();

    render(<Preloader onComplete={onComplete} />);

    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: 3000,
    });
  });
});
