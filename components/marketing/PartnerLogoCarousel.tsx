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

  useEffect(() => {
    let isMounted = true;

    fetch("/api/logos")
      .then((response) => response.json())
      .then((files: string[]) => {
        if (!isMounted) return;
        // Logos are intentionally auto-loaded from assets/logos; add new files there only.
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

  const getBaseId = (logoId: string) => logoId.replace(/-repeat$/, "");

  const repeatedLogos = (() => {
    if (!logos.length) {
      return [];
    }
    if (logos.length === 1) {
      return logos;
    }

    const result: Logo[] = [...logos];
    let repeatIndex = 1;
    let added = 0;
    let attempts = 0;
    const maxAttempts = logos.length * 10;

    while (added < logos.length && attempts < maxAttempts) {
      const candidate = logos[repeatIndex % logos.length];
      if (!candidate) {
        break;
      }
      const previousLogo = result[result.length - 1];
      const previousBaseId = previousLogo ? getBaseId(previousLogo.id) : "";

      if (candidate.id === previousBaseId) {
        repeatIndex++;
        attempts++;
        continue;
      }

      result.push({ ...candidate, id: `${candidate.id}-repeat-${repeatIndex}` });
      added++;
      repeatIndex++;
      attempts = 0;
    }

    if (added < logos.length) {
      // Fallback: fill remaining slots even if duplicates might touch.
      const remaining = logos.length - added;
      for (let i = 0; i < remaining; i++) {
        const candidate = logos[(repeatIndex + i) % logos.length]!;
        result.push({ ...candidate, id: `${candidate.id}-repeat-fallback-${i}` });
      }
    }

    return result;
  })();

  return (
    <div className="space-y-6 text-center">
      {/* Logos now read as shared values, not boastful badges. */}
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
        Only Partnered With the Best
      </p>
      <p className="text-[0.7rem] tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
        Because trust matters more than logos.
      </p>
      <div className="partner-logo-carousel">
        {logos.length ? (
          <div className="partner-logo-track partner-logo-marquee">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="group flex h-16 items-center justify-center px-3 sm:px-4"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-10 w-auto transition-all duration-500 ease-out opacity-70 grayscale brightness-110 sepia-[0.25] hue-rotate-[-10deg] group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-100 group-hover:sepia-0 group-hover:hue-rotate-0 focus-visible:grayscale-0 focus-visible:opacity-100 focus-visible:brightness-100 focus-visible:sepia-0 focus-visible:hue-rotate-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="partner-logo-track partner-logo-marquee opacity-0">
            <div className="flex h-16 w-40 items-center justify-center" />
          </div>
        )}
      </div>
    </div>
  );
}
