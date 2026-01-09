import Image, { type StaticImageData } from "next/image";

type AppPreviewProps = {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
};

const AppPreview = ({ src, alt, priority = false }: AppPreviewProps) => {
  return (
    <div className="mx-auto my-16 flex w-full justify-center md:my-20">
      <div className="w-full max-w-[85%] sm:max-w-[480px] lg:max-w-[580px]">
        <Image
          src={src}
          alt={alt}
          priority={priority}
          sizes="(min-width: 1024px) 580px, (min-width: 640px) 480px, 100vw"
          className="h-auto w-full object-contain rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default AppPreview;
