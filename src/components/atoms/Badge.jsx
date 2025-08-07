import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800",
    free: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    member: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    master: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800",
    both: "bg-gradient-to-r from-indigo-100 to-pink-200 text-indigo-800",
    admin: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;