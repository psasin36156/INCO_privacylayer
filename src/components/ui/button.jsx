import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-neon hover:shadow-neon-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 shadow-neon",
    ghost: "hover:bg-primary/10 text-primary",
    link: "text-primary underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-9 px-3",
    lg: "h-12 px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

