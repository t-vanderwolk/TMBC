"use client";

import { ReactNode } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

type MentorLayoutProps = {
  children: ReactNode;
};

export default function MentorLayout({ children }: MentorLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={["MENTOR", "ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}
