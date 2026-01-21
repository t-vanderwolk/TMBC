"use server";

import { redirect } from "next/navigation";

import { getUserOrThrow } from "@/lib/auth/getUser";

export default async function PlanRedirectionPage() {
  const user = await getUserOrThrow();

  if (user.role === "MENTOR") {
    redirect("/dashboard/plan/mentor");
  }

  if (user.role === "MEMBER") {
    redirect("/dashboard/plan/member");
  }

  redirect("/dashboard");
}
