"use client";

import type { ReactNode } from "react";

type MentorLayoutProps = {
  children: ReactNode;
};

export default function MentorLayout({ children }: MentorLayoutProps) {
  return <>{children}</>;
}
