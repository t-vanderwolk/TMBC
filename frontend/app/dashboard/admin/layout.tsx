"use client";

import { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

type DashboardAdminLayoutProps = {
  children: ReactNode;
};

export default function DashboardAdminLayout({ children }: DashboardAdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}
