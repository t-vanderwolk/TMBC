"use client";

import { useEffect, useMemo, useState } from "react";

type Logo = {
  name: string;
  src: string;
  alt: string;
};

const formatAlt = (fileName: string) =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function PartnerLogoCarousel() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/logos")
      .then((response) => response.json())
      .then((files: string[]) => {
        if (!isMounted) return;
        const mapped = files.map((fileName) => ({
          name: fileName,
          src: `/api/logos/${encodeURIComponent(fileName)}`,
          alt: formatAlt(fileName),
        }));
        setLogos(mapped);
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const repeatedLogos = useMemo(() => (logos.length ? [...logos, ...logos] : []), [logos]);

  return (
    <section className="w-full overflow-hidden bg-[var(--tmbc-ivory)]/80 py-10 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
        Calm partners we trust
      </p>
      <div className="partner-logo-carousel">
        {repeatedLogos.length ? (
          <div className="partner-logo-track partner-logo-marquee">
            {repeatedLogos.map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="flex h-16 w-40 items-center justify-center">
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
