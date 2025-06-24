
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
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-green-900/30 border border-green-400/30 shadow-inner">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/20" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-7 w-4 rounded-lg border-2 border-green-400 bg-gradient-to-b from-green-50 to-green-100 shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gradient-to-b hover:from-green-100 hover:to-green-200 hover:border-green-300 hover:shadow-xl hover:shadow-green-400/30 hover:scale-110" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
