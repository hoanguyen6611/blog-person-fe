"use client";
import { Image } from "@imagekit/next";

type ImageShowProps = {
  src: string | "";
  width?: number;
  height?: number;
  alt: string;
  className: string;
};
const ImageShow = ({ src, width, height, alt, className }: ImageShowProps) => {
  return (
    <Image
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      src={src}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading="lazy"
      transformation={[
        {
          width: width,
          height: height,
        },
      ]}
    />
  );
};

export default ImageShow;
