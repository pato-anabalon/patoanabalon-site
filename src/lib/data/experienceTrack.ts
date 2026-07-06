/**
 * Ordered list of items that make up the horizontal Experience track.
 * Mixing companies + milestones + photo placeholders keeps the track visually varied.
 * Items are consumed sequentially by ExperienceSection and rendered as floating cards.
 */

export type TrackItem =
  | { kind: 'company'; id: 'latam' | 'globant' | 'amicar' | 'mink' | 'indexa' }
  | { kind: 'milestone'; slug: string; big: string; year: string }
  | { kind: 'photo'; index: number; slug: string }

export const trackItems: TrackItem[] = [
  { kind: 'company', id: 'latam' },
  { kind: 'milestone', slug: 'latamAward', big: 'Service Leader', year: '2025' },
  { kind: 'photo', index: 0, slug: 'latamCeremony' },
  { kind: 'company', id: 'globant' },
  { kind: 'milestone', slug: 'globantAward', big: 'Innovate', year: '2022' },
  { kind: 'photo', index: 1, slug: 'globantTeam' },
  { kind: 'company', id: 'amicar' },
  { kind: 'company', id: 'mink' },
  { kind: 'milestone', slug: 'startupChile', big: 'G19', year: '2019' },
  { kind: 'photo', index: 2, slug: 'minkPitch' },
  { kind: 'company', id: 'indexa' },
  { kind: 'milestone', slug: 'yearsCoding', big: '18+', year: 'Years' },
]
