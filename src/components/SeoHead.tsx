import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, path }) => {
  // Canonical domain (match Netlify primary + netlify.toml redirects)
  const domain = 'https://kalpixa.com';

  // Normalize path to avoid double slashes or missing leading slash
  const normalizedPath =
    !path || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  const url = `${domain}${normalizedPath}`;
  const fullTitle = `${title} | Kalpixa Web Studio`;
  const ogImage = `${domain}/og-image.jpg`;

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kalpixa Web Studio" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kalpixa" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SeoHead;
