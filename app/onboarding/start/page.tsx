import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { INVITE_COOKIE_NAME } from "@/lib/constants/invite";
import { validateInviteCode } from "@/lib/services/server/onboarding.service";

export default async function OnboardingStartPage() {
  const inviteCode = cookies().get(INVITE_COOKIE_NAME)?.value?.trim().toUpperCase();

  if (!inviteCode) {
    redirect("/?invite_error=1");
  }

  try {
    await validateInviteCode(inviteCode);
  } catch {
    redirect("/?invite_error=1");
  }

  redirect("/onboarding");
}
