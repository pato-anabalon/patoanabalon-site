import type { Skill } from "@/types";

/**
 * Per-category particle palettes for the Skills section vortex background.
 * Each palette leads with the site accent (emerald) so category swaps feel
 * cohesive, then adds one or two category-specific accents.
 */
export const SKILL_PALETTES: Record<Skill["category"], string[]> = {
  frontend: ["#10B981", "#34D399", "#22D3EE"],
  design: ["#10B981", "#F0ABFC", "#D946EF"],
  backend: ["#10B981", "#A78BFA", "#8B5CF6"],
  database: ["#10B981", "#818CF8", "#6366F1"],
  cloud: ["#10B981", "#38BDF8", "#60A5FA"],
  ai: ["#10B981", "#F472B6", "#EC4899"],
  testing: ["#10B981", "#FCA5A5", "#EF4444"],
  devops: ["#10B981", "#5EEAD4", "#14B8A6"],
  observability: ["#10B981", "#FDE047", "#EAB308"],
  tools: ["#10B981", "#FBBF24", "#F59E0B"],
  creative: ["#10B981", "#FB923C", "#F472B6"],
};
