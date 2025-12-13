import { getUserOrThrow } from "@/lib/auth/getUser";
import { redirect } from "next/navigation";

const routeForMessages = (role?: string) => {
  const normalized = (role ?? "member").toLowerCase();
  if (normalized === "mentor") return "/dashboard/mentor/messages";
  return "/dashboard/member/messages";
};

export default async function MessagesRedirectPage() {
  try {
    const user = await getUserOrThrow();
    redirect(routeForMessages(user.role));
  } catch {
    redirect("/dashboard/member/messages");
  }
}
