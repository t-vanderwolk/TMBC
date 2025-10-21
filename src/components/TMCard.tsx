import React from "react";
import { View, ViewProps } from "react-native";

type TMCardProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
};

export default function TMCard({ children, className, ...props }: TMCardProps) {
  return (
    <View
      className={`rounded-3xl bg-white/80 border border-mauve/10 shadow-sm p-5 ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </View>
  );
}
