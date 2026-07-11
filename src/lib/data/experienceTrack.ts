/**
 * Ordered list of items that make up the horizontal Experience track.
 * Mixing companies + milestones + photo placeholders keeps the track visually varied.
 * Items are consumed sequentially by ExperienceSection and rendered as floating cards.
 * Display copy (milestone big/year/text, company role/period/description) is resolved
 * from the i18n layer using the slug/id — this file only defines structure and order.
 */

export type TrackItem =
  | { kind: 'company'; id: 'latam' | 'globant' | 'amicar' | 'mink' | 'indexa' }
  | { kind: 'milestone'; slug: string }
  | { kind: 'photo'; index: number; slug: string };

export const trackItems: TrackItem[] = [
  { kind: 'company', id: 'latam' },
  { kind: 'milestone', slug: 'latamAward' },
  { kind: 'photo', index: 0, slug: 'latamCeremony' },
  { kind: 'company', id: 'globant' },
  { kind: 'milestone', slug: 'globantAward' },
  { kind: 'photo', index: 1, slug: 'globantTeam' },
  { kind: 'company', id: 'amicar' },
  { kind: 'company', id: 'mink' },
  { kind: 'milestone', slug: 'startupChile' },
  { kind: 'photo', index: 2, slug: 'minkPitch' },
  { kind: 'company', id: 'indexa' },
  { kind: 'milestone', slug: 'yearsCoding' }
];
