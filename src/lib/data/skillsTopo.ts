import type { TopoPath } from '@/components/atoms'

/**
 * Foreground contour layer for the Skills section.
 * Denser, slightly thicker strokes, drifts leftward at 45s.
 * All paths start and end at the same y so consecutive tiles connect cleanly.
 */
export const skillsTopoLayer1: TopoPath[] = [
  { d: 'M0,70 C200,30 450,110 700,70 C900,40 1050,100 1200,70', opacity: 0.155 },
  { d: 'M0,110 C250,150 500,80 750,120 C950,90 1100,140 1200,110', opacity: 0.16 },
  { d: 'M0,155 C300,180 550,110 800,160 C1000,130 1100,190 1200,155', opacity: 0.15 },
  { d: 'M0,235 C200,270 500,190 750,240 C950,270 1100,200 1200,235', opacity: 0.165 },
  { d: 'M0,310 C300,280 600,340 900,300 C1050,270 1150,330 1200,310', opacity: 0.155 },
  { d: 'M0,400 C250,440 500,370 800,410 C1000,440 1100,370 1200,400', opacity: 0.17 },
  { d: 'M0,485 C300,450 550,510 850,470 C1050,440 1150,500 1200,485', opacity: 0.155 },
  { d: 'M0,540 C200,580 500,510 750,545 C950,570 1100,510 1200,540', opacity: 0.16 },
  { d: 'M0,610 C300,650 600,580 900,620 C1050,650 1150,580 1200,610', opacity: 0.15 },
  { d: 'M0,700 C250,660 550,730 800,690 C1000,660 1100,730 1200,700', opacity: 0.17 },
  { d: 'M0,745 C200,780 500,720 750,750 C950,720 1100,780 1200,745', opacity: 0.155 },
  { d: 'M0,820 C300,790 600,850 900,820 C1050,790 1150,850 1200,820', opacity: 0.15 },
]

/**
 * Background contour layer for the Skills section.
 * Sparser, thinner strokes, drifts rightward at 68s → crossing paths create depth.
 */
export const skillsTopoLayer2: TopoPath[] = [
  { d: 'M0,95 C400,135 800,55 1200,95', opacity: 0.14 },
  { d: 'M0,190 C300,150 700,220 1200,190', opacity: 0.135 },
  { d: 'M0,280 C500,320 900,220 1200,280', opacity: 0.145 },
  { d: 'M0,355 C200,395 600,315 1200,355', opacity: 0.13 },
  { d: 'M0,440 C400,400 800,470 1200,440', opacity: 0.14 },
  { d: 'M0,565 C300,600 700,530 1200,565', opacity: 0.135 },
  { d: 'M0,655 C500,620 900,690 1200,655', opacity: 0.14 },
  { d: 'M0,770 C200,800 600,740 1200,770', opacity: 0.13 },
  { d: 'M0,855 C400,825 800,880 1200,855', opacity: 0.135 },
]
