"use server";

import { redirect } from "next/navigation";

import QuestionnaireRunner from "@/components/onboarding/QuestionnaireRunner";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { PUBLIC_LOGIN_ROUTE, routeForRole } from "@/lib/auth/routeForRole";

export default async function QuestionnairePage() {
  let user;
  try {
    user = await getUserOrThrow();
  } catch {
    redirect(PUBLIC_LOGIN_ROUTE);
    return null;
  }

  if (!user.profileCompleted) {
    redirect("/verify-invite");
  }

  if (user.onboardingComplete) {
    redirect(routeForRole(user.role));
  }

  return <QuestionnaireRunner userId={user.id} />;
}
