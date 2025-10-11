"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 bg-border", className)}
    {...props}
  >
    <div className="w-full h-px bg-border" />
  </div>
))
Separator.displayName = "Separator"

export { Separator }