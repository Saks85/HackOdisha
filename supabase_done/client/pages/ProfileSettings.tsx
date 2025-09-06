import { AppShell } from "@/components/app/AppShell";
import { SettingsTabs } from "@/components/app/Minting";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";

export default function ProfileSettings() {
  const { user, updatePassword, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onUpdatePassword = async () => {
    if (!newPassword) return alert('Enter a new password');
    setLoading(true);
    const res = await updatePassword(newPassword);
    setLoading(false);
    if (res.error) alert('Error updating password: ' + res.error.message);
    else alert('Password updated');
  };

  const onDisconnectWallet = async () => {
    const ok = window.confirm('Disconnect wallet from your profile?');
    if (!ok) return;
    const client = getSupabaseClient();
    if (!client) return alert('Supabase client unavailable');
    const { data, error } = await client.auth.updateUser({ data: { wallet: null } });
    if (error) alert('Error disconnecting wallet: ' + error.message);
    else alert('Wallet disconnected');
  };

  return (
    <AppShell>
      <section className="container max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, security, and connections.</p>
        </div>
        <Card className="glass">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Connected Wallet</div>
                <div className="font-medium">{(user as any)?.user_metadata?.wallet ?? 'Not connected'}</div>
                <div className="mt-2">
                  <Button variant="ghost" className="glass" onClick={onDisconnectWallet}>Disconnect Wallet</Button>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Update password</div>
                <div className="mt-2 flex gap-2">
                  <Input placeholder="New password" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                  <Button onClick={onUpdatePassword} className="cta-pill grad-purple text-black">{loading ? 'Saving...' : 'Update'}</Button>
                </div>
              </div>
              <div>
                <Button variant="destructive" onClick={() => signOut()}>Sign out</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
