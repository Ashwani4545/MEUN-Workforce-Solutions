import { marketplaceEnabled } from "@/lib/features";
import { MarketplaceClosed } from "@/components/layout/MarketplaceClosed";

// Read the switch on every request instead of freezing it at build time.
export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!marketplaceEnabled()) return <MarketplaceClosed />;
  return <>{children}</>;
}
