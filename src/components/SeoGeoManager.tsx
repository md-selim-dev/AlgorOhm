import React, { useEffect } from 'react';
import { ROBOT_PLATFORMS } from '../data/roboticsData';
import { SEO_ROUTES } from '../data/seoRoutes';
import { FieldGalleryItem, WebsitePageId, Whitepaper } from '../types/robotics';
import { getCanonicalUrl, SITE_ORIGIN } from '../utils/routes';

interface SeoGeoManagerProps {
  activePage: WebsitePageId;
  selectedRobotId: string;
  selectedWhitepaper: Whitepaper | null;
  lightboxPhoto: FieldGalleryItem | null;
}

const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85';

const PLATFORM_PRICING_MAP: Record<string, { price: string; availability: string }> = {
  'ohm-x1': { price: '82000', availability: 'https://schema.org/InStock' },
  'vortex-amr-400': { price: '54000', availability: 'https://schema.org/InStock' },
  'kinetix-7-arm': { price: '68000', availability: 'https://schema.org/InStock' },
  'strider-q8': { price: '74000', availability: 'https://schema.org/PreOrder' },
};

function setMetaContent(selector: string, content: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute('content', content);
  }
}

export const SeoGeoManager: React.FC<SeoGeoManagerProps> = ({
  activePage,
  selectedRobotId,
  selectedWhitepaper,
  lightboxPhoto,
}) => {
  useEffect(() => {
    const activeRobot =
      ROBOT_PLATFORMS.find((r) => r.id === selectedRobotId) || ROBOT_PLATFORMS[0];
    const routeMeta = SEO_ROUTES[activePage] || SEO_ROUTES.home;

    let nextTitle = routeMeta.title;
    let nextDescription = routeMeta.description;
    let nextImage = DEFAULT_OG_IMAGE;

    if (selectedWhitepaper) {
      nextTitle = `${selectedWhitepaper.title} | AlgorOhm Research`;
      nextDescription = selectedWhitepaper.abstract;
    } else if (lightboxPhoto) {
      nextTitle = `${lightboxPhoto.title} (${lightboxPhoto.location}) | AlgorOhm`;
      nextDescription = lightboxPhoto.caption;
      nextImage = lightboxPhoto.image;
    } else if (activePage === 'platforms' && activeRobot) {
      nextTitle = `${activeRobot.name} & Spec Inspector (${activeRobot.specs.peakTorque.split(' ')[0]} Nm) | AlgorOhm`;
      nextDescription = `${activeRobot.name}: ${activeRobot.description} Peak Torque: ${activeRobot.specs.peakTorque}, Compute: ${activeRobot.specs.computePower}.`;
      nextImage = activeRobot.image;
    }

    document.title = nextTitle;

    const canonicalUrl = getCanonicalUrl(activePage);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    setMetaContent('meta[name="description"]', nextDescription);
    setMetaContent('meta[property="og:title"]', nextTitle);
    setMetaContent('meta[property="og:description"]', nextDescription);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', nextImage);
    setMetaContent('meta[name="twitter:title"]', nextTitle);
    setMetaContent('meta[name="twitter:description"]', nextDescription);
    setMetaContent('meta[name="twitter:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:image"]', nextImage);

    const staticRouteJsonLd = document.getElementById('algorohm-route-jsonld');
    if (staticRouteJsonLd) {
      staticRouteJsonLd.remove();
    }

    const scriptId = 'algorohm-dynamic-entity-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const graphNodes: Record<string, unknown>[] = [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#page`,
        url: canonicalUrl,
        name: nextTitle,
        description: nextDescription,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#organization` },
      },
    ];

    if (activePage !== 'home') {
      graphNodes.push({
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
            name: routeMeta.breadcrumbName,
            item: canonicalUrl,
          },
        ],
      });
    }

    const offerConfig = PLATFORM_PRICING_MAP[activeRobot.id] || {
      price: '68000',
      availability: 'https://schema.org/InStock',
    };

    graphNodes.push({
      '@type': 'Product',
      '@id': `${SITE_ORIGIN}/platforms#active-inspector-${activeRobot.id}`,
      url: `${SITE_ORIGIN}/platforms#inspector`,
      name: activeRobot.name,
      sku: activeRobot.id.toUpperCase(),
      category: activeRobot.category,
      description: activeRobot.description,
      image: activeRobot.image,
      brand: {
        '@type': 'Brand',
        name: 'AlgorOhm Robotics',
      },
      offers: {
        '@type': 'Offer',
        price: offerConfig.price,
        priceCurrency: 'USD',
        availability: offerConfig.availability,
        url: `${SITE_ORIGIN}/platforms`,
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Degrees of Freedom', value: activeRobot.specs.dof },
        { '@type': 'PropertyValue', name: 'Peak Torque', value: activeRobot.specs.peakTorque },
        { '@type': 'PropertyValue', name: 'AI Compute', value: activeRobot.specs.computePower },
        { '@type': 'PropertyValue', name: 'Rated Payload', value: activeRobot.specs.payload },
        {
          '@type': 'PropertyValue',
          name: 'Pose Repeatability',
          value: activeRobot.specs.repeatability,
        },
        {
          '@type': 'PropertyValue',
          name: 'Comms Protocol',
          value: activeRobot.specs.commsProtocol,
        },
      ],
    });

    if (selectedWhitepaper) {
      graphNodes.push({
        '@type': 'TechArticle',
        '@id': `${SITE_ORIGIN}/research#${selectedWhitepaper.id}`,
        headline: selectedWhitepaper.title,
        articleSection: selectedWhitepaper.category,
        abstract: selectedWhitepaper.abstract,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      });
    }

    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graphNodes,
    });
  }, [activePage, selectedRobotId, selectedWhitepaper, lightboxPhoto]);

  return null;
};
