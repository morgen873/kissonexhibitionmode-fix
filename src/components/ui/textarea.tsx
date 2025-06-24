
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-green-400/30 bg-green-900/20 px-3 py-2 text-sm text-green-100 placeholder:text-green-500 focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-inner font-mono",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
