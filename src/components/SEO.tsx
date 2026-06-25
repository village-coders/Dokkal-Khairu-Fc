import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  image?: string;
  url?: string;
  children?: React.ReactNode;
}

export default function SEO({ 
  title = "Dokkal Khairu FC - Ilé-Ifẹ̀'s Pride", 
  description = "Official website of Dokkal Khairu Football Club. The Khairu Boys - Ilé-Ifẹ̀'s Pride and Osun's Glory. Get the latest news, fixtures, and squad updates.", 
  type = "website",
  name = "Dokkal Khairu FC",
  image = "/dokkal-khairu-logo.jpg",
  url,
  children
}: SEOProps) {
  const siteUrl = import.meta.env.VITE_FRONTEND_URL || "https://dokkal-khairu-fc.vercel.app";
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={currentUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      
      {/* Custom injected tags (e.g., JSON-LD) */}
      {children}
    </Helmet>
  );
}
