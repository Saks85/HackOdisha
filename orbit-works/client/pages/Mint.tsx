import { AppShell } from "@/components/app/AppShell";
import { NFTPreviewSpotlight } from "@/components/app/Creation";
import { ChainSelector, WalletConnectButtons, MintProgress } from "@/components/app/Minting";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Mint() {
  const [chain, setChain] = useState("Ethereum");
  const [account, setAccount] = useState<string | undefined>();
  const [state, setState] = useState<"idle"|"minting"|"success"|"error">("idle");

  const onMint = async () => {
    setState("minting");
    await new Promise(r => setTimeout(r, 1500));
    setState("success");
  };

  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-black/60 rounded-3xl p-8 border border-white/10">
            <NFTPreviewSpotlight src="https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200&auto=format&fit=crop" alt="Preview" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Your NFT</h1>
            <Input placeholder="NFT Name" />
            <Textarea placeholder="Description" className="min-h-[120px]"/>
            <Input placeholder="Collection" />
            <div>
              <div className="text-sm text-muted-foreground mb-2">Chain</div>
              <ChainSelector value={chain} onChange={setChain} />
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Wallet</div>
              <WalletConnectButtons connected={account} onConnect={setAccount} />
            </div>
            <Button onClick={onMint} className="cta-pill grad-purple text-black">Mint NFT</Button>
            <MintProgress state={state} />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
