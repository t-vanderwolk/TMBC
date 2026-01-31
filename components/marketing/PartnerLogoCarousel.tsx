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
        setLogos(mapped);
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
      <section className="w-full overflow-hidden bg-[var(--tmbc-ivory)]/80 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Calm partners we trust
        </p>
        <div className="partner-logo-carousel">
          {logos.length ? (
            <div className="partner-logo-track partner-logo-marquee">
            {repeatedLogos.map((logo) => (
              <div key={logo.id} className="flex h-16 w-40 items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto object-contain"
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
    </section>
  );
}
