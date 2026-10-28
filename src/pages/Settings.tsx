import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ApiStatus } from "@/components/common/ApiStatus";
import { API_BASE_URL } from "@/services/api";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/userUtils";
import {
  getNotificationsEnabled,
  setNotificationsEnabled,
} from "@/lib/preferences";
import {
  User,
  Settings as SettingsIcon,
  Server,
  Shield,
  LogOut,
  Bell,
  Moon,
} from "lucide-react";

interface SettingsProps {
  onLogout: () => void;
}

export function Settings({ onLogout }: SettingsProps) {
  const { user, session, email, displayName } = useAuth();
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [notify, setNotify] = useState(getNotificationsEnabled());

  function handleNotifyChange(value: boolean) {
    setNotify(value);
    setNotificationsEnabled(value);
  }

  useEffect(() => {
    setName(displayName);
  }, [displayName]);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : "-";

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }
    if (trimmed.length > 60) {
      setMessage({
        type: "error",
        text: "Name must be 60 characters or fewer.",
      });
      return;
    }
    if (!supabase) {
      setMessage({ type: "error", text: "Authentication is not configured." });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
      if (error) {
        setMessage({
          type: "error",
          text: "Could not update your name. Please try again.",
        });
        return;
      }
      setMessage({ type: "success", text: "Your name has been updated." });
    } catch {
      setMessage({
        type: "error",
        text: "Could not reach the server. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile */}
      <Card className="glass-card border-border p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your account information.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                readOnly
                className="text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Your sign-in email cannot be changed here.
              </p>
            </div>
          </div>

          {message && (
            <p
              className={
                message.type === "success"
                  ? "mt-3 text-xs text-success"
                  : "mt-3 text-xs text-destructive"
              }
              role={message.type === "error" ? "alert" : "status"}
            >
              {message.text}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={saving || name.trim() === displayName}
              className="bg-gradient-to-r from-primary to-accent text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Application */}
      <Card className="glass-card border-border p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <SettingsIcon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Application
            </h3>
            <p className="text-sm text-muted-foreground">
              Customize your experience.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-4.5 w-4.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Dark Theme
                </p>
                <p className="text-xs text-muted-foreground">
                  Dark is currently the only available theme.
                </p>
              </div>
            </div>
            <Switch checked disabled aria-label="Dark theme" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-4.5 w-4.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Notifications
                </p>
                <p className="text-xs text-muted-foreground">
                  Show an alert when a transaction is flagged as fraud.
                </p>
              </div>
            </div>
            <Switch
              checked={notify}
              onCheckedChange={handleNotifyChange}
              aria-label="Notifications"
            />
          </div>
        </div>
      </Card>

      {/* API */}
      <Card className="glass-card border-border p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Server className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">API</h3>
            <p className="text-sm text-muted-foreground">
              Backend connection settings.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">Backend URL</Label>
            <Input
              id="api-url"
              value={API_BASE_URL}
              readOnly
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Configured via VITE_API_BASE_URL environment variable.
            </p>
          </div>
          <ApiStatus />
        </div>
      </Card>

      {/* Security */}
      <Card className="glass-card border-border p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Security</h3>
            <p className="text-sm text-muted-foreground">
              Session and account security.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Session Status
              </p>
              <p className="text-xs text-muted-foreground">
                {session ? "Authenticated via Supabase" : "Not signed in"}
              </p>
            </div>
            <span
              className={
                session
                  ? "h-2.5 w-2.5 rounded-full bg-success"
                  : "h-2.5 w-2.5 rounded-full bg-destructive"
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Last Sign In
              </p>
              <p className="text-xs text-muted-foreground">{lastSignIn}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}