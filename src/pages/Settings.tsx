import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ApiStatus } from "@/components/common/ApiStatus";
import { API_BASE_URL } from "@/services/api";
import { isSupabaseConfigured } from "@/services/supabase";
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
              AD
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">
              Fraud Analyst · Member since 2026
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Admin User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              defaultValue="admin@fraudguard.ai"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white">
            Save Changes
          </Button>
        </div>
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
                  Use the dark color scheme (recommended).
                </p>
              </div>
            </div>
            <Switch defaultChecked />
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
                  Get alerted when fraud is detected.
                </p>
              </div>
            </div>
            <Switch defaultChecked />
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
                {isSupabaseConfigured
                  ? "Authenticated via Supabase"
                  : "Demo mode — Supabase not configured"}
              </p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border bg-card/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Session Started
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
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
