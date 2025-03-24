import React, { JSX } from "react";
import classNames from "classnames";

type ButtonProps = {
  variant:
    | "navbar"
    | "primary"
    | "dine-out"
    | "total"
    | "pay"
    | "queue"
    | "clear"
    | "size"
    | "largeSize"
    | "order-navbar"
    | "btn-size";
  isActive?: boolean;
  icon?: string;
  className?: string;
  children: JSX.Element | string;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({
  variant,
  isActive,
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  //   BUTTON SWITCH
  switch (variant) {
    case "navbar":
      className +=
        "relative container bg-primary text-center text-[14px] font-semibold";
      break;
    case "primary":
      className +=
        "relative w-[212px] h-[60px] text-lg font-medium transition-all duration-300 bg-primary text-tertiary";
      break;
    case "dine-out":
      className +=
        "relative w-[218] h-[60px] text-lg font-medium transition-all duration-300 bg-colorBlue text-tertiary";
      break;
    case "total":
      className +=
        "relative text-left w-[200px] h-[60px] text-lg font-medium transition-all duration-300 bg-primary text-tertiary";
      break;
    case "pay":
      className +=
        "relative w-[145px] h-[60px] text-lg font-medium transition-all duration-300 bg-colorGreen text-tertiary";
      break;
    case "clear":
      className +=
        "relative w-[220px] h-[57px] text-lg font-medium transition-all duration-300 bg-colorRed rounded-[4px] text-tertiary";
      break;
    case "size":
      className +=
        "container bg-secondaryGray w-[180px] h-[22px] text-primary text-[12px] font-medium text-left rounded-[4px]";
      break;
    case "largeSize":
      className +=
        "container bg-secondaryGray w-[278.39px] h-[22px] text-primary text-[12px] font-medium text-left rounded-[4px]";
      break;
    case "order-navbar":
      className += `relative container text-center text-[14px] font-semibold ${
        isActive ? "bg-[#ff8800] text-tertiary" : "bg-primary text-tertiary"
      }`;
      break;
    case "btn-size":
      className += `relative container w-[22px] h-[22px] text-[12px] font-medium text-center rounded-full transition-colors duration-200 ease-in-out mb-2 flex justify-center items-center ${
        isActive
          ? "bg-colorOrange text-colorDirtyWhite border border-primary"
          : "bg-primaryGray text-primary border-1 border-primary hover:bg-colorOrange"
      }`;
      break;

    default:
      className += " bg-gray-500 text-white";
  }

  return (
    <button
      type="button"
      className={classNames(
        className,
        "cursor-pointer hover:scale-105 transition-all py-1 px-4 z-10"
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
