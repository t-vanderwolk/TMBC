"use client";

// Legacy route: use /dashboard/member/messages instead.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function MessageThreadPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/member/messages");
  }, [router]);

  return (
    <div className="flex items-center justify-center rounded-[28px] border border-[#E3C6D4] bg-white/80 p-6 text-sm text-[#3E2F35]/70 shadow-[0_16px_50px_rgba(180,143,164,0.2)]">
      Legacy messages thread. Redirecting you to Messages...
    </div>
  );
}
