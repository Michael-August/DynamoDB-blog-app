import { Metadata } from "next";
import dynamic from "next/dynamic";
import React from "react";

const Tags = dynamic(() => import('@/components/Tag'), { ssr: false })

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
    // Replace this with your actual base URL logic
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const decodedTag = params.tag ? decodeURIComponent(params.tag as string) : "";

    return {
        title: decodedTag,
        description: 'Home for all DevOps, AWS and Cloud-native Content',
        keywords: [decodedTag],
        alternates: { canonical: `${baseUrl}/blog/tags/${decodedTag}` },
        robots: { index: true, follow: true },
        authors: [{ name: "Ewere Diagboya"  }],
        openGraph: {
            title: decodedTag,
            description: "Home for all DevOps, AWS and Cloud-native Content",
            url: `${baseUrl}/blog/tags/${decodedTag}`,
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
            title: decodedTag,
            description: "Home for all DevOps, AWS and Cloud-native Content",
            images: [
                {
                    url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images",
                    width: 1200,
                    height: 630,
                    alt: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images",
                },
            ],
        },
    };
}

const TagPage = () => {

    return (
        <>
            <Tags />
        </>
    );
};

export default TagPage;
