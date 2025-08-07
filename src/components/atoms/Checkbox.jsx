import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  label,
  checked,
  onChange,
  ...props 
}, ref) => {
  return (
    <label className="inline-flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
            checked
              ? "bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-500"
              : "border-gray-300 bg-white hover:border-primary-400",
            className
          )}
        >
          {checked && (
            <ApperIcon 
              name="Check" 
              size={14} 
              className="text-white" 
            />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;