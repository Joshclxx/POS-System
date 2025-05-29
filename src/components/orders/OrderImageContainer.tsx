// ImageContainer is a reusable component designed for simplicity and flexibility.
// It can be easily imported and integrated into other components,
// allowing customization through props for dynamic rendering and consistent styling.

"use client";

import Image from "next/image";
import Button from "../Button";

type OrderImageContainerProps = {
  imageSrc: string;
  imageAlt: string;
  imageTitle?: string;
  imagePrice?: {
    PT: number;
    RG: number;
    GR: number;
  };
  className?: string;
  imageHeight: number;
  imageWidth: number;
  selectedSize: "PT" | "RG" | "GR";
  onSizeChange: (size: "PT" | "RG" | "GR") => void;
};

const OrderImageContainer: React.FC<OrderImageContainerProps> = ({
  imageSrc,
  imageAlt,
  imageTitle,
  imagePrice,
  className,
  imageHeight,
  imageWidth,
  selectedSize,
  onSizeChange,
}) => {
  const getPrice = () => {
    if (!imagePrice) return 0;

    // Use selectedSize if defined, otherwise return the first available price
    if (selectedSize && imagePrice[selectedSize] !== undefined) {
      return imagePrice[selectedSize];
    }

    // Fallback: first price in the object
    const firstPriceKey = Object.keys(imagePrice)[0] as keyof typeof imagePrice;
    return imagePrice[firstPriceKey] || 0;
  };

  return (
    <div
      className={`flex flex-col items-center text-center w-full ${
        className || ""
      }`}
    >
      <div
        className="relative"
        style={{ width: imageWidth, height: imageHeight }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="object-contain"
        />
      </div>

      {imageTitle && (
        <h3 className="text-title hover-trans mt-2">{imageTitle}</h3>
      )}

      {imagePrice && (
        <p className="item-price text-center mt-1">{`₱ ${getPrice().toFixed(
          2
        )}`}</p>
      )}

      <div className="container bg-primary w-full h-[40px] flex items-center justify-center ">
        <div className="flex justify-center gap-2 mt-1 text-center">
          <Button
            variant="btn-size"
            isActive={selectedSize === "PT"}
            onClick={() => onSizeChange("PT")}
          >
            PT
          </Button>
          <Button
            variant="btn-size"
            isActive={selectedSize === "RG"}
            onClick={() => onSizeChange("RG")}
          >
            RG
          </Button>
          <Button
            variant="btn-size"
            isActive={selectedSize === "GR"}
            onClick={() => onSizeChange("GR")}
          >
            GR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderImageContainer;
