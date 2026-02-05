"use client";

import { useEffect, useState } from "react";

type Logo = {
  id: string;
  name: string;
  src: string;
  alt: string;
};

const formatAlt = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const createLogoId = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

const SUPPORTED_IMAGE_EXTENSIONS = /\.(png|jpe?g|svg|webp|avif)$/i;

/**
 * TMBC Partner Logo Rules:
 * - Logos are NEVER manually recolored.
 * - Idle state uses blush-tinted grayscale via CSS filters.
 * - Full brand color is revealed on hover/focus only.
 * - Keep motion slow and subtle to preserve editorial calm.
 */
export default function PartnerLogoCarousel() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isCompactView, setIsCompactView] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/logos")
      .then((response) => response.json())
      .then((files: string[]) => {
        if (!isMounted) return;
        const mapped = files
          .filter((fileName) => SUPPORTED_IMAGE_EXTENSIONS.test(fileName))
          .map((fileName) => ({
            id: createLogoId(fileName),
            name: fileName,
            src: `/api/logos/${encodeURIComponent(fileName)}`,
            alt: formatAlt(fileName),
          }))
          .sort((a, b) => a.id.localeCompare(b.id));
        const MAX_VISIBLE_LOGOS = 10;
        setLogos(mapped.slice(0, MAX_VISIBLE_LOGOS));
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsCompactView(event.matches);
    };
    handleChange(query);
    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
    } else {
      query.addListener(handleChange);
    }
    return () => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handleChange);
      } else {
        query.removeListener(handleChange);
      }
    };
  }, []);

  const visibleLogos = isCompactView ? logos.slice(0, 6) : logos;

  return (
    <div className="py-12 sm:py-16 space-y-6 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60 mx-auto">
        Only Partnered With the Best
      </p>
      <p className="mb-6 text-sm text-muted-foreground text-center">
        Only partnered with brands our mentors actually trust.
      </p>
      {logos.length ? (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {visibleLogos.map((logo) => (
              <div key={logo.id} className="flex h-16 items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-10 w-auto opacity-60 grayscale transition-all duration-300 motion-safe:hover:opacity-100 motion-safe:hover:grayscale-0"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Brands we trust — and recommend thoughtfully.
          </p>
        </>
      ) : (
        <div className="h-16" aria-hidden />
      )}
    </div>
  );
}
