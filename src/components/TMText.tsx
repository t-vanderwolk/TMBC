import React from "react";
import { Text, TextProps } from "react-native";

type TMTextProps = TextProps & {
  children: React.ReactNode;
  className?: string;
};

export default function TMText({ children, className, ...props }: TMTextProps) {
  return (
    <Text className={`text-charcoal ${className ?? ""}`} {...props}>
      {children}
    </Text>
  );
}
