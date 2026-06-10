import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "teal" | "green" | "yellow" | "gray";
  rounded?: "sm" | "md";
}

export function Badge({
  className,
  variant = "gray",
  rounded = "sm",
  ...props
}: BadgeProps) {
   
 
const variants = {
    teal: "bg-teal text-white",
    green: "bg-green/10 text-green", // Wait, #D1FAE5 is light green, text #065F46
    yellow: "bg-yellow/20 text-yellow", // #FEF3C7 and yellow text
    gray: "bg-gray-100 text-gray-600",
  };

  const exactVariants = {
    teal: "bg-teal text-white",
    green: "bg-[#D1FAE5] text-[#065F46]",
    yellow: "bg-[#FEF3C7] text-yellow",
    gray: "bg-[#F3F4F6] text-gray-600",
  };

  const roundedStyles = {
    sm: "rounded", // 4px
    md: "rounded-md", // 6px
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-bold",
        exactVariants[variant],
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
}
