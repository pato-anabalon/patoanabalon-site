import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: integrate Resend (https://resend.com) or EmailJS for actual email delivery.
    // For now, log to console and return success so the form UX works end-to-end.
    console.log('Contact form submission:', { name, email, message })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
