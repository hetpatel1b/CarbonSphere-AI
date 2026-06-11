"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShieldCheck, BellRing, Crown, User, 
  Settings2, Smartphone, Monitor, Upload, 
  Download, Trash2, Leaf, BarChart3, 
  Target, Award, Zap, Car, Sparkles,
  Lock, AlertTriangle, CheckCircle2,
  LogOut, Flame, Key, ShieldAlert, Check, RefreshCw, Mail, MapPin, Globe, Clock
} from "lucide-react"
import { StaggerContainer, StaggerItem, MotionCard, AnimatedCounter } from "@/components/ui/animation-system"
import { 
  fetchProfile, updateProfile, 
  updatePreferences, updateNotifications, 
  updatePassword, exportData, deleteAccount 
} from "@/services/settingsService"
import { useAuth } from "@/contexts/AuthContext"

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Real State
  const [profile, setProfile] = useState({ name: "", email: "", location: "", timezone: "utc", avatar: "" })
  const [preferences, setPreferences] = useState({ goal: "neutrality", transport: "public", energy: "renewable", dietary: "balanced", compactView: false, darkMode: true, reduceAnimations: false })
  const [notifications, setNotifications] = useState({ weeklyReports: true, aiInsights: true, challengeUpdates: true, achievementAlerts: true, marketplaceUpdates: false })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [analytics, setAnalytics] = useState({ score: 0, achievements: 0, streak: 0, co2Saved: 0 })
  
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [isSavingPrefs, setIsSavingPrefs] = useState(false)
  const [prefsSaved, setPrefsSaved] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfComplete, setPdfComplete] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const { refreshUser } = useAuth()

  const loadData = async () => {
    try {
      // Dynamic import to avoid breaking layout flow if analytics service isn't perfect
      const { dashboardService } = await import('@/services/dashboardService')
      
      const [profileRes, analyticsRes] = await Promise.all([
        fetchProfile().catch(() => ({ data: {} })),
        dashboardService.getSummary().catch(() => ({ totalAchievementsUnlocked: 0, totalCarbon: 0, sustainabilityScore: 0 }))
      ])
      
      const u = profileRes.data || {};
      setProfile({ name: u.name || "", email: u.email || "", location: u.location || "", timezone: u.timezone || "utc", avatar: u.avatar || "" })
      if (u.preferences) setPreferences(u.preferences)
      if (u.notifications) setNotifications(u.notifications)
      
      const stats = analyticsRes as any || {};
      setAnalytics({
        score: stats.sustainabilityScore || 0,
        achievements: stats.totalAchievementsUnlocked || stats.totalAchievements || 0,
        streak: stats.currentStreak || 0,
        co2Saved: stats.totalCarbon || stats.totalCarbonSaved || 0
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50)
    Promise.resolve().then(() => loadData())
    return () => clearTimeout(timer)
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      await updateProfile(profile)
      await refreshUser()
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) { alert("Failed to save profile") }
    setIsSavingProfile(false)
  }

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true)
    try {
      await updatePreferences(preferences)
      setPrefsSaved(true)
      setTimeout(() => setPrefsSaved(false), 3000)
    } catch (err) { alert("Failed to save preferences") }
    setIsSavingPrefs(false)
  }

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Passwords do not match")
      return
    }
    setIsUpdatingPassword(true)
    setErrorMsg("")
    try {
      await updatePassword(passwordForm)
      setPasswordUpdated(true)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setPasswordUpdated(false), 3000)
    } catch (err: any) { setErrorMsg(err.message) }
    setIsUpdatingPassword(false)
  }

  const handleRequestExport = async () => {
    setIsExporting(true)
    try {
      const res = await exportData()
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "carbonsphere-export.json"
      a.click()
      setExportComplete(true)
      setTimeout(() => setExportComplete(false), 3000)
    } catch (err) { alert("Failed to export data") }
    setIsExporting(false)
  }

  const handleDeleteAccount = async () => {
    if (confirm("Permanently delete account? This cannot be undone.")) {
      try {
        await deleteAccount()
        localStorage.removeItem('token')
        window.location.href = "/login"
      } catch (err) { alert("Failed to delete account") }
    }
  }

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true)
    setTimeout(() => {
      setIsGeneratingPDF(false)
      setPdfComplete(true)
      setTimeout(() => setPdfComplete(false), 3000)
    }, 1500)
  }

  const handleRemoveAvatar = () => setProfile({ ...profile, avatar: "" })
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase">System Preferences</Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-zinc-50 dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent mt-1">
            Account Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Configure, secure, and inspect your sustainability profile preferences.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-sm">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Live Status: Account Synced</span>
        </div>
      </div>

      <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <MotionCard glowColor="rgba(16, 185, 129, 0.12)">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Profile Status</span>
                <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                  <AnimatedCounter value={100} suffix="% Done" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Fully Configured</p>
              </div>
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <div className="absolute flex flex-col items-center justify-center text-center bg-emerald-500/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        <StaggerItem>
          <MotionCard glowColor="rgba(56, 189, 248, 0.12)">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Security Index</span>
                <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                  <AnimatedCounter value={96} suffix="/100" />
                </div>
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  Protected <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                </span>
              </div>
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <div className="absolute flex flex-col items-center justify-center text-center bg-sky-500/10 p-3 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-sky-500" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        <StaggerItem>
          <MotionCard glowColor="rgba(16, 185, 129, 0.12)">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Account Health</span>
                <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                  <AnimatedCounter value={98} suffix="% Health" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Excellent Rating</span>
              </div>
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <div className="absolute flex flex-col items-center justify-center text-center bg-emerald-500/10 p-3 rounded-full">
                  <Flame className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        <StaggerItem>
          <MotionCard glowColor="rgba(139, 92, 246, 0.12)">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Active Plan</span>
                <div className="text-2xl font-black text-violet-600 dark:text-violet-400 tracking-tight flex items-center gap-1.5">
                  Pro Tier <Crown className="h-5 w-5 text-amber-500 shrink-0" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Billed annually • Jan 2027</p>
              </div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 shrink-0">
                <Crown className="h-7 w-7 text-violet-500" />
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>
      </StaggerContainer>

      <Tabs defaultValue="profile" className="space-y-8">
        <div className="flex justify-start sm:justify-center">
          <TabsList className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 p-1.5 rounded-2xl w-full sm:w-auto shadow-sm backdrop-blur-md">
            <TabsTrigger value="profile" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 shadow-sm">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 shadow-sm">Preferences</TabsTrigger>
            <TabsTrigger value="security" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 shadow-sm">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 shadow-sm">Notifications</TabsTrigger>
            <TabsTrigger value="data" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 shadow-sm">Data & Privacy</TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <form onSubmit={handleSaveProfile}>
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Personal Information</CardTitle>
                    <CardDescription className="text-sm mt-0.5">Update your visual profile photo and identity details.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="relative group cursor-pointer shrink-0">
                    <Avatar className="h-24 w-24 border-[3px] border-emerald-500/40 shadow-md">
                      <AvatarImage src={profile.avatar || undefined} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-3xl font-extrabold">{profile.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap gap-3">
                      <Label htmlFor="avatar-upload" className="cursor-pointer bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 font-medium flex items-center gap-2">
                        <Upload className="h-4 w-4" /> Upload new photo
                        <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </Label>
                      <Button type="button" onClick={handleRemoveAvatar} variant="outline" size="sm" className="rounded-xl font-medium text-zinc-500 hover:text-red-500">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><User className="h-4 w-4 text-zinc-400" /> Full Name</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required className="rounded-2xl h-12" />
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Mail className="h-4 w-4 text-zinc-400" /> Email Address</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required className="rounded-2xl h-12" />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="h-4 w-4 text-zinc-400" /> Location</Label>
                    <Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="rounded-2xl h-12" />
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Clock className="h-4 w-4 text-zinc-400" /> Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(val) => setProfile({...profile, timezone: val})}>
                      <SelectTrigger className="rounded-2xl h-12">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="est">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="utc">Universal Coordinated Time (UTC)</SelectItem>
                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-zinc-200/50 p-6 px-8 bg-zinc-50/40 rounded-b-3xl flex justify-between gap-4">
                <div className="flex-1">
                  {profileSaved && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5"><Check className="h-4 w-4" /> Profile updated successfully!</span>}
                </div>
                <Button type="submit" disabled={isSavingProfile} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex gap-2">
                  {isSavingProfile ? <><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Diagnostic Stats */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-5 pl-2"><BarChart3 className="h-5 w-5 text-emerald-500" /> Sustainability Diagnostic</h3>
            <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <MotionCard glowColor="rgba(16, 185, 129, 0.12)">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600"><Leaf className="h-5 w-5" /></div>
                    <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Sustainability Score</p><p className="text-2xl font-black">{analytics.score}</p></div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
              <StaggerItem>
                <MotionCard glowColor="rgba(245, 158, 11, 0.12)">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600"><Award className="h-5 w-5" /></div>
                    <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Achievements</p><p className="text-2xl font-black">{analytics.achievements}</p></div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
              <StaggerItem>
                <MotionCard glowColor="rgba(249, 115, 22, 0.12)">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600"><Flame className="h-5 w-5" /></div>
                    <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Current Streak</p><p className="text-2xl font-black">{analytics.streak}</p></div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
              <StaggerItem>
                <MotionCard glowColor="rgba(14, 165, 233, 0.12)">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600"><Sparkles className="h-5 w-5" /></div>
                    <div><p className="text-[10px] font-bold text-zinc-400 uppercase">Total CO₂ Saved</p><p className="text-2xl font-black">{analytics.co2Saved.toFixed(1)} T</p></div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-8 outline-none">
          <Card className="border-zinc-200/50 bg-white/40 backdrop-blur-md shadow-xl rounded-3xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600"><Leaf className="h-5 w-5" /></div>
                <div><CardTitle className="text-xl font-bold">Sustainability Preferences</CardTitle></div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold flex gap-1.5"><Target className="h-4 w-4" /> Preferred Goal</Label>
                  <Select value={preferences.goal} onValueChange={(v) => setPreferences({...preferences, goal: v})}>
                    <SelectTrigger className="rounded-2xl h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reduction">Aggressive Reduction (-50%)</SelectItem>
                      <SelectItem value="neutrality">Carbon Neutrality</SelectItem>
                      <SelectItem value="maintenance">Maintain Current Footprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold flex gap-1.5"><Car className="h-4 w-4" /> Transport</Label>
                  <Select value={preferences.transport} onValueChange={(v) => setPreferences({...preferences, transport: v})}>
                    <SelectTrigger className="rounded-2xl h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ev">Electric Vehicle (EV)</SelectItem>
                      <SelectItem value="public">Public Transit First</SelectItem>
                      <SelectItem value="cycling">Cycling / Walking</SelectItem>
                      <SelectItem value="mixed">Mixed Mobility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold flex gap-1.5"><Zap className="h-4 w-4" /> Energy</Label>
                  <Select value={preferences.energy} onValueChange={(v) => setPreferences({...preferences, energy: v})}>
                    <SelectTrigger className="rounded-2xl h-12"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renewable">100% Renewable</SelectItem>
                      <SelectItem value="solar">Home Solar</SelectItem>
                      <SelectItem value="standard">Standard Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6 px-8 bg-zinc-50/40 rounded-b-3xl justify-end">
              {prefsSaved && <span className="text-xs font-semibold text-emerald-600 mr-4"><Check className="h-4 w-4 inline" /> Saved!</span>}
              <Button onClick={handleSavePreferences} disabled={isSavingPrefs} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-8 outline-none">
          <Card className="border-zinc-200/50 bg-white/40 backdrop-blur-md shadow-xl rounded-3xl">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600"><Lock className="h-5 w-5" /></div>
                <div><CardTitle className="text-xl font-bold">Password & Auth</CardTitle></div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-5">
              {errorMsg && <div className="text-sm text-red-500 mb-2">{errorMsg}</div>}
              <div className="space-y-2.5">
                <Label>Current Password</Label>
                <Input type="password" value={passwordForm.currentPassword} onChange={e=>setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="rounded-2xl" />
              </div>
              <div className="space-y-2.5">
                <Label>New Password</Label>
                <Input type="password" value={passwordForm.newPassword} onChange={e=>setPasswordForm({...passwordForm, newPassword: e.target.value})} className="rounded-2xl" />
              </div>
              <div className="space-y-2.5">
                <Label>Confirm Password</Label>
                <Input type="password" value={passwordForm.confirmPassword} onChange={e=>setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="rounded-2xl" />
              </div>
              <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="mt-4 rounded-xl">Update Password</Button>
              {passwordUpdated && <span className="ml-4 text-emerald-600 text-sm">Updated successfully!</span>}
              
              <div className="border-t pt-6 mt-6">
                <h4 className="font-bold mb-2">Two-Factor Authentication (2FA)</h4>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-8 outline-none">
          <Card className="border-zinc-200/50 bg-white/40 backdrop-blur-md shadow-xl rounded-3xl">
            <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-bold">Notification Channels</CardTitle></CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Weekly Reports</Label>
                <Switch checked={notifications.weeklyReports} onCheckedChange={v => setNotifications({...notifications, weeklyReports: v})} onClick={async () => { await updateNotifications({...notifications, weeklyReports: !notifications.weeklyReports}) }} />
              </div>
              <div className="flex items-center justify-between">
                <Label>AI Insights</Label>
                <Switch checked={notifications.aiInsights} onCheckedChange={v => setNotifications({...notifications, aiInsights: v})} onClick={async () => { await updateNotifications({...notifications, aiInsights: !notifications.aiInsights}) }} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Challenge Updates</Label>
                <Switch checked={notifications.challengeUpdates} onCheckedChange={v => setNotifications({...notifications, challengeUpdates: v})} onClick={async () => { await updateNotifications({...notifications, challengeUpdates: !notifications.challengeUpdates}) }} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Marketplace News</Label>
                <Switch checked={notifications.marketplaceUpdates} onCheckedChange={v => setNotifications({...notifications, marketplaceUpdates: v})} onClick={async () => { await updateNotifications({...notifications, marketplaceUpdates: !notifications.marketplaceUpdates}) }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DATA & PRIVACY TAB */}
        <TabsContent value="data" className="space-y-8 outline-none">
          <Card className="border-zinc-200/50 bg-white/40 backdrop-blur-md shadow-xl rounded-3xl">
            <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-bold">Data Management</CardTitle></CardHeader>
            <CardContent className="p-8 pt-4 space-y-5">
              <div className="flex justify-between items-center p-5 rounded-2xl border bg-zinc-50/30">
                <div>
                  <p className="font-bold flex items-center gap-2"><Download className="h-4 w-4 text-emerald-500" /> Export JSON Archive</p>
                </div>
                <Button onClick={handleRequestExport} disabled={isExporting} variant="outline" className="rounded-xl">
                  {isExporting ? "Exporting..." : "Download Data"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30 bg-red-500/5 shadow-xl rounded-3xl">
            <CardHeader className="p-8 pb-4"><CardTitle className="text-xl font-bold text-red-600">Danger Zone</CardTitle></CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="flex justify-between items-center p-5 rounded-2xl border border-red-500/20 bg-white/50">
                <p className="font-bold text-red-600">Permanently Delete Account</p>
                <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-xl">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
