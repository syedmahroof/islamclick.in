import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 transition-colors overflow-auto",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-600 text-white [a&]:hover:bg-amber-700 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600",
        secondary:
          "border-transparent bg-amber-100 text-amber-800 [a&]:hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:hover:bg-amber-900/50",
        destructive:
          "border-transparent bg-red-600 text-white [a&]:hover:bg-red-700 focus-visible:ring-red-500 dark:focus-visible:ring-red-400",
        outline:
          "text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 [a&]:hover:bg-gray-100 [a&]:hover:text-gray-900 dark:[a&]:hover:bg-gray-800 dark:[a&]:hover:text-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
