import MarketingLayout from "@/components/marketing/MarketingLayout";

export const metadata = {
  title: "Taylor-Made Baby Co. - Concierge birth & baby planning",
};

export default function MarketingRootLayout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
