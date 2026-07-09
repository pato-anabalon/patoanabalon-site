// Off-Screen bento grid — 4 curated sets that the shuffle button cycles through.
// The slot names match the CSS grid areas defined in globals.css:
//
//   Desktop (4 cols × 5 rows, 20 unit cells):
//     "S1  S2  L   L"
//     "S3  S4  L   L"
//     "M1  M1  S5  S6"
//     "S7  S8  M2  M2"
//     "S9  S10 S11 S12"
//
//   Tablet (3 cols): only L, M1, M2, S1-S6 render — S7-S12 hidden.
//   Mobile (horizontal carousel): only L, M1, S1-S4 render — the rest hidden.
//
// USER: replace `src` filenames and add `labelKey` + `year` per photo when
// the curated sets are ready. The labelKey references
// messages/*.json → offScreen.captions.<key>.

export type PhotoSlot =
  | "L"
  | "M1"
  | "M2"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9"
  | "S10"
  | "S11"
  | "S12";

export interface OffScreenPhoto {
  slot: PhotoSlot;
  src: string;
  /** i18n key under offScreen.captions.* — null hides the caption on hover */
  labelKey: string | null;
  year?: number;
}

export interface OffScreenSet {
  /** Internal label for logs / dev — not shown to users */
  name: string;
  photos: OffScreenPhoto[];
}

const g = (file: string) => `/images/gallery/${file}`;

// Ordered slot list used to zip entries into a full set below
const SLOTS: PhotoSlot[] = [
  "L",
  "M1",
  "M2",
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
  "S11",
  "S12",
];

/**
 * Each entry is a tuple: [file, labelKey?, year?]
 * - file: filename inside public/images/gallery/
 * - labelKey: i18n key under offScreen.captions.* — omit for no caption
 * - year: appended to the caption as ", {year}" — omit if not applicable
 */
type SetEntry = readonly [file: string, labelKey?: string, year?: number];

function makeSet(name: string, entries: readonly SetEntry[]): OffScreenSet {
  if (entries.length !== SLOTS.length) {
    throw new Error(
      `OffScreen set "${name}" needs ${SLOTS.length} entries, got ${entries.length}`,
    );
  }
  return {
    name,
    photos: SLOTS.map((slot, i) => {
      const [file, labelKey, year] = entries[i];
      return {
        slot,
        src: g(file),
        labelKey: labelKey ?? null,
        year,
      };
    }),
  };
}

// Placeholder sets — real photos from public/images/gallery/ but slot
// assignment and captions are still to be curated by user.
export const OFF_SCREEN_SETS: OffScreenSet[] = [
  makeSet("set-1", [
    ["latam-18.jpg", "latamAwardsCeremony", 2026], // L
    ["family-5.jpeg", "rioDeJaneiro", 2025], // M1
    ["work-9.jpeg", "latamTeam", 2025], // M2
    ["latam-15.jpg", "latamAwardsCeremony", 2026], // S1  (swap con S6 → me-2)
    ["work-2.jpeg", "globant", 2021], // S2
    ["family-11.jpeg", "easterIsland", 2024], // S3
    ["work-14.jpeg", "globant", 2023], // S4  (swap con S10 → latam-6)
    ["latam-21.jpg", "latamAwardsCeremony", 2026], // S5
    ["me-2.jpeg", "portrait", 2019], // S6  (swap con S1 → latam-15)
    ["work-5.jpeg", "globant", 2022], // S7
    ["latam-22.jpg", "latamAwardsCeremony", 2026], // S8
    ["work-10.jpeg", "startUpChile", 2018], // S9
    ["latam-6.jpg", "latamAwardsCeremony", 2026], // S10 (swap con S4 → work-14)
    ["family-8.jpeg", "familyDay", 2025], // S11
    ["family-6.jpeg", "disneyWorld", 2013], // S12
  ]),
  makeSet("set-2", [
    ["award-2.jpeg", "globantAwards", 2022], // L
    ["family-3.jpeg", "recife", 2025], // M1
    ["latam-14.jpg", "latamAwardsCeremony", 2025], // M2
    ["family-9.jpeg", "saltoElLeonWaterfall", 2021], // S1
    ["work-1.jpeg", "rapelLake", 2023], // S2
    ["family-13.jpeg", "sunriseInAuckland", 2026], // S3
    ["work-15.jpeg", "globant", 2023], // S4  (swap con S10 → latam-5)
    ["latam-10.jpg", "latamAwardsCeremony", 2026], // S5
    ["latam-13.jpg", "latamAwardsCeremony", 2026], // S6
    ["work-4.jpeg", "workspace", 2020], // S7
    ["latam-17.jpg", "latamAwardsCeremony", 2026], // S8
    ["work-11.jpeg", "startUpChile", 2018], // S9
    ["latam-5.jpg", "latamAwardsCeremony", 2026], // S10 (swap con S4 → work-15)
    ["latam-19.jpg", "latamAwardsCeremony", 2026], // S11 (.jpg, no .jpeg)
    ["family-4.jpeg", "rioDeJaneiro", 2025], // S12
  ]),
  makeSet("set-3", [
    ["award-1.jpg", "globantAwards", 2022], // L
    ["family-1.jpeg", "christmas", 2022], // M1
    ["latam-1.jpg", "latamAwardsCeremony", 2026], // M2  (swap con S4 → work-3)
    ["me-1.jpeg", "portrait", 2020], // S1
    ["work-6.jpeg", "latamTeam", 2025], // S2
    ["family-2.jpeg", "disneyWorld", 2013], // S3
    ["work-3.jpeg", "workspace", 2022], // S4  (swap con M2 → latam-1)
    ["latam-2.jpg", "latamAwardsCeremony", 2026], // S5
    ["latam-3.jpg", "latamAwardsCeremony", 2026], // S6
    ["work-7.jpeg", "globant", 2024], // S7
    ["latam-4.jpg", "latamAwardsCeremony", 2026], // S8
    ["work-12.jpeg", "globant", 2023], // S9
    ["me-3.jpeg", "auckland", 2025], // S10
    ["me-4.jpeg", "rapelLake", 2022], // S11
    ["family-7.jpeg", "auckland", 2025], // S12
  ]),
  makeSet("set-4", [
    ["latam-24.jpeg", "latamAwardsCeremony", 2026], // L
    ["latam-23.jpg", "latamAwardsCeremony", 2026], // M1  (swap con S6 → family-12)
    ["latam-11.jpg", "latamAwardsCeremony", 2026], // M2  (swap con S2 → family-10)
    ["me-5.jpeg", "auckland", 2024], // S1
    ["family-10.jpeg", "easterIsland", 2024], // S2  (swap con M2 → latam-11)
    ["latam-8.jpg", "latamAwardsCeremony", 2026], // S3  (swap con M2 → family-10)
    ["latam-7.jpg", "latamAwardsCeremony", 2026], // S4
    ["work-8.jpeg", "globant", 2023], // S5
    ["family-12.jpeg", "easterIsland", 2024], // S6  (swap con M1 → latam-23)
    ["work-13.jpeg", "globant", 2024], // S7
    ["latam-12.jpg", "latamAwardsCeremony", 2026], // S8
    ["work-16.jpeg", "startUpChile", 2018], // S9
    ["me-6.jpeg", "independenceDay", 2023], // S10
    ["latam-20.jpg", "latamAwardsCeremony", 2026], // S11
    ["latam-9.jpg", "latamAwardsCeremony", 2026], // S12
  ]),
];
