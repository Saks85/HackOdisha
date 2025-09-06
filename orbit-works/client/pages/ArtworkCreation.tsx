import { AppShell } from "@/components/app/AppShell";
import { UploadDropzone, ArtworkCarousel } from "@/components/app/Creation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ArtworkCreation() {
  const [prompt, setPrompt] = useState("");
  const [uploaded, setUploaded] = useState<File | null>(null);

  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Describe your artwork…</h1>
          <p className="text-muted-foreground mt-2">Use AI prompts or upload your own image.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto glass rounded-2xl p-6 space-y-4">
          <Textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Describe your artwork…" className="min-h-[120px] bg-transparent" />
          <div className="flex items-center justify-between">
            <UploadDropzone onFile={setUploaded} />
            <Button className="cta-pill grad-tealblue text-black">Generate Art</Button>
          </div>
        </motion.div>
        <div className="pt-4">
          <ArtworkCarousel />
        </div>
        {uploaded && <p className="text-center text-sm text-muted-foreground">Uploaded: {uploaded.name}</p>}
      </section>
    </AppShell>
  );
}
