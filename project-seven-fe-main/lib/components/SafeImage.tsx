'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

interface SafeImageProps extends ImageProps {
  fallback: string;
  alt: string; // Make alt mandatory
}

const SafeImage = ({ fallback, src: srcProp, ...rest }: SafeImageProps) => {
  const [src, setSrc] = useState(srcProp === '' ? null : srcProp); // Explicitly set to null if empty string

  useEffect(() => {
    setSrc(srcProp === '' ? null : srcProp); // Explicitly set to null if empty string
  }, [srcProp]);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...rest} src={src} onError={() => setSrc(fallback)} />;
};

export default SafeImage;
