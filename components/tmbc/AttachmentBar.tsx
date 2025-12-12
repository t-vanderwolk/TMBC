"use client";

import StyledButton from "@/components/tmbc/StyledButton";
import { useState } from "react";

export type AttachmentBarProps = {
  onUpload?: (files: FileList | null) => void;
};

export default function AttachmentBar({ onUpload }: AttachmentBarProps) {
  const [fileName, setFileName] = useState("No attachment");
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[#E3C6D4] bg-white/90 px-4 py-3 text-xs uppercase tracking-[0.35em] text-[#C7A6C9]">
      <span>{fileName}</span>
      <label className="flex items-center gap-2">
        <input
          type="file"
          className="hidden"
          onChange={(event) => {
            const files = event.target.files;
            setFileName(files && files.length ? files[0].name : "No attachment");
            onUpload?.(files);
          }}
        />
        <StyledButton variant="ghost">Upload</StyledButton>
      </label>
    </div>
  );
}
