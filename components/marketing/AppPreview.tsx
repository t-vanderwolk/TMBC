import Image, { type StaticImageData } from "next/image";

type AppPreviewProps = {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
};

const AppPreview = ({ src, alt, priority = false }: AppPreviewProps) => {
  return (
    <div className="my-8 flex justify-center sm:my-12 lg:my-16">
      <div className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[480px]">
        <Image
          src={src}
          alt={alt}
          priority={priority}
          sizes="(min-width: 1024px) 480px, (min-width: 640px) 420px, 360px"
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
};

export default AppPreview;
