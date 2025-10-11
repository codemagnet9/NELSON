import { cva } from "class-variance-authority"

export const linkVariants = cva(
  "text-sm font-medium transition-colors hover:text-foreground",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)