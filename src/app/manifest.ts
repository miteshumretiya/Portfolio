import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | Portfolio`,
    short_name: "Mitesh U.",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#070b08",
    theme_color: "#070b08",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
