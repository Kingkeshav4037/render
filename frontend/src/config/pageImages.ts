export interface PageImages {
  hero?: string; // Required format: resolution, theme (e.g. "high-res, dramatic, fjords")
  featured?: string;
  mapOverlay?: string;
  gallery?: boolean;
}

export const pageImages: Record<string, PageImages> = {
  wildlife: {
    hero: "reindeer in snow, cinematic, 4k",
    gallery: true
  },
  aurora: {
    hero: "tromso northern lights, vibrant, 4k",
    mapOverlay: "aurora probability heatmap overlay"
  },
  planner: {
    hero: "abstract lavender gradients, blurred"
  },
  energy: {
    hero: "hydroelectric dam, moody, dark"
  }
};
