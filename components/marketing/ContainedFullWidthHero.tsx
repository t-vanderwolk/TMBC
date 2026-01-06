import Image from "next/image";

interface Props {
  imageSrc: string;
  imageAlt?: string;
  priority?: boolean;
  children: React.ReactNode;
}

export default function ContainedFullWidthHero({
  imageSrc,
  imageAlt = "",
  priority = false,
  children,
}: Props) {
  return (
    <section
      className="
        relative w-screen h-screen
        left-1/2 right-1/2
        -ml-[50vw] -mr-[50vw]
        overflow-hidden
        bg-[#FBF7F4]
      "
    >
      {/* IMAGE FILLS THE VIEWPORT */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* HERO CONTENT — CENTERED IN VIEWPORT */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="max-w-4xl px-6 sm:px-8 text-center">
          {children}
        </div>
      </div>
    </section>
  );
}
