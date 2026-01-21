export function getBearerToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem("tm_token") ||
    window.localStorage.getItem("tmbc_token") ||
    null
  );
}

export async function authedFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getBearerToken();
  const headers = new Headers(init.headers ?? {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  headers.set("Content-Type", "application/json");

  return fetch(input, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}
