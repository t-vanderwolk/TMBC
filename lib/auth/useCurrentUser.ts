"use client";

import { useEffect, useState } from "react";

import type { StoredUser } from "@/lib/auth";
import { getStoredUser } from "@/lib/auth";

export function useCurrentUser(): StoredUser | null {
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setStoredUser(getStoredUser());
  }, []);

  return storedUser;
}
