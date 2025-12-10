"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <ProtectedRoute allow={["MENTOR"]}>{children}</ProtectedRoute>;
}
