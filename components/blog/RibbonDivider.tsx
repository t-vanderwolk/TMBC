import Image from "next/image";
import ribbonSwirl from "@/assets/images/newribbon.png";

export default function RibbonDivider() {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 my-20 md:my-28">
      <Image
        src={ribbonSwirl}
        alt="Ribbon divider"
        width={2400}
        height={260}
        className="w-full h-auto object-cover select-none pointer-events-none"
        priority={false}
      />
    </div>
  );
}
