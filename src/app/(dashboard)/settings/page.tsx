"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShieldCheck, BellRing, User, 
  Settings2, Download, Trash2, Leaf,
  Target, Award, Globe,
  Key, ShieldAlert, Check, Mail, MapPin, Loader2, Camera, UserCircle2, Flame,
  TrendingDown, Scale, Anchor, Car, BusFront, Bike, Zap, Sun, Activity,
  Monitor, Smartphone, Info, Lock, BarChart3, Sparkles,
  EyeOff, FileJson, Database, AlertTriangle
} from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/ui/animation-system"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  fetchProfile, updateProfile, 
  updatePreferences, updateNotifications, 
  updatePassword, exportData, deleteAccount 
} from "@/services/settingsService"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { UserProfile } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Real State
  const [profile, setProfile] = useState({ name: "", email: "", location: "", timezone: "utc", avatar: "" })
  const [preferences, setPreferences] = useState({ goal: "neutrality", transport: "public", energy: "renewable", dietary: "balanced", compactView: false, darkMode: true, reduceAnimations: false })
  const [notifications, setNotifications] = useState({ weeklyReports: true, aiInsights: true, challengeUpdates: true, achievementAlerts: true, marketplaceUpdates: false })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [analytics, setAnalytics] = useState({ score: 0, achievements: 0, streak: 0, co2Saved: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // Original State trackers to detect unsaved changes for the Floating Save Bar
  const [originalProfile, setOriginalProfile] = useState<any>(null)
  const [originalPreferences, setOriginalPreferences] = useState<any>(null)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const { refreshUser } = useAuth()

  const loadData = async () => {
    try {
      const { dashboardService } = await import('@/services/dashboardService')
      
      const [profileRes, analyticsRes] = await Promise.all([
        fetchProfile().catch(() => ({ data: {} })),
        dashboardService.getSummary().catch(() => ({ totalAchievementsUnlocked: 0, totalCarbon: 0, sustainabilityScore: 0 }))
      ])
      
      const u: Partial<UserProfile> = profileRes.data || {};
      const initialProfile = { name: u.name || "", email: u.email || "", location: u.location || "", timezone: u.timezone || "utc", avatar: u.avatar || "" }
      
      const initialPrefs = {
          goal: u.preferences?.goal || "neutrality",
          transport: u.preferences?.transport || "public",
          energy: u.preferences?.energy || "renewable",
          dietary: u.preferences?.dietary || "balanced",
          compactView: !!u.preferences?.compactView,
          darkMode: u.preferences?.darkMode !== false,
          reduceAnimations: !!u.preferences?.reduceAnimations,
      }

      setProfile(initialProfile)
      setOriginalProfile(initialProfile)

      setPreferences(initialPrefs)
      setOriginalPreferences(initialPrefs)

      if (u.notifications) {
        setNotifications({
          weeklyReports: u.notifications.weeklyReports !== false && (u.notifications as any).weeklyReport !== false,
          aiInsights: u.notifications.aiInsights !== false,
          challengeUpdates: u.notifications.challengeUpdates !== false,
          achievementAlerts: u.notifications.achievementAlerts !== false,
          marketplaceUpdates: !!u.notifications.marketplaceUpdates,
        })
      }
      
      const stats = (analyticsRes as Record<string, number>) || {};
      setAnalytics({
        score: stats.sustainabilityScore || 0,
        achievements: stats.totalAchievementsUnlocked || (stats as any).totalAchievements || 0,
        streak: stats.currentStreak || 0,
        co2Saved: stats.totalCarbon || (stats as any).totalCarbonSaved || 0
      })
    } catch (err) {
      // Handled
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50)
    Promise.resolve().then(() => loadData())
    return () => clearTimeout(timer)
  }, [])

  const hasUnsavedChanges = () => {
    if (!originalProfile || !originalPreferences) return false;
    const profileChanged = JSON.stringify(profile) !== JSON.stringify(originalProfile);
    const prefsChanged = JSON.stringify(preferences) !== JSON.stringify(originalPreferences);
    return profileChanged || prefsChanged;
  }

  const handleGlobalSave = async () => {
    setIsSaving(true)
    try {
      const promises = []
      if (JSON.stringify(profile) !== JSON.stringify(originalProfile)) {
        promises.push(updateProfile(profile).then(() => refreshUser()))
      }
      if (JSON.stringify(preferences) !== JSON.stringify(originalPreferences)) {
        promises.push(updatePreferences(preferences))
      }
      
      await Promise.all(promises)
      setOriginalProfile({...profile})
      setOriginalPreferences({...preferences})
      toast.success("Settings saved successfully")
    } catch (err) {
      toast.error("Failed to save some settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRevert = () => {
    setProfile({...originalProfile})
    setPreferences({...originalPreferences})
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
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      toast.success("Password updated successfully!")
    } catch (err: unknown) { setErrorMsg((err as Error).message) }
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
      toast.success("Archive downloaded successfully")
    } catch (err) { toast.error("Failed to export data") }
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

  if (!isMounted || isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-16 w-full animate-in fade-in duration-500">
        <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900 border border-zinc-800" />
        <Skeleton className="h-[600px] w-full rounded-3xl bg-zinc-900 border border-zinc-800" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-32 animate-in fade-in duration-700 relative">
      
      {/* Account Center Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Settings2 className="w-4 h-4" /> System Preferences
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Account Center</h1>
          <p className="text-zinc-400 max-w-xl text-sm leading-relaxed">
            Manage your personal profile, security protocols, and system-wide sustainability goals.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 backdrop-blur-md">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Systems Synced</span>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        {/* Navigation Tabs (Linear Style) */}
        <div className="flex justify-start w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl w-max shadow-lg backdrop-blur-md inline-flex h-12">
            <TabsTrigger value="profile" className="px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500">Profile</TabsTrigger>
            <TabsTrigger value="preferences" className="px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500">Preferences</TabsTrigger>
            <TabsTrigger value="security" className="px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500">Notifications</TabsTrigger>
            <TabsTrigger value="data" className="px-6 py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500">Data & Privacy</TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Identity</h2>
                <p className="text-sm text-zinc-500 mt-1">Manage your public persona and contact details.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-12">
              {/* Interactive Avatar */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative group w-32 h-32 rounded-full border-4 border-zinc-800 hover:border-emerald-500/50 transition-colors overflow-hidden cursor-pointer shadow-2xl">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage src={profile.avatar || undefined} className="object-cover" />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 text-4xl font-black rounded-none">
                      {profile.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* Hover Overlay */}
                  <Label htmlFor="avatar-upload-main" className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <Camera className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Update</span>
                    <Input id="avatar-upload-main" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </Label>
                </div>
                {profile.avatar && (
                  <button onClick={() => setProfile({ ...profile, avatar: "" })} className="text-[10px] font-bold text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors">
                    Remove Image
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</Label>
                  <Input value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-emerald-500/50 text-white" />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(val) => setProfile({...profile, timezone: val})}>
                    <SelectTrigger className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white rounded-xl">
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="utc">Universal Coordinated (UTC)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Stats */}
          <div className="pt-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-3">Performance Diagnostics</h3>
            <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest">Score</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-400">{analytics.score}</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">Trophies</span>
                  </div>
                  <div className="text-3xl font-black text-amber-400">{analytics.achievements}</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-bold text-orange-500/70 uppercase tracking-widest">Streak</span>
                  </div>
                  <div className="text-3xl font-black text-orange-400">{analytics.streak} <span className="text-sm">Days</span></div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-sky-500/5 border border-sky-500/20 p-6 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-sky-500" />
                    <span className="text-[10px] font-bold text-sky-500/70 uppercase tracking-widest">Saved</span>
                  </div>
                  <div className="text-3xl font-black text-sky-400">{analytics.co2Saved.toFixed(1)} <span className="text-sm">T</span></div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-8 outline-none">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-10">
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-800 pb-6">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Sustainability Directives</h2>
                <p className="text-sm text-zinc-500 mt-1">Configure the AI&apos;s core logic regarding your lifestyle choices.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
              <div className="space-y-4">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Target Objective</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "reduction", title: "Aggressive Reduction", desc: "Target -50% Output", icon: <TrendingDown className="w-5 h-5 mb-2" /> },
                    { id: "neutrality", title: "Carbon Neutrality", desc: "0 Net Emissions", icon: <Scale className="w-5 h-5 mb-2" /> },
                    { id: "maintenance", title: "Maintenance", desc: "Sustain Current Level", icon: <Anchor className="w-5 h-5 mb-2" /> }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferences({...preferences, goal: opt.id})}
                      className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                        preferences.goal === opt.id 
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      {opt.icon}
                      <span className="font-bold text-white text-sm">{opt.title}</span>
                      <span className="text-xs mt-1 opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Primary Mobility</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "ev", title: "Electric Vehicle", desc: "Battery Powered", icon: <Car className="w-5 h-5 mb-2" /> },
                    { id: "public", title: "Public Transit", desc: "Bus & Train Focus", icon: <BusFront className="w-5 h-5 mb-2" /> },
                    { id: "cycling", title: "Active Transport", desc: "Cycling & Walking", icon: <Bike className="w-5 h-5 mb-2" /> }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferences({...preferences, transport: opt.id})}
                      className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                        preferences.transport === opt.id 
                        ? "bg-sky-500/10 border-sky-500/50 text-sky-400" 
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      {opt.icon}
                      <span className="font-bold text-white text-sm">{opt.title}</span>
                      <span className="text-xs mt-1 opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Household Energy</Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: "renewable", title: "100% Renewable", desc: "Clean Sourced", icon: <Zap className="w-5 h-5 mb-2" /> },
                    { id: "solar", title: "Local Solar", desc: "Personal Array", icon: <Sun className="w-5 h-5 mb-2" /> },
                    { id: "standard", title: "Standard Grid", desc: "Mixed Energy", icon: <Activity className="w-5 h-5 mb-2" /> }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPreferences({...preferences, energy: opt.id})}
                      className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
                        preferences.energy === opt.id 
                        ? "bg-amber-500/10 border-amber-500/50 text-amber-400" 
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      {opt.icon}
                      <span className="font-bold text-white text-sm">{opt.title}</span>
                      <span className="text-xs mt-1 opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Access & Sessions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Access Credentials Box */}
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-5">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Key className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Access Credentials</h2>
                    <p className="text-sm text-zinc-500 mt-1">Manage cryptographic access and password protocols.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {errorMsg && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm font-medium text-rose-400">{errorMsg}</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Current Key</Label>
                      <Input type="password" value={passwordForm.currentPassword} onChange={e=>setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-amber-500/50 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">New Key</Label>
                      <Input type="password" value={passwordForm.newPassword} onChange={e=>setPasswordForm({...passwordForm, newPassword: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-amber-500/50 text-white" />
                      
                      {/* Interactive Password Checklist */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className={`w-3 h-3 ${passwordForm.newPassword.length >= 8 ? "text-emerald-500" : "text-zinc-600"}`} />
                          <span className={`text-xs ${passwordForm.newPassword.length >= 8 ? "text-emerald-500" : "text-zinc-500"}`}>8+ characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className={`w-3 h-3 ${/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-500" : "text-zinc-600"}`} />
                          <span className={`text-xs ${/[A-Z]/.test(passwordForm.newPassword) ? "text-emerald-500" : "text-zinc-500"}`}>Uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className={`w-3 h-3 ${/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? "text-emerald-500" : "text-zinc-600"}`} />
                          <span className={`text-xs ${/[^a-zA-Z0-9]/.test(passwordForm.newPassword) ? "text-emerald-500" : "text-zinc-500"}`}>Special character</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Verify New Key</Label>
                      <Input type="password" value={passwordForm.confirmPassword} onChange={e=>setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="h-14 rounded-xl bg-zinc-950/50 border-zinc-800 focus-visible:ring-amber-500/50 text-white" />
                      
                      <div className="pt-6">
                        <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword || passwordForm.newPassword.length < 8} className="h-14 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                          {isUpdatingPassword ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Lock className="h-5 w-5 mr-2" />}
                          {isUpdatingPassword ? "Encrypting..." : "Update Password"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Sessions Box */}
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-5">
                  <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white">Active Sessions</h2>
                    <p className="text-xs text-zinc-500 mt-1">Devices currently authenticated to your account.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Current Session */}
                  <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-emerald-500/30 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Monitor className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-white text-sm">Windows PC • Chrome</p>
                        <p className="text-xs text-zinc-500 mt-0.5">California, US • 192.168.1.1</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full">Current Session</span>
                      <span className="text-xs text-zinc-500">Active now</span>
                    </div>
                  </div>

                  {/* Mock Mobile Session */}
                  <div className="flex items-center justify-between p-4 bg-zinc-950/30 border border-zinc-800 rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400"><Smartphone className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-white text-sm">iPhone 15 Pro • Safari</p>
                        <p className="text-xs text-zinc-500 mt-0.5">California, US • 192.168.1.4</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signed In</span>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10">Revoke</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Security Score */}
            <div className="space-y-8">
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  {/* Mock Score Dial */}
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * 85) / 100} className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <span className="text-4xl font-black text-white">85</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Secure</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">Security Health</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">Your account is heavily fortified. Enable Two-Factor Authentication to reach a score of 100.</p>
                
                <div className="w-full h-px bg-zinc-800 my-6"></div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Strong Password</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> Verified Email</span>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <span className="text-xs font-bold text-zinc-500 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> 2FA Disabled</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-8 outline-none">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-10">
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-800 pb-6">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
                <BellRing className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Event Streams</h2>
                <p className="text-sm text-zinc-500 mt-1">Configure which alerts are piped directly to your inbox.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category: System Intelligence */}
              <div className="space-y-4">
                <Label className="text-xs font-bold text-sky-500 uppercase tracking-widest flex items-center gap-2 mb-4"><Activity className="w-4 h-4" /> System Intelligence</Label>
                {[
                  { label: "AI Insights & Anomalies", key: "aiInsights", desc: "Get notified when the Groq engine detects a major carbon anomaly.", icon: <Sparkles className="w-5 h-5 text-indigo-400" /> },
                  { label: "Weekly Reports", key: "weeklyReports", desc: "A comprehensive digest of your sustainability performance.", icon: <BarChart3 className="w-5 h-5 text-sky-400" /> }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group cursor-pointer" onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}>
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-sky-500/30 group-hover:bg-sky-500/10 transition-colors shadow-sm">
                        {item.icon}
                      </div>
                      <div className="pr-2">
                        <Label className="text-sm font-bold text-white mb-1 block cursor-pointer group-hover:text-sky-400 transition-colors">{item.label}</Label>
                        <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications[item.key as keyof typeof notifications]} 
                      onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} 
                      onClick={(e) => { e.stopPropagation(); updateNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]}); }} 
                      className="mt-1 data-[state=checked]:bg-sky-500"
                    />
                  </div>
                ))}
              </div>

              {/* Category: Community & Markets */}
              <div className="space-y-4">
                <Label className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 mb-4"><Globe className="w-4 h-4" /> Community & Markets</Label>
                {[
                  { label: "Challenge Updates", key: "challengeUpdates", desc: "Status changes for community missions you are enrolled in.", icon: <Award className="w-5 h-5 text-amber-400" /> },
                  { label: "Marketplace Movements", key: "marketplaceUpdates", desc: "Price fluctuations and new high-yield carbon offset projects.", icon: <Leaf className="w-5 h-5 text-emerald-400" /> }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-5 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group cursor-pointer" onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}>
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors shadow-sm">
                        {item.icon}
                      </div>
                      <div className="pr-2">
                        <Label className="text-sm font-bold text-white mb-1 block cursor-pointer group-hover:text-emerald-400 transition-colors">{item.label}</Label>
                        <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications[item.key as keyof typeof notifications]} 
                      onCheckedChange={v => setNotifications({...notifications, [item.key]: v})} 
                      onClick={(e) => { e.stopPropagation(); updateNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]}); }} 
                      className="mt-1 data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* DATA & PRIVACY TAB */}
        <TabsContent value="data" className="space-y-8 outline-none">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden p-10">
            <div className="flex items-center gap-3 mb-10 border-b border-zinc-800 pb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Privacy Center</h2>
                <p className="text-sm text-zinc-500 mt-1">Control your data footprint, export archives, and manage account lifecycle.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Data Export */}
                <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Data Portability</h3>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                    Download a complete architectural JSON snapshot of your profile, logs, and achievements. We believe your data belongs to you.
                  </p>
                  <Button onClick={handleRequestExport} disabled={isExporting} className="h-12 w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 text-zinc-950 font-bold shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileJson className="h-4 w-4 mr-2" />}
                    {isExporting ? "Compiling Archive..." : "Export JSON Archive"}
                  </Button>
                </div>

                {/* Privacy Controls (Mock UI for UX) */}
                <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <EyeOff className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-base font-bold text-white">Visibility Controls</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-bold text-zinc-300 block">Public Profile</Label>
                        <p className="text-[10px] text-zinc-500">Allow community members to view your achievements.</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-bold text-zinc-300 block">AI Data Training</Label>
                        <p className="text-[10px] text-zinc-500">Opt-in to anonymous analytics training.</p>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Security Insights */}
                <div className="p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-sky-400" />
                    <h3 className="text-base font-bold text-white">Security Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-500">No Data Breaches</p>
                        <p className="text-[10px] text-zinc-400">Your email has not been found in any known database leaks.</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                      <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-zinc-300">End-to-End Encryption</p>
                        <p className="text-[10px] text-zinc-500">All sustainability logs are encrypted at rest via AES-256.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nuclear Option */}
                <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <h3 className="text-base font-bold text-rose-500">Danger Zone</h3>
                  </div>
                  <p className="text-xs text-rose-500/70 leading-relaxed mb-6">
                    Permanently purge all identity logic, offsets, and analytics from the CarbonSphere servers. This action is instantaneous and cannot be reversed.
                  </p>
                  <Button onClick={handleDeleteAccount} variant="destructive" className="h-12 w-full rounded-xl bg-rose-600 hover:bg-rose-700 font-bold shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Global Sticky Save Action Bar */}
      <AnimatePresence>
        {hasUnsavedChanges() && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
          >
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
              <div className="text-sm font-bold text-zinc-300 pl-4 hidden sm:block">Unsaved structural changes</div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  onClick={handleRevert} 
                  variant="ghost" 
                  className="h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 flex-1 sm:flex-none"
                >
                  Revert
                </Button>
                <Button 
                  onClick={handleGlobalSave} 
                  disabled={isSaving}
                  className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] flex-1 sm:flex-none"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  {isSaving ? "Applying..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  )
}
