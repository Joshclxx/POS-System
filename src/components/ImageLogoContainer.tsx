"use client";

import Image from "next/image";

type ImageLogoProps = {
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
};

const ImageLogoContainer: React.FC<ImageLogoProps> = ({
  src,
  alt,
  label,
  width = 42,
  height = 42,
}) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width, height }} className="relative">
        <Image src={src} alt={alt} fill className="object-contain" />
      </div>
      <p className="text-sm text-tertiary">{label}</p>
    </div>
  );
};

export default ImageLogoContainer;
