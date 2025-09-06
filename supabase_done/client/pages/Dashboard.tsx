import { AppShell } from "@/components/app/AppShell";
import { GlassyPillFilter } from "@/components/app/Primitives";
import { NFTCard, NFTModal } from "@/components/app/Minting";
import { sampleNFTs, NFTItem } from "@/lib/mock";
import { useState } from "react";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NFTItem | undefined>();
  const openItem = (n: NFTItem) => { setActive(n); setOpen(true); };
  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="flex flex-wrap items-center gap-3">
          <GlassyPillFilter label="By Chain" />
          <GlassyPillFilter label="Newest" active />
          <GlassyPillFilter label="Oldest" />
          <GlassyPillFilter label="Collections" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleNFTs.map((n) => (
            <NFTCard key={n.id} item={n} onOpen={openItem} />
          ))}
        </div>
        <NFTModal open={open} onOpenChange={setOpen} item={active} />
      </section>
    </AppShell>
  );
}
