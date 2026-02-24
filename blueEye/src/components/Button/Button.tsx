import React from "react";
import type { ButtonProps } from "../../types/types";

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const base = "px-6 py-3 rounded-2xl font-semibold transition-all";
  const styles = {
    default: "bg-blue-600 hover:bg-blue-500 text-white",
    outline: "border border-neutral-700 hover:bg-neutral-800 text-black",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};
