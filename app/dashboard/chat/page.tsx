"use client";

// Legacy route: use /dashboard/member/messages or /dashboard/mentor/messages instead.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/messages");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center rounded-3xl border border-white/70 bg-white/80 p-6 text-sm text-tmCharcoal/70 shadow-soft">
      Legacy chat route. Redirecting you to Messages...
    </div>
  );
}
