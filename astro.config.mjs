import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    }
  },
  site: 'https://abhy12.github.io/',
  base: '/JS-Components',
});
