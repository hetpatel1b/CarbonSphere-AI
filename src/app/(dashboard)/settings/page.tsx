import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, preferences, and security.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start bg-muted/50 border border-border/30">
          <TabsTrigger value="profile" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Appearance</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input id="name" defaultValue="Alex Rivera" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                <Input id="location" defaultValue="San Francisco, CA" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/30 pt-5">
              <Button className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="weekly-report" className="text-sm font-medium">Weekly Summary</Label>
                  <span className="text-xs text-muted-foreground leading-relaxed">Receive a weekly breakdown of your carbon footprint.</span>
                </div>
                <Switch id="weekly-report" defaultChecked className="shrink-0 data-[state=checked]:bg-emerald-600" />
              </div>
              <Separator className="bg-border/30" />
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="milestones" className="text-sm font-medium">Milestone Alerts</Label>
                  <span className="text-xs text-muted-foreground leading-relaxed">Get notified when you unlock a new achievement.</span>
                </div>
                <Switch id="milestones" defaultChecked className="shrink-0 data-[state=checked]:bg-emerald-600" />
              </div>
              <Separator className="bg-border/30" />
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="insights" className="text-sm font-medium">AI Insights</Label>
                  <span className="text-xs text-muted-foreground leading-relaxed">Receive personalized suggestions to reduce emissions.</span>
                </div>
                <Switch id="insights" defaultChecked className="shrink-0 data-[state=checked]:bg-emerald-600" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/30 pt-5">
              <Button className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Appearance Settings</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Customize how CarbonSphere AI looks for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col space-y-3">
                <Label className="text-sm font-medium">Theme Preference</Label>
                <div className="grid grid-cols-3 gap-3">
                  <label htmlFor="theme-light" className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 has-[:checked]:ring-2 has-[:checked]:ring-emerald-500/30 has-[:checked]:border-emerald-500/30">
                    <input type="radio" id="theme-light" name="theme" className="accent-emerald-500" />
                    <span className="text-sm font-medium">Light</span>
                  </label>
                  <label htmlFor="theme-dark" className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 has-[:checked]:ring-2 has-[:checked]:ring-emerald-500/30 has-[:checked]:border-emerald-500/30">
                    <input type="radio" id="theme-dark" name="theme" className="accent-emerald-500" defaultChecked />
                    <span className="text-sm font-medium">Dark</span>
                  </label>
                  <label htmlFor="theme-system" className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/10 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30 has-[:checked]:ring-2 has-[:checked]:ring-emerald-500/30 has-[:checked]:border-emerald-500/30">
                    <input type="radio" id="theme-system" name="theme" className="accent-emerald-500" />
                    <span className="text-sm font-medium">System</span>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/30 pt-5">
              <Button className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm">Apply Theme</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Security</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                <Input id="current-password" type="password" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                <Input id="new-password" type="password" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</Label>
                <Input id="confirm-password" type="password" className="bg-muted/20 border-border/50 rounded-lg focus-visible:ring-emerald-500/30" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/30 pt-5">
              <Button className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-sm">Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
