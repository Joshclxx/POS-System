"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button";

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div
      className={`flex flex-col items-center text-center w-full ${
        className || ""
      }`}
    >
      <div className="relative w-[120px] h-[120px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={120}
          height={120}
          className="object-contain hover-trans"
        />
      </div>

      {imageTitle && (
        <h3 className="text-title hover-trans mt-2">{imageTitle}</h3>
      )}

      {/* SIZE BUTTONS */}
      <div className="flex justify-center gap-2 mt-4 text-center">
        <Button
          variant="btn-size"
          isActive={selectedSize === "R"}
          onClick={() => setSelectedSize("R")}
        >
          R
        </Button>
        <Button
          variant="btn-size"
          isActive={selectedSize === "M"}
          onClick={() => setSelectedSize("M")}
        >
          M
        </Button>
        <Button
          variant="btn-size"
          isActive={selectedSize === "L"}
          onClick={() => setSelectedSize("L")}
        >
          L
        </Button>
      </div>
    </div>
  );
};

export default OrderImageContainer;
