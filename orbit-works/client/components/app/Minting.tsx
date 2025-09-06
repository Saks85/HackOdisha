import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { sampleHistory, NFTItem } from "@/lib/mock";
import { motion } from "framer-motion";
import { hoverLift } from "@/lib/motion";
import { Wallet, WalletMinimal, Trash2, Send } from "lucide-react";

export function ChainSelector({ value, onChange }: { value: string; onChange: (v: string)=>void }) {
  return (
    <Tabs value={value} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 glass">
        <TabsTrigger value="Ethereum">Ethereum</TabsTrigger>
        <TabsTrigger value="Polygon">Polygon</TabsTrigger>
        <TabsTrigger value="Solana">Solana</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function WalletConnectButtons({ connected, onConnect }: { connected?: string; onConnect: (addr: string)=>void }) {
  if (connected) return <Badge className="glass">{connected}</Badge>;
  return (
    <div className="flex items-center gap-3">
      <Button className="glass" onClick={() => onConnect("0xDEAD...BEEF")}><Wallet className="h-4 w-4 mr-2"/>MetaMask</Button>
      <Button className="glass" onClick={() => onConnect("0xFEED...FACE")}><WalletMinimal className="h-4 w-4 mr-2"/>WalletConnect</Button>
    </div>
  );
}

export function MintProgress({ state }: { state: "idle"|"minting"|"success"|"error" }) {
  return (
    <div className="mt-4">
      {state === "minting" && <Progress className="h-2" value={66} />}
      {state === "success" && <div className="text-green-400">Minted successfully ✅</div>}
      {state === "error" && <div className="text-red-400">Mint failed ❌</div>}
    </div>
  );
}

export function NFTCard({ item, onOpen }: { item: NFTItem; onOpen: (n: NFTItem)=>void }) {
  return (
    <motion.div {...hoverLift} onClick={() => onOpen(item)} className="cursor-pointer">
      <Card className="overflow-hidden rounded-2xl glass">
        <img src={item.image} alt={item.title} className="aspect-square object-cover" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.collection}</div>
            </div>
            <Badge variant="outline" className="border-white/20">{item.chain}</Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NFTModal({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o:boolean)=>void; item?: NFTItem }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item?.title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <img src={item?.image} alt={item?.title || "Artwork"} className="rounded-xl object-cover w-full" />
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Info label="Token ID" value={item?.tokenId} />
              <Info label="Contract" value={item?.contract} />
              <Info label="Owner" value={item?.owner} />
              <Info label="Chain" value={item?.chain} />
            </div>
            <p className="text-muted-foreground">{item?.description}</p>
            <div className="space-x-2">
              <ActionButton icon={<Send className='h-4 w-4'/>} label="Transfer"/>
              <ActionButton icon={<Trash2 className='h-4 w-4'/>} label="Burn" variant="destructive"/>
            </div>
            <div>
              <div className="font-medium mb-2">History</div>
              <ul className="space-y-2 text-muted-foreground">
                {sampleHistory.map(h => (
                  <li key={h.id} className="flex items-center justify-between">
                    <span>{h.type}</span><span className="text-xs">{h.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button className="grad-purple text-black">List for Sale</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="p-3 rounded-lg border border-white/10">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium break-all">{value || "—"}</div>
    </div>
  );
}

function ActionButton({ icon, label, variant }: { icon: React.ReactNode; label: string; variant?: "default"|"destructive" }){
  return (
    <Button variant={variant === 'destructive' ? 'destructive' : 'default'} className={variant === 'destructive' ? '' : 'glass'}>
      {icon}<span className="ml-2">{label}</span>
    </Button>
  );
}

export function ProfileCard() {
  return (
    <Card className="glass">
      <CardContent className="p-6 space-y-4">
        <div className="text-sm text-muted-foreground">Connected wallet</div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm">0xDEAD...BEEF</div>
          <Badge className="glass">Connected</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsTabs() {
  const [tab, setTab] = useState("Profile");
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="glass">
        <TabsTrigger value="Profile">Profile</TabsTrigger>
        <TabsTrigger value="Security">Security</TabsTrigger>
        <TabsTrigger value="Connections">Connections</TabsTrigger>
      </TabsList>
      <div className="mt-6 space-y-6">
        {tab === "Profile" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Input placeholder="Display name" />
            <Input placeholder="Email" />
          </div>
        )}
        {tab === "Security" && (
          <div className="space-y-4">
            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm password" />
            <Button className="grad-purple text-black">Update password</Button>
          </div>
        )}
        {tab === "Connections" && (
          <div className="space-y-4">
            <ProfileCard />
          </div>
        )}
      </div>
    </Tabs>
  );
}
