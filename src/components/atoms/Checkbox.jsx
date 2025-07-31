import React from "react"
import { cn } from "@/utils/cn"

const Checkbox = React.forwardRef(({ 
  className, 
  label, 
  id, 
  checked = false, 
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          "h-4 w-4 rounded border border-gray-600 bg-surface text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        ref={ref}
        {...props}
      />
      {label && (
        <label 
          htmlFor={checkboxId} 
          className={cn(
            "text-sm font-medium text-white cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox