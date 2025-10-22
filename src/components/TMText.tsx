import React from "react";
import { Text } from "react-native";
import { cn } from "../lib/cn";

type TMTextProps = {
  variant?: "heading" | "subheading" | "body";
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<typeof Text>;

const TMText = ({
  variant = "body",
  className = "",
  children,
  ...props
}: TMTextProps) => {
  const style =
    variant === "heading"
      ? "font-greatVibes text-4xl text-mauve text-center"
      : variant === "subheading"
      ? "font-playfair text-lg text-charcoal text-center"
      : "font-nunito text-base text-charcoal";

  return (
    <Text className={cn(`${style} ${className}`)} {...props}>
      {children}
    </Text>
  );
};

TMText.displayName = "TMText";

export default TMText;
