"use client";

import React from "react";
import Image from "next/image";

type OrderImageContainerProps = {
  imageSrc: string;
  imageAlt: string;
  imageTitle?: string;
  imagePrice?: string;
  className?: string;
  imageHeight: number;
  imageWidth: number;
};

const OrderImageContainer: React.FC<OrderImageContainerProps> = ({
  imageSrc,
  imageAlt,
  imageTitle,
  className,
}) => {
  return (
    <div className={`flex flex-col text-left w-full ${className || ""}`}>
      <div className="relative w-[120px] h-[120px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={120}
          height={120}
          className="object-contain hover-trans"
        />
      </div>

      {/* MENU TITLE */}
      <div className="text-left mt-2">
        <h3 className="text-title hover-trans">{imageTitle}</h3>
      </div>
    </div>
  );
};

export default OrderImageContainer;
