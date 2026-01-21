type Partner = {
  file: string;
  alt: string;
};

type PartnerLogosProps = {
  logos: Partner[];
};

export default function PartnerLogos({ logos }: PartnerLogosProps) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/70 px-8 py-10 shadow-sm">
      <p className="text-xs uppercase tracking-[0.4em] text-neutral-500 text-center">
        Trusted by quiet prep partners
      </p>
      <div className="mt-10 grid grid-cols-2 gap-6 items-center sm:grid-cols-4 lg:grid-cols-8">
        {logos.map((logo) => (
          <div key={logo.file} className="flex items-center justify-center">
            <img
              src={`/api/logos/${logo.file}`}
              alt={logo.alt}
              loading="lazy"
              className="h-7 sm:h-8 w-full object-contain opacity-70 transition hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
