import Image from "next/image";
import ribbonNew from "@/assets/images/newribbon.png";

export default function RibbonDivider() {
  return (
    <div
      className="
        ribbon-fade
        relative
        left-1/2 right-1/2
        w-screen
        -translate-x-1/2
        my-24 md:my-32
        select-none pointer-events-none
        filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.05)]
      "
      aria-hidden="true"
    >
      <Image
        src={ribbonNew}
        alt=""
        width={2400}
        height={260}
        className="w-full h-auto object-cover"
        priority={false}
      />
    </div>
  );
}
