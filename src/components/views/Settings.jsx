import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Code2, Palette, Zap, Shield, Database } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = React.useState({
    autoSave: true,
    syntaxHighlight: true,
    lineNumbers: true,
    autoComplete: true,
    notifications: true,
    darkMode: true,
    autoFix: false,
    telemetry: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your DECAPSULE experience</p>
        </div>

        <div className="space-y-6">
          {/* Editor Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5 text-primary" strokeWidth={2} />
                <div>
                  <CardTitle className="text-foreground">Editor Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure code editor preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {[
                ['Auto Save', 'Automatically save changes', 'autoSave'],
                ['Syntax Highlighting', 'Enable code syntax colors', 'syntaxHighlight'],
                ['Line Numbers', 'Show line numbers in editor', 'lineNumbers'],
                ['Auto Complete', 'Enable code suggestions', 'autoComplete'],
              ].map(([label, desc, key]) => (
                <React.Fragment key={key}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-foreground">{label}</Label>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                    <Switch checked={settings[key]} onCheckedChange={() => toggleSetting(key)} />
                  </div>
                  <Separator className="bg-border" />
                </React.Fragment>
              ))}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-primary" strokeWidth={2} />
                <div>
                  <CardTitle className="text-foreground">Appearance</CardTitle>
                  <CardDescription className="text-muted-foreground">Customize the look</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Use dark color scheme</p>
                </div>
                <Switch checked={settings.darkMode} onCheckedChange={() => toggleSetting('darkMode')} />
              </div>
            </CardContent>
          </Card>

          {/* AI Features */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" strokeWidth={2} />
                <div>
                  <CardTitle className="text-foreground">AI Features</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure AI-powered debugging
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Auto-Fix Suggestions</Label>
                  <p className="text-sm text-muted-foreground">Automatically suggest fixes</p>
                </div>
                <Switch checked={settings.autoFix} onCheckedChange={() => toggleSetting('autoFix')} />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" strokeWidth={2} />
                <div>
                  <CardTitle className="text-foreground">Notifications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage notification preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts and updates</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={() => toggleSetting('notifications')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" strokeWidth={2} />
                <div>
                  <CardTitle className="text-foreground">Privacy & Data</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Control your data and privacy
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">Help improve DECAPSULE</p>
                </div>

                <Switch
                  checked={settings.telemetry}
                  onCheckedChange={() => toggleSetting('telemetry')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-muted">
              Reset to Defaults
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
