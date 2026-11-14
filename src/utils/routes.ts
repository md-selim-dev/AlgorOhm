import { WebsitePageId } from '../types/robotics';

export const SITE_ORIGIN = 'https://algorohm.pages.dev';

export const PAGE_PATHS: Record<WebsitePageId, string> = {
  home: '/',
  platforms: '/platforms',
  architecture: '/architecture',
  deployments: '/deployments',
  research: '/research',
};

const KNOWN_PATHNAMES = new Set([
  '',
  '/',
  '/platforms',
  '/inspector',
  '/architecture',
  '/deployments',
  '/field-gallery',
  '/roi-configurator',
  '/research',
]);

export function isKnownPathname(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '').toLowerCase() || '/';
  return KNOWN_PATHNAMES.has(normalized);
}

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
  shouldCanonicalizeUrl?: boolean;
} {
  if (typeof window === 'undefined') return { page: 'home' };

  const rawPathname = window.location.pathname;
  const pathname = rawPathname.replace(/\/+$/, '').toLowerCase() || '/';
  const rawHash = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  const hasTrailingSlashOnInnerRoute =
    rawPathname.length > 1 && rawPathname.endsWith('/');
  const hasUppercaseInPath = rawPathname !== rawPathname.toLowerCase();

  if (pathname === '/platforms' || pathname === '/inspector') {
    const sectionId = rawHash || (pathname === '/inspector' ? 'inspector' : undefined);
    return {
      page: 'platforms',
      sectionId,
      shouldCanonicalizeUrl:
        pathname === '/inspector' || hasTrailingSlashOnInnerRoute || hasUppercaseInPath,
    };
  }
  if (pathname === '/architecture') {
    return {
      page: 'architecture',
      sectionId: rawHash || undefined,
      shouldCanonicalizeUrl: hasTrailingSlashOnInnerRoute || hasUppercaseInPath,
    };
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
    return {
      page: 'deployments',
      sectionId: inferredSection,
      shouldCanonicalizeUrl:
        pathname !== '/deployments' ||
        hasTrailingSlashOnInnerRoute ||
        hasUppercaseInPath,
    };
  }
  if (pathname === '/research') {
    return {
      page: 'research',
      sectionId: rawHash || undefined,
      shouldCanonicalizeUrl: hasTrailingSlashOnInnerRoute || hasUppercaseInPath,
    };
  }

  // Upgrade legacy hash URLs (e.g., /#platforms, /#inspector, /#architecture) to canonical paths
  if (pathname === '/' && rawHash) {
    if (rawHash === 'platforms' || rawHash === 'inspector') {
      return {
        page: 'platforms',
        sectionId: rawHash === 'inspector' ? 'inspector' : undefined,
        shouldCanonicalizeUrl: true,
      };
    }
    if (rawHash === 'architecture') {
      return { page: 'architecture', shouldCanonicalizeUrl: true };
    }
    if (
      rawHash === 'deployments' ||
      rawHash === 'field-gallery' ||
      rawHash === 'roi-configurator'
    ) {
      return {
        page: 'deployments',
        sectionId: rawHash !== 'deployments' ? rawHash : undefined,
        shouldCanonicalizeUrl: true,
      };
    }
    if (rawHash === 'research') {
      return { page: 'research', shouldCanonicalizeUrl: true };
    }
    if (rawHash === 'home') {
      return { page: 'home', shouldCanonicalizeUrl: true };
    }
  }

  return {
    page: 'home',
    sectionId: rawHash && rawHash !== 'home' ? rawHash : undefined,
    shouldCanonicalizeUrl: !isKnownPathname(rawPathname) || hasUppercaseInPath,
  };
}
