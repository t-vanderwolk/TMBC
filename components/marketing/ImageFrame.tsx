"use client";

import type { ReactNode } from "react";

type ImageFrameProps = {
  className?: string;
  children: ReactNode;
};

export default function ImageFrame({ className = "", children }: ImageFrameProps) {
  return (
    <div className={`mkt-frame ${className}`.trim()} data-image-frame>
      {children}
    </div>
  );
}
