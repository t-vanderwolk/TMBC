import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "../lib/cn";

export type TMCardProps = ViewProps & {
  className?: string;
  children: React.ReactNode;
};

const TMCard = React.forwardRef<View, TMCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "rounded-2xl bg-ivory border border-mauve/20 shadow-soft p-5",
          className
        )}
        {...props}
      >
        {children}
      </View>
    );
  }
);

TMCard.displayName = "TMCard";

export default TMCard;
