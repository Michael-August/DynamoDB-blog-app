// components/AdComponent.tsx
'use client';

import { useEffect } from 'react';

interface AdComponentProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
}

const AdComponent = ({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
}: AdComponentProps) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4182955591624539"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
    />
  );
};

export default AdComponent;
