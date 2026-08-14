import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-500/20 text-indigo-300",
        secondary: "border-transparent bg-gray-600/50 text-gray-300",
        destructive: "border-transparent bg-red-500/20 text-red-300",
        success: "border-transparent bg-green-500/20 text-green-300",
        warning: "border-transparent bg-yellow-500/20 text-yellow-300",
        outline: "border-gray-600 text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
