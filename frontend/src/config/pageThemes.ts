export type ThemeCategory = 
  | "nordic-sage" // Nature/Wildlife
  | "polar-indigo" // Smart Norway, IoT, Planner
  | "glacier-mint" // EV, Sustainability
  | "ocean-steel"  // Ferries, Marine
  | "aurora-violet" // Aurora, Night
  | "midnight-blue" // Deep space/Dark theme
  | "amber-warm"   // Energy, Fire, Cozy
  | "crimson-alert"; // Safety, Warnings

export interface PageTheme {
  theme: ThemeCategory;
  background: string;
  accent: string;
}

export const pageThemes: Record<string, PageTheme> = {
  wildlife: {
    theme: "nordic-sage",
    background: "forest-cinematic",
    accent: "#84A98C"
  },
  planner: {
    theme: "polar-indigo",
    background: "lavender-ice",
    accent: "#E9D5FF"
  },
  ev: {
    theme: "glacier-mint",
    background: "deep-night",
    accent: "#4ADE80"
  },
  aurora: {
    theme: "aurora-violet",
    background: "night-sky",
    accent: "#A78BFA"
  },
  energy: {
    theme: "amber-warm",
    background: "deep-night",
    accent: "#FBBF24"
  },
  safety: {
    theme: "crimson-alert",
    background: "dark-red",
    accent: "#EF4444"
  }
};
