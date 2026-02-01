"use server";

import { redirect } from "next/navigation";

export default async function CommunityRedirectionPage() {
  redirect("/dashboard/member/community");
}
