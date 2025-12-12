"use client";

import type { TextareaHTMLAttributes } from "react";

export default function StyledTextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-[#E3C6D4] bg-white px-4 py-3 text-sm text-[#3E2F35] placeholder:text-[#C8A1B4] focus:border-[#C7A6C9] focus:outline-none focus:ring-2 focus:ring-[#F3DEE5] ${
        props.className ?? ""
      }`}
    />
  );
}
