import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const mono = await readFile(
    join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.ttf'),
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div style={{ display: 'flex', fontSize: 76, color: '#34D399', letterSpacing: -3 }}>
          <span style={{ color: '#10B981' }}>{'{'}</span>
          <span>PA</span>
          <span style={{ color: '#10B981' }}>{'}'}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  )
}
