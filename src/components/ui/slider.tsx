
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-amber-100/60 border border-amber-200/50 shadow-inner">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-7 w-4 rounded-lg border-2 border-amber-300 bg-gradient-to-b from-white to-amber-50 shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gradient-to-b hover:from-amber-50 hover:to-amber-100 hover:border-amber-400 hover:shadow-xl hover:scale-110" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
