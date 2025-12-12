"use client";

import type { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

type MentorLayoutProps = {
  children: ReactNode;
};

export default function MentorLayout({ children }: MentorLayoutProps) {
  return <ProtectedRoute allow={["MENTOR"]}>{children}</ProtectedRoute>;
}
