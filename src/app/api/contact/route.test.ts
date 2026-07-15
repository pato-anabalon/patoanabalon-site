/**
 * @jest-environment node
 */
const sendMock = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST } from './route';

describe('POST /api/contact', () => {
  const ORIGINAL_ENV = process.env;
  const validBody = {
    name: 'Pato',
    email: 'pato@example.com',
    message: 'Hello!',
  };

  const buildRequest = (body: unknown) =>
    ({
      json: async () => body,
    }) as unknown as Request;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...ORIGINAL_ENV, RESEND_API_KEY: 'test-key' };
    sendMock.mockResolvedValue({ error: null });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore?.();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should respond with 400 when required fields are missing', async () => {
    const res = await POST(buildRequest({ name: '', email: '', message: '' }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Missing required fields' });
  });

  it('should respond with 400 when the email format is invalid', async () => {
    const res = await POST(buildRequest({ ...validBody, email: 'invalid' }));

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid email format' });
  });

  it('should respond with 500 when the RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(buildRequest(validBody));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Email service not configured' });
  });

  it('should respond with 500 when Resend returns an error', async () => {
    sendMock.mockResolvedValueOnce({ error: { message: 'boom' } });
    const res = await POST(buildRequest(validBody));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Failed to send message' });
  });

  it('should respond with 500 when the request body is not parseable', async () => {
    const brokenRequest = {
      json: async () => {
        throw new Error('bad json');
      },
    } as unknown as Request;

    const res = await POST(brokenRequest);

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Internal server error' });
  });

  it('should escape HTML characters in the email body', async () => {
    await POST(
      buildRequest({
        ...validBody,
        name: 'Pato <script>',
        message: '5 > 2 & "safe"',
      })
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.html).toContain('Pato &lt;script&gt;');
    expect(args.html).toContain('5 &gt; 2 &amp; &quot;safe&quot;');
    expect(args.html).not.toContain('<script>');
  });

  it('should send the email with the expected subject and reply-to when the payload is valid', async () => {
    const res = await POST(buildRequest(validBody));

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'pato.anabalon@gmail.com',
        replyTo: 'pato@example.com',
        subject: 'New contact form submission from Pato',
      })
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ success: true });
  });
});
