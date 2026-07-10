import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Pato Anabalon — Senior Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#0F172A'
const PANEL = '#1E293B'
const ACCENT = '#10B981'
const ACCENT_LIGHT = '#34D399'
const TEXT = '#E2E8F0'
const MUTED = '#94A3B8'

const LINES: Array<{ cmd: string; out: string; highlight?: boolean }> = [
  { cmd: 'whoami', out: 'Pato Anabalon', highlight: true },
  { cmd: 'cat role.txt', out: 'Senior Software Engineer · 18+ years of experience' },
  { cmd: 'cat stack.txt', out: 'Next.js · React · TypeScript · Node.js · .NET C#' },
]

const LOGOS = ['nextdotjs', 'react', 'typescript', 'nodedotjs', 'dotnet'] as const

async function loadLogo(name: string): Promise<string> {
  const raw = await readFile(
    join(process.cwd(), `public/og/logos/${name}.svg`),
    'utf-8',
  )
  const colored = raw.replace('<svg ', `<svg fill="${ACCENT_LIGHT}" `)
  const base64 = Buffer.from(colored).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0xffffffff
  }
}

const PARTICLES = (() => {
  const rand = seededRandom(42)
  return Array.from({ length: 320 }, () => {
    const roll = rand()
    const size = roll > 0.94 ? 5 + Math.round(rand() * 3) : 1 + Math.round(rand() * 3)
    const opacity = 0.12 + rand() * 0.55
    return {
      x: Math.round(rand() * 1200),
      y: Math.round(rand() * 630),
      size,
      opacity,
      color: rand() > 0.8 ? ACCENT : ACCENT_LIGHT,
    }
  })
})()

export default async function Image() {
  const mono = await readFile(
    join(process.cwd(), 'public/fonts/JetBrainsMono-Regular.ttf'),
  )
  const logos = await Promise.all(LOGOS.map(loadLogo))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at 20% 30%, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0) 55%), ${BG}`,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'JetBrains Mono',
          color: TEXT,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
          }}
        >
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                borderRadius: 999,
                background: p.color,
                opacity: p.opacity,
                display: 'flex',
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: 56,
            gap: 28,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              background: PANEL,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px 24px',
                background: '#0B1220',
                gap: 10,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 999, background: '#EF4444', display: 'flex' }} />
              <div style={{ width: 14, height: 14, borderRadius: 999, background: '#F59E0B', display: 'flex' }} />
              <div style={{ width: 14, height: 14, borderRadius: 999, background: ACCENT, display: 'flex' }} />
              <div
                style={{
                  marginLeft: 20,
                  color: MUTED,
                  fontSize: 22,
                  display: 'flex',
                }}
              >
                ~/patoanabalon — zsh
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '44px 44px',
                gap: 28,
                flex: 1,
              }}
            >
              {LINES.map((line, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 10,
                      color: MUTED,
                      fontSize: 22,
                    }}
                  >
                    <span style={{ color: ACCENT }}>$</span>
                    <span>{line.cmd}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: line.highlight ? 40 : 24,
                      color: line.highlight ? ACCENT_LIGHT : TEXT,
                    }}
                  >
                    <span style={{ color: ACCENT }}>›</span>
                    <span>{line.out}</span>
                    {i === LINES.length - 1 ? (
                      <span
                        style={{
                          marginLeft: 6,
                          width: 14,
                          height: 24,
                          background: ACCENT,
                          display: 'flex',
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: 'auto',
                  paddingTop: 16,
                  borderTop: `1px solid ${BG}`,
                }}
              >
                <div style={{ display: 'flex', color: MUTED, fontSize: 20 }}>
                  — end of transmission
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: TEXT,
                    fontSize: 22,
                  }}
                >
                  <span style={{ color: ACCENT }}>●</span>
                  <span>patoanabalon.dev</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              width: 80,
              paddingTop: 32,
              paddingBottom: 32,
              opacity: 0.22,
            }}
          >
            {logos.map((src, i) => (
              <img
                key={i}
                src={src}
                width={56}
                height={56}
                style={{ width: 56, height: 56 }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: mono,
          weight: 400,
          style: 'normal',
        },
      ],
    },
  )
}
