import { AppShell } from "@/components/app/AppShell";
import { SettingsTabs } from "@/components/app/Minting";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileSettings() {
  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, security, and connections.</p>
        </div>
        <Card className="glass">
          <CardContent className="p-6">
            <SettingsTabs />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
