"use client";

import { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

type DashboardMentorLayoutProps = {
  children: ReactNode;
};

export default function DashboardMentorLayout({ children }: DashboardMentorLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}
