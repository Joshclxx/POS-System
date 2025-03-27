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
    | "btn-size"
    | "feature"
    | "view-btn"
    | "view-dlt"
    | "cancel"
    | "add"
    | "view-qty";
  isActive?: boolean;
  icon?: string;
  className?: string;
  children: JSX.Element | string;
  onClick?: () => void;
  disabled?: boolean;
  isSave?: boolean;
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
        "relative container w-[120px] bg-primary text-center text-[14px] font-semibold";
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
        "relative text-left w-[145px] h-[60px] text-lg font-medium transition-all duration-300 bg-primary text-tertiary";
      break;
    case "pay":
      className +=
        " relative h-[60px] text-lg font-medium transition-all duration-300 " +
        (props.disabled
          ? "bg-[#18773c] text-tertiary cursor-not-allowed"
          : "bg-colorGreen text-tertiary hover:brightness-95");
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
        isActive ? "bg-[#ff8800] text-primary" : "bg-primary text-tertiary"
      }`;
      break;
    case "btn-size":
      className += `relative container w-[22px] h-[22px] text-[12px] font-medium text-center rounded-full transition-colors duration-200 ease-in-out mb-2 flex justify-center items-center ${
        isActive
          ? "bg-colorOrange text-primary font-semibold border-2 border-colorDirtyWhite"
          : "bg-primaryGray text-primary border-1 border-primary hover:bg-colorOrange"
      }`;
      break;
    case "feature":
      className +=
        "relative container bg-secondaryGray h-[52px] text-primary text-center text-[14px] font-semibold rounded-lg";
      break;
    case "view-dlt":
      className += `relative w-[106px] h-[60px] text-lg font-medium transition-all duration-300 ${
        props.isSave ? "bg-[#d32f2f] text-white" : "bg-primary text-tertiary"
      }`;
      break;
    case "view-qty":
      className += `relative w-[106px] h-[60px] text-lg font-medium transition-all duration-300 ${
        props.isSave ? "bg-[#6dbe45] text-white" : "bg-primary text-tertiary"
      }`;
      break;
    case "cancel":
      className +=
        " relative text-lg font-medium text-white transition-all duration-300 text-color2 bg-[#8F1600] rounded-lg";
      break;
    case "add":
      className +=
        " relative text-lg font-medium text-white transition-all duration-300 text-color2 bg-[#00A652] rounded-lg";
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
