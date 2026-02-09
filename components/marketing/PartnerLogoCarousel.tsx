"use client";

import { useEffect, useState } from "react";

type Logo = {
  id: string;
  name: string;
  src: string | { src: string };
  alt: string;
};

type PartnerLogoCarouselProps = {
  logos?: Logo[];
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
 * - Logos stay at rest; no motion or blur.
 * - Keep presentation calm, editorial, and centered.
 */
export default function PartnerLogoCarousel({ logos: overrideLogos }: PartnerLogoCarouselProps) {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    if (overrideLogos) {
      return;
    }

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
        setLogos(mapped);
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      isMounted = false;
    };
  }, [overrideLogos]);

  const sourceLogos = overrideLogos ?? logos;
  const hasLogos = sourceLogos.length > 0;

  return (
    <div className="py-12">
      {hasLogos ? (
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-y-10 gap-x-8 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sourceLogos.map((logo) => {
            const src = typeof logo.src === "string" ? logo.src : logo.src.src;
            return (
              <div key={logo.id} className="flex items-center justify-center">
                <img
                  src={src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="partner-logo max-h-[56px] md:max-h-[64px]"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-16" aria-hidden />
      )}
    </div>
  );
}
