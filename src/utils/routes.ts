import { WebsitePageId } from '../types/robotics';

export const SITE_ORIGIN = 'https://algorohm.pages.dev';

export const PAGE_PATHS: Record<WebsitePageId, string> = {
  home: '/',
  platforms: '/platforms',
  architecture: '/architecture',
  deployments: '/deployments',
  research: '/research',
};

export function getPageHref(page: WebsitePageId, sectionId?: string): string {
  const basePath = PAGE_PATHS[page] || '/';
  if (!sectionId || sectionId === page || (page === 'home' && sectionId === 'home')) {
    return basePath;
  }
  return `${basePath}#${sectionId}`;
}

export function getCanonicalUrl(page: WebsitePageId): string {
  const basePath = PAGE_PATHS[page] || '/';
  return basePath === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${basePath}`;
}

export function resolvePageFromLocation(): {
  page: WebsitePageId;
  sectionId?: string;
} {
  if (typeof window === 'undefined') return { page: 'home' };

  const pathname = window.location.pathname
    .replace(/\/+$/, '')
    .toLowerCase();
  const rawHash = window.location.hash.replace(/^#/, '').trim().toLowerCase();

  if (pathname === '/platforms' || pathname === '/inspector') {
    return {
      page: 'platforms',
      sectionId: rawHash || (pathname === '/inspector' ? 'inspector' : undefined),
    };
  }
  if (pathname === '/architecture') {
    return { page: 'architecture', sectionId: rawHash || undefined };
  }
  if (
    pathname === '/deployments' ||
    pathname === '/field-gallery' ||
    pathname === '/roi-configurator'
  ) {
    const inferredSection =
      rawHash ||
      (pathname === '/field-gallery' || pathname === '/roi-configurator'
        ? pathname.slice(1)
        : undefined);
    return { page: 'deployments', sectionId: inferredSection };
  }
  if (pathname === '/research') {
    return { page: 'research', sectionId: rawHash || undefined };
  }

  // Fallback for legacy hash-only URLs (e.g., /#platforms, /#inspector, /#architecture)
  if (rawHash === 'platforms' || rawHash === 'inspector') {
    return {
      page: 'platforms',
      sectionId: rawHash === 'inspector' ? 'inspector' : undefined,
    };
  }
  if (rawHash === 'architecture') {
    return { page: 'architecture' };
  }
  if (
    rawHash === 'deployments' ||
    rawHash === 'field-gallery' ||
    rawHash === 'roi-configurator'
  ) {
    return {
      page: 'deployments',
      sectionId: rawHash !== 'deployments' ? rawHash : undefined,
    };
  }
  if (rawHash === 'research') {
    return { page: 'research' };
  }

  return { page: 'home', sectionId: rawHash && rawHash !== 'home' ? rawHash : undefined };
}
