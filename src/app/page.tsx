import { Metadata } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';


  return {
    title: "Home for all DevOps, AWS and Cloud-native Content",
    description: "Home for all DevOps, AWS and Cloud-native Content",
    keywords: ["DevOps", "Cloud"],
    alternates: { canonical: `${baseUrl}` },
    robots: { index: true, follow: true },
    authors: [{ name: "Ewere Diagboya"  }],
    openGraph: {
      title: "ewere.tech",
      description: "Home for all DevOps, AWS and Cloud-native Content",
      url: `${baseUrl}`,
      type: "website",
      images: [
          {
              url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images",
              width: 1200,
              height: 630,
              alt: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images",
          },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "ewere.tech",
      description: "Home for all DevOps, AWS and Cloud-native Content",
      images: ["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images"],
    },
  };
}

const BlogHome = dynamic(() => import('@/components/Home'), { ssr: false })

export default function Home() {
  return (
    <>
      <Head>
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/fallback" />
        </noscript>
      </Head>
      <BlogHome />
    </>
  );
}

