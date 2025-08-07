import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, hover = true, ...props }, ref) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-200",
        hover && "hover:shadow-lg hover:border-gray-200 hover:-translate-y-1",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;