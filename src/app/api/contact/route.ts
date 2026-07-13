import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_TO = 'pato.anabalon@gmail.com'
const CONTACT_FROM = '"patoanabalon.dev" <contact@patoanabalon.dev>'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Contact form: RESEND_API_KEY not set')
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px;">
          <p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
          <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
          <p style="color: #6b7280; font-size: 12px;">Sent via patoanabalon.dev contact form. Reply to this email to respond directly.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
