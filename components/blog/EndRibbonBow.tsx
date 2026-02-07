import Image from "next/image";
import ribbonBow from "@/assets/images/ribbonandbowbreak.png";

export default function EndRibbonBow() {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 mt-24 mb-10">
      <Image
        src={ribbonBow}
        alt="Ribbon and bow divider"
        width={1200}
        height={220}
        className="w-screen h-auto object-fill select-none pointer-events-none"
        priority={false}
      />
    </div>
  );
}
