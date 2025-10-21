import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type TMButtonProps = PressableProps & {
  label: string;
  className?: string;
  textClassName?: string;
  variant?: ButtonVariant;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-mauve",
  secondary: "bg-gold",
  outline: "bg-transparent border border-mauve/40",
  ghost: "bg-transparent",
};

const textVariants: Record<ButtonVariant, string> = {
  primary: "text-ivory",
  secondary: "text-charcoal",
  outline: "text-mauve",
  ghost: "text-mauve",
};

export default function TMButton({
  label,
  className,
  textClassName,
  variant = "primary",
  disabled,
  ...props
}: TMButtonProps) {
  const buttonClass = `${
    buttonVariants[variant]
  } rounded-full px-6 py-3 flex-row items-center justify-center ${
    disabled ? "opacity-60" : ""
  } ${className ?? ""}`;

  const textClass = `${textVariants[variant]} text-base font-semibold text-center ${
    textClassName ?? ""
  }`;

  return (
    <Pressable
      className={buttonClass}
      accessibilityRole="button"
      disabled={disabled}
      {...props}
    >
      <Text className={textClass}>{label}</Text>
    </Pressable>
  );
}
