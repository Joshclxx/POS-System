"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button";

type OrderImageContainerProps = {
  imageSrc: string;
  imageAlt: string;
  imageTitle?: string;
  imagePrice?: number;
  className?: string;
  imageHeight: number;
  imageWidth: number;
};

const OrderImageContainer: React.FC<OrderImageContainerProps> = ({
  imageSrc,
  imageAlt,
  imageTitle,
  imagePrice,
  className,
  imageHeight,
  imageWidth,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div
      className={`flex flex-col items-center text-center w-full ${
        className || ""
      }`}
    >
      <div
        className={`relative`}
        style={{ width: imageWidth, height: imageHeight }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="object-contain hover-trans"
        />
      </div>

      {/* PRODUCT NAME */}
      {imageTitle && (
        <h3 className="text-title hover-trans mt-2">{imageTitle}</h3>
      )}

      {/* PRODUCT PRICE */}
      {imagePrice !== undefined && (
        <p className="item-price text-center mt-1">{`₱ ${imagePrice.toFixed(
          2
        )}`}</p>
      )}

      {/* BUTTON SIZE */}
      <div className="container bg-primary w-full h-[30px]">
        <div className="flex justify-center gap-2 mt-1 text-center">
          <Button
            variant="btn-size"
            isActive={selectedSize === "R"}
            onClick={() => setSelectedSize("R")}
          >
            PT
          </Button>
          <Button
            variant="btn-size"
            isActive={selectedSize === "M"}
            onClick={() => setSelectedSize("M")}
          >
            RG
          </Button>
          <Button
            variant="btn-size"
            isActive={selectedSize === "L"}
            onClick={() => setSelectedSize("L")}
          >
            GR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderImageContainer;
