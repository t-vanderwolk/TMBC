"use client";

import { useEffect, useRef } from "react";

import {
  BLOG_ANALYTICS_ENDPOINT,
  BLOG_SCROLL_THRESHOLDS,
  BLOG_SESSION_COOKIE,
} from "@/lib/constants/blogAnalytics";

type BlogAnalyticsTrackerProps = {
  slug: string;
  sourceContext?: string | null;
};

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

const COOKIE_OPTIONS = `Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;

const readCookie = (name: string) => {
  const match = document.cookie
    .split(";")
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split("=")[1] ?? "");
};

const ensureSessionId = () => {
  const existing = readCookie(BLOG_SESSION_COOKIE);
  if (existing) return existing;

  const randomValue =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  document.cookie = `${BLOG_SESSION_COOKIE}=${encodeURIComponent(randomValue)}; ${COOKIE_OPTIONS}`;
  return randomValue;
};

const sendAnalytics = (endpoint: string, payload: Record<string, unknown>, useBeacon = false) => {
  const body = JSON.stringify(payload);
  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    keepalive: useBeacon,
  }).catch(() => {
    /* Intentionally swallow analytics errors */
  });
};

const determineBucket = (durationMs: number) => {
  if (durationMs < 30 * 1000) return "<30s";
  if (durationMs < 90 * 1000) return "30-90s";
  return "90s+";
};

export default function BlogAnalyticsTracker({ slug, sourceContext }: BlogAnalyticsTrackerProps) {
  const sessionIdRef = useRef<string>();
  const timeSentRef = useRef(false);
  const startRef = useRef(Date.now());
  const scrollThresholdsRef = useRef(new Set<number>());

  useEffect(() => {
    sessionIdRef.current = ensureSessionId();
    const sessionPayload = {
      slug,
      event: "blog_view",
      sessionId: sessionIdRef.current,
      sourceContext: sourceContext ?? undefined,
    };
    sendAnalytics(BLOG_ANALYTICS_ENDPOINT, sessionPayload);
  }, [slug, sourceContext]);

  useEffect(() => {
    const thresholds = new Set(BLOG_SCROLL_THRESHOLDS);
    scrollThresholdsRef.current = new Set();

    const handleScroll = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      const percent = Math.min(100, Math.round((scrollBottom / total) * 100));
      thresholds.forEach((threshold) => {
        if (percent >= threshold && !scrollThresholdsRef.current.has(threshold)) {
          scrollThresholdsRef.current.add(threshold);
          sendAnalytics(BLOG_ANALYTICS_ENDPOINT, {
            slug,
            event: "blog_scroll_depth",
            depth: threshold,
            sessionId: sessionIdRef.current,
          });
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [slug]);

  useEffect(() => {
    const recordTimeEvent = (useBeacon = false) => {
      if (timeSentRef.current) return;
      const durationMs = Date.now() - startRef.current;
      sendAnalytics(
        BLOG_ANALYTICS_ENDPOINT,
        {
          slug,
          event: "time_on_page",
          bucket: determineBucket(durationMs),
          sessionId: sessionIdRef.current,
        },
        useBeacon,
      );
      timeSentRef.current = true;
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        recordTimeEvent(true);
      }
    };

    const handlePageHide = () => {
      recordTimeEvent(true);
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      recordTimeEvent();
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [slug]);

  return null;
}
