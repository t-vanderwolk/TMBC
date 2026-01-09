import Image from "next/image";

type MobilePreviewImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  containerClassName?: string;
};

export default function MobilePreviewImage({
  src,
  alt,
  width,
  height,
  priority = false,
  containerClassName = "",
}: MobilePreviewImageProps) {
  const wrapperClass = `mx-auto flex w-full justify-center mt-12 mb-24 ${containerClassName}`.trim();
  return (
    <div className={wrapperClass}>
      <div className="w-full max-w-[85%]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full object-contain rounded-[20px]"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </div>
  );
}
