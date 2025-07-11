import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
        touch: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 active:scale-95 touch:text-3xl",
        "touch-outline": "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-95 touch:text-3xl touch:border-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        touch: "h-12 px-8 py-4 sm:h-14 sm:px-10 sm:py-5 lg:h-16 lg:px-12 lg:py-6 touch:h-20 touch:px-16 touch:py-8 text-lg sm:text-xl lg:text-2xl touch:text-3xl rounded-xl min-h-[44px] sm:min-h-[48px] touch:min-h-[64px]",
        "touch-lg": "h-16 px-12 py-6 sm:h-18 sm:px-16 sm:py-8 lg:h-20 lg:px-20 lg:py-10 touch:h-24 touch:px-24 touch:py-12 text-xl sm:text-2xl lg:text-3xl touch:text-4xl rounded-2xl min-h-[56px] sm:min-h-[64px] touch:min-h-[80px]",
        "touch-icon": "h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 touch:h-20 touch:w-20 rounded-xl [&_svg]:size-6 touch:[&_svg]:size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
