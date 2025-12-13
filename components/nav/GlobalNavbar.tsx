"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredUser, clearSession } from "@/lib/auth";
import { PUBLIC_LOGIN_ROUTE, routeForRole } from "@/lib/auth/routeForRole";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

async function fetchUnreadCounts(token: string | null) {
  if (!token) return { messages: 0, community: 0, invites: 0 };
  return {
    messages: 3,
    community: 1,
    invites: 2,
  };
}

export default function GlobalNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState({ messages: 0, community: 0, invites: 0 });
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    fetchUnreadCounts(stored?.token ?? null).then(setUnread);
  }, []);

  const totalUnread = unread.messages + unread.community + unread.invites;

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const role = user?.role?.toUpperCase() ?? null;
  const dashboardLink = role ? routeForRole(role) : PUBLIC_LOGIN_ROUTE;

  return (
    <nav className="w-full border-b border-[#EAD4D8]/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl text-[#3E2F35] hover:text-[#C8A1B4] transition">
          Taylor-Made Baby Co.
        </Link>
        <div className="flex items-center gap-6 text-sm">
          {!user && (
            <>
              <Link href="/how-it-works" className="text-[#3E2F35]/70 hover:text-[#C8A1B4]">
                How it works
              </Link>
              <Link href="/membership" className="text-[#3E2F35]/70 hover:text-[#C8A1B4]">
                Membership
              </Link>
              <Link href={PUBLIC_LOGIN_ROUTE} className="rounded-full bg-[#C8A1B4] px-4 py-2 text-white hover:bg-[#b88ca3]">
                Log In
              </Link>
            </>
          )}
          {user && (
            <>
              <Link href={dashboardLink} className="text-[#3E2F35] hover:text-[#C8A1B4]">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown((prev) => !prev)}
                  className="relative rounded-full p-2 hover:bg-[#F4E6EA] transition"
                >
                  <Bell className="w-5 h-5 text-[#3E2F35]" />
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C8A1B4] text-[0.6rem] text-white">
                      {totalUnread}
                    </span>
                  )}
                </button>
                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#EAD4D8] bg-white/90 shadow-xl backdrop-blur-sm p-4 space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#C8A1B4]">Notifications</p>
                    {role === "ADMIN" && (
                      <Link
                        href="/dashboard/admin/invites"
                        className="block rounded-lg p-2 hover:bg-[#F8EFF2] text-sm text-[#3E2F35]"
                      >
                        Pending Invite Requests{" "}
                        {unread.invites > 0 && (
                          <span className="ml-2 rounded-full bg-[#C8A1B4] px-2 py-[1px] text-white text-xs">
                            {unread.invites}
                          </span>
                        )}
                      </Link>
                    )}
                    <Link
                      href="/dashboard/member/messages"
                      className="block rounded-lg p-2 hover:bg-[#F8EFF2] text-sm text-[#3E2F35]"
                    >
                      Messages{" "}
                      {unread.messages > 0 && (
                        <span className="ml-2 rounded-full bg-[#C8A1B4] px-2 py-[1px] text-white text-xs">
                          {unread.messages}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/dashboard/member/community"
                      className="block rounded-lg p-2 hover:bg-[#F8EFF2] text-sm text-[#3E2F35]"
                    >
                      Community Updates{" "}
                      {unread.community > 0 && (
                        <span className="ml-2 rounded-full bg-[#C8A1B4] px-2 py-[1px] text-white text-xs">
                          {unread.community}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#E8D1D9] px-4 py-2 text-[#3E2F35] hover:bg-[#d9bcc7]"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
