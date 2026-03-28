"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-900 hover:border-primary-500 hover:text-primary-600",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 text-gray-900",
        link: "text-primary-600 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg",
        premium: "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transform hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      effect: {
        none: "",
        glow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]",
        bounce: "hover:animate-bounce",
        pulse: "animate-pulse",
        scale: "hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const PremiumButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, effect, loading, icon, iconPosition = "left", children, disabled, ...props }, ref) => {
    const MotionButton = motion.button;
    
    // Filter out motion-specific props to avoid conflicts
    const { whileHover, whileTap, transition, ...buttonProps } = props;
    
    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, effect, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: effect === "scale" ? 1.05 : 1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...buttonProps}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </MotionButton>
    );
  }
);

PremiumButton.displayName = "PremiumButton";

export { PremiumButton as Button, buttonVariants };
