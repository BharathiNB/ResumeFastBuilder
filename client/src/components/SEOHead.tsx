import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

export default function SEOHead({ 
  title = "ResumeFast | Free Online Resume Builder",
  description = "Create professional resumes online with ResumeFast. 100% free resume builder to download resume in PDF format.",
  keywords = "free resume builder, online resume, professional resume, resume maker, CV builder, resume templates",
  canonical
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="ResumeFast" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ResumeFast" />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Structured Data for Resume Builder */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "ResumeFast",
          "description": description,
          "url": "https://resumefast.com",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Free Resume Builder",
            "Professional Templates",
            "PDF Download",
            "Google Authentication",
            "Real-time Preview"
          ]
        })}
      </script>
    </Helmet>
  );
}
