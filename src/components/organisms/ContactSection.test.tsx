import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => function ParticleFieldMock() {
    return <div data-testid="particle-field-mock" />;
  },
}));

jest.mock('@/lib/animations/gsap', () => {
  const chain = { to: jest.fn(), fromTo: jest.fn() };
  const context = jest.fn((cb: () => void) => {
    cb();
    return { revert: jest.fn() };
  });
  return {
    gsap: {
      to: jest.fn(() => chain),
      set: jest.fn(),
      fromTo: jest.fn(),
      context,
      timeline: jest.fn(() => chain),
    },
    SplitText: jest.fn().mockImplementation(() => ({
      chars: [],
      words: [],
      lines: [],
      revert: jest.fn(),
    })),
  };
});

jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
}));

import { ContactSection } from './ContactSection';
import { trackEvent } from '@/lib/analytics';

describe('ContactSection', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const setup = () => render(<ContactSection />);

  const fillForm = async (
    user: ReturnType<typeof userEvent.setup>,
    overrides: Partial<{ name: string; email: string; message: string }> = {}
  ) => {
    const data = {
      name: 'Pato',
      email: 'pato@example.com',
      message: 'Hola!',
      ...overrides,
    };
    await user.type(screen.getByTestId('contact-input-name'), data.name);
    await user.type(screen.getByTestId('contact-input-email'), data.email);
    await user.type(screen.getByTestId('contact-input-message'), data.message);
  };

  it('should render the form inputs and submit button', () => {
    setup();

    expect(screen.getByTestId('contact-input-name')).toBeInTheDocument();
    expect(screen.getByTestId('contact-input-email')).toBeInTheDocument();
    expect(screen.getByTestId('contact-input-message')).toBeInTheDocument();
    expect(screen.getByTestId('contact-submit-button')).toBeInTheDocument();
  });

  it('should show an inline error when the email fails validation on blur', async () => {
    const user = userEvent.setup();
    setup();

    const emailInput = screen.getByTestId('contact-input-email');
    await user.type(emailInput, 'invalid');
    await user.tab();

    expect(screen.getByText('errors.invalidEmail')).toBeInTheDocument();
  });

  it('should block the submit when the payload contains injection patterns', async () => {
    const user = userEvent.setup();
    setup();

    await fillForm(user, { message: '<script>bad()</script>' });
    await user.click(screen.getByTestId('contact-submit-button'));

    expect(screen.getByText('errors.invalidChars')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should block the submit when the email is not valid', async () => {
    const user = userEvent.setup();
    setup();

    await fillForm(user, { email: 'not-an-email' });
    await user.click(screen.getByTestId('contact-submit-button'));

    expect(screen.getByText('errors.invalidEmail')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should transition to the success state when the API call succeeds', async () => {
    const user = userEvent.setup();
    setup();

    await fillForm(user);
    await user.click(screen.getByTestId('contact-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('contact-success')).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('should show the error message when the API responds with a failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    const user = userEvent.setup();
    setup();

    await fillForm(user);
    await user.click(screen.getByTestId('contact-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('errorMessage')).toBeInTheDocument();
    });
  });

  it('should show the error message when the fetch itself throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('boom'));
    const user = userEvent.setup();
    setup();

    await fillForm(user);
    await user.click(screen.getByTestId('contact-submit-button'));

    await waitFor(() => {
      expect(screen.getByText('errorMessage')).toBeInTheDocument();
    });
  });

  it('should clear inline errors when the user starts editing the fields again', async () => {
    const user = userEvent.setup();
    setup();

    const emailInput = screen.getByTestId('contact-input-email');
    await user.type(emailInput, 'invalid');
    await user.tab();
    expect(screen.getByText('errors.invalidEmail')).toBeInTheDocument();

    await user.type(emailInput, 'valid@example.com');
    expect(screen.queryByText('errors.invalidEmail')).not.toBeInTheDocument();
  });

  it('should track resume downloads for the PDF format', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('resume-download-pdf'));

    expect(trackEvent).toHaveBeenCalledWith('resume_download', {
      format: 'pdf',
      source: 'contact_section',
    });
  });

  it('should track resume downloads for the DOCX format', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByTestId('resume-download-docx'));

    expect(trackEvent).toHaveBeenCalledWith('resume_download', {
      format: 'docx',
      source: 'contact_section',
    });
  });

  it('should scroll the target section into view when a nav link is clicked', async () => {
    const scrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const target = document.createElement('section');
    target.id = 'about';
    document.body.appendChild(target);

    const user = userEvent.setup();
    setup();

    await user.click(
      screen.getAllByRole('link', { name: /about/i })[0]
    );

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    document.body.removeChild(target);
  });
});
