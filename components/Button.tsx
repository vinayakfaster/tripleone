"use client";

import React from "react";
import { IconType } from "react-icons";

type Props = {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  isColor?: boolean;
};

function Button({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  isColor,
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full
  ${outline ? "bg-white" : "bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600"}
  ${outline ? "border-black" : "border-transparent"} 
  ${outline ? "text-black" : "text-white"} 
  ${small ? "text-sm" : "text-md"} 
  ${small ? "py-1" : "py-3"} 
  ${small ? "font-light" : "font-semibold"} 
  ${small ? "border-[1px]" : "border-2"}`}
    >
      {Icon && (
        <Icon
          size={24}
          className={`absolute left-4 top-3 ${isColor && "text-blue-600"}`}
        />
      )}
      {label}
    </button>
  );
}

export default Button;
