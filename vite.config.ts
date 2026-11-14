import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { SEO_ROUTES } from './src/data/seoRoutes';
import { SITE_ORIGIN } from './src/utils/routes';

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function prerenderRouteHtmlPlugin(): Plugin {
  return {
    name: 'algorohm-prerender-route-html',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

      for (const route of Object.values(SEO_ROUTES)) {
        if (route.id === 'home') continue;

        const canonicalUrl = `${SITE_ORIGIN}${route.path}`;
        const safeTitle = escapeHtmlAttr(route.title);
        const safeDesc = escapeHtmlAttr(route.description);

        const breadcrumbSchema = JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebPage',
              '@id': `${canonicalUrl}#page`,
              url: canonicalUrl,
              name: route.title,
              description: route.description,
              isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
              about: { '@id': `${SITE_ORIGIN}/#organization` },
            },
            {
              '@type': 'BreadcrumbList',
              '@id': `${canonicalUrl}#breadcrumb`,
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: `${SITE_ORIGIN}/`,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: route.breadcrumbName,
                  item: canonicalUrl,
                },
              ],
            },
          ],
        });

        let routeHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${safeTitle}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
            `<meta name="description" content="${safeDesc}" />`
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          )
          .replace(
            /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/,
            `<meta property="og:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
            `<meta property="og:description" content="${safeDesc}" />`
          )
          .replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
            `<meta property="og:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/>/,
            `<meta name="twitter:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/,
            `<meta name="twitter:title" content="${safeTitle}" />`
          )
          .replace(
            /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
            `<meta name="twitter:description" content="${safeDesc}" />`
          )
          .replace(
            /<\/head>/,
            `  <script id="algorohm-route-jsonld" type="application/ld+json">${breadcrumbSchema}</script>\n  </head>`
          )
          .replace(
            /<h1>[\s\S]*?<\/h1>\s*<p>[\s\S]*?<\/p>/,
            `<h1>${escapeHtmlAttr(route.noscriptHeading)}</h1>\n        <p>${escapeHtmlAttr(route.noscriptSummary)}</p>`
          );

        const outFile = path.join(distDir, `${route.path.slice(1)}.html`);
        fs.writeFileSync(outFile, routeHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), prerenderRouteHtmlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
