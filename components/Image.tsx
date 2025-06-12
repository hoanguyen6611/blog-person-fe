"use client";
import { Image } from "@imagekit/next";

type ImageShowProps = {
  src: string;
  width?: number;
  height?: number;
  alt: string;
  className: string;
};
const ImageShow = ({ src, width, height, alt, className }: ImageShowProps) => {
  const srcImage = "featured4.jpg";
  const altImage = "Error Image";
  return (
    <Image
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      src={src || srcImage}
      width={width}
      height={height}
      alt={alt || altImage}
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
