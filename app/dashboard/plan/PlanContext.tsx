"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { PlanWorkspaceData } from "@/types/plan";

const PlanDataContext = createContext<PlanWorkspaceData | undefined>(undefined);

export function PlanContextProvider({ value, children }: { value: PlanWorkspaceData; children: ReactNode }) {
  return <PlanDataContext.Provider value={value}>{children}</PlanDataContext.Provider>;
}

export function usePlanContext() {
  const context = useContext(PlanDataContext);
  if (!context) {
    throw new Error("PlanContext must be used within a PlanContextProvider");
  }
  return context;
}
