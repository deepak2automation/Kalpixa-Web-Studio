import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ title, description, path }) => {
  const domain = 'https://kalpixa.com';
  // Ensure path doesn't have double slash if path is '/'
  const url = path === '/' ? domain : `${domain}${path}`;
  
  return (
    <Helmet>
      <title>{title} | Kalpixa Web Studio</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SeoHead;