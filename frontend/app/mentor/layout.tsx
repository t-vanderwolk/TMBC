"use client";

import type { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

type MentorLayoutProps = {
  children: ReactNode;
};

export default function MentorLayout({ children }: MentorLayoutProps) {
  return <ProtectedRoute allowed={["MENTOR"]}>{children}</ProtectedRoute>;
}
