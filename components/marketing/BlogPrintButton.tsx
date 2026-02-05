'use client';

type BlogPrintButtonProps = {
  slug: string;
};

export default function BlogPrintButton({ slug }: BlogPrintButtonProps) {
  const handleDownloadPdf = () => {
    if (typeof window === 'undefined') return;

    const printUrl = `/blog/${slug}/print`;
    const printWindow = window.open(printUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadPdf}
      className="tm-print-hide inline-flex items-center gap-2 rounded-full border border-tmMauve/50 bg-white px-4 py-2 min-h-[48px] text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-tmCharcoal transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
      aria-label="Download this blog post as a PDF"
    >
      <span>Download as PDF</span>
      <span aria-hidden>⤓</span>
    </button>
  );
}
