"use client";

import ReflectSidebar from "./ReflectSidebar";
import ReflectContent from "./ReflectContent";

export default function ReflectLayout() {
  // TODO: Wire up persisted sections so the layout can remember scroll position and selections.
  return (
    <div className="grid gap-6 lg:grid-cols-[0.35fr_1fr]">
      <div>
        <ReflectSidebar />
      </div>
      <div>
        <ReflectContent />
      </div>
    </div>
  );
}
