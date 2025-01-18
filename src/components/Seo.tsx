import Head from "next/head";
import config from "../../config";

interface SEOProps {
  description: string;
  title: string;
  image?: string;
  slug: string;
  article?: boolean;
}

export default function SEO({
  description,
  title,
  image,
  slug,
  article = false,
}: SEOProps) {
  const {
    originalTitle,
    originalDescription,
    siteName,
    social: { twitter },
    currentURL,
    originalImage,
  } = config;

  const seoTitle = title ? `${title} | ${originalTitle}` : originalTitle;
  const seoDescription = description || originalDescription;
  const seoImage = image || originalImage;
  const seoUrl = `${currentURL}/${slug}`;

  return (
    <Head>
      {/* General Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="image" content={seoImage} />

      {/* Canonical Link */}
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Metadata */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Structured Data for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": article ? "Article" : "WebPage",
            headline: title,
            description: seoDescription,
            image: seoImage,
            url: seoUrl,
            publisher: {
              "@type": "Organization",
              name: siteName,
            },
            author: {
              "@type": "Person",
              name: "Ewere Diagboya", // Optional: Use author's name
            },
          }),
        }}
      />
    </Head>
  );
}
