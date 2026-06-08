import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const site = process.env.SITE_URL || "https://example.github.io";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  integrations: [react()],
  output: "static"
});
