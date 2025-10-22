import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { cn } from "../lib/cn";

type TMButtonProps = {
  title: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
} & React.ComponentProps<typeof TouchableOpacity>;

const TMButton = ({
  title,
  variant = "primary",
  className = "",
  ...props
}: TMButtonProps) => {
  const base = "rounded-full py-3 px-6 font-nunito text-center shadow-sm";
  const style =
    variant === "primary"
      ? "bg-mauve text-ivory"
      : variant === "secondary"
      ? "bg-blush text-charcoal"
      : "border border-mauve text-mauve";

  return (
    <TouchableOpacity className={cn(`${base} ${style} ${className}`)} {...props}>
      <Text className="font-nunito font-semibold text-center">{title}</Text>
    </TouchableOpacity>
  );
};

TMButton.displayName = "TMButton";

export default TMButton;
