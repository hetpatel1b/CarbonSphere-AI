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

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Interactive Simulation States
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

  const [avatarSrc, setAvatarSrc] = useState("/placeholder-avatar.jpg")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Action handlers with state triggers to simulate a premium responsive UI
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setProfileSaved(false)
    setTimeout(() => {
      setIsSavingProfile(false)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }, 1200)
  }

  const handleSavePreferences = () => {
    setIsSavingPrefs(true)
    setPrefsSaved(false)
    setTimeout(() => {
      setIsSavingPrefs(false)
      setPrefsSaved(true)
      setTimeout(() => setPrefsSaved(false), 3000)
    }, 1200)
  }

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true)
    setPasswordUpdated(false)
    setTimeout(() => {
      setIsUpdatingPassword(false)
      setPasswordUpdated(true)
      setTimeout(() => setPasswordUpdated(false), 3000)
    }, 1500)
  }

  const handleRequestExport = () => {
    setIsExporting(true)
    setExportComplete(false)
    setTimeout(() => {
      setIsExporting(false)
      setExportComplete(true)
      setTimeout(() => setExportComplete(false), 3000)
    }, 2000)
  }

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true)
    setPdfComplete(false)
    setTimeout(() => {
      setIsGeneratingPDF(false)
      setPdfComplete(true)
      setTimeout(() => setPdfComplete(false), 3000)
    }, 2500)
  }

  const handleRemoveAvatar = () => {
    setAvatarSrc("")
  }

  const handleAvatarUpload = () => {
    // Mock image change
    setAvatarSrc("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop")
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-16 animate-in fade-in duration-700">
      {/* Header section (Apple inspired) */}
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
        
        {/* Dynamic Activity Badge */}
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-sm">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Live Status: Account Synced</span>
        </div>
      </div>

      {/* Overview Cards (Apple Diagnostics Section) */}
      <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Profile Completion Dial */}
        <StaggerItem>
          <MotionCard glowColor="rgba(16, 185, 129, 0.12)">
            <CardContent className="p-5 flex items-center justify-between gap-4 relative">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Profile Status</span>
                <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight">
                  <AnimatedCounter value={92} suffix="% Done" />
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">11 of 12 steps complete</p>
              </div>
              
              {/* SVG Circular Loader */}
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    className="stroke-zinc-100 dark:stroke-zinc-900/60"
                    strokeWidth="5.5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#profileGradient)"
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="5.5"
                    fill="transparent"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * (isMounted ? 92 : 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <User className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* Security Score Dial */}
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
              
              {/* SVG Circular Loader */}
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    className="stroke-zinc-100 dark:stroke-zinc-900/60"
                    strokeWidth="5.5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#securityGradient)"
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="5.5"
                    fill="transparent"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * (isMounted ? 96 : 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="h-4 w-4 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* Account Health Score */}
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
              
              {/* SVG Circular Loader */}
              <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
                <svg className="w-full h-full transform -rotate-90">
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    className="stroke-zinc-100 dark:stroke-zinc-900/60"
                    strokeWidth="5.5"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#healthGradient)"
                    className="transition-all duration-1000 ease-out"
                    strokeWidth="5.5"
                    fill="transparent"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * (isMounted ? 98 : 0)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <Flame className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>

        {/* Subscription Status Card */}
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
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Crown className="h-7 w-7 text-violet-500" />
              </div>
            </CardContent>
          </MotionCard>
        </StaggerItem>
      </StaggerContainer>

      <Tabs defaultValue="profile" className="space-y-8">
        {/* Centered glassmorphic tab list */}
        <div className="flex justify-start sm:justify-center">
          <TabsList className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 p-1.5 rounded-2xl w-full sm:w-auto shadow-sm backdrop-blur-md">
            <TabsTrigger value="profile" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md">
              Profile
            </TabsTrigger>
            <TabsTrigger value="preferences" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md">
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="data" className="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-emerald-500 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-md">
              Data & Privacy
            </TabsTrigger>
          </TabsList>
        </div>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <form onSubmit={handleSaveProfile}>
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Personal Information</CardTitle>
                    <CardDescription className="text-sm mt-0.5">Update your visual profile photo and identity details.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 pt-4 space-y-8">
                {/* Avatar Uploader Section with high polish */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="relative group cursor-pointer shrink-0">
                    <Avatar className="h-24 w-24 border-[3px] border-emerald-500/40 dark:border-emerald-500/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <AvatarImage src={avatarSrc} alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-3xl font-extrabold">AR</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                      <Button type="button" onClick={handleAvatarUpload} size="sm" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl px-4 py-2 font-medium flex items-center gap-2">
                        <Upload className="h-3.8 w-3.8" /> Upload new photo
                      </Button>
                      <Button type="button" onClick={handleRemoveAvatar} variant="outline" size="sm" className="bg-white/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 dark:hover:bg-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-200 font-medium">
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
                      Recommended: Square PNG, JPEG or WebP, 1000px minimal dimension.
                    </p>
                  </div>
                </div>

                {/* Form fields Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-zinc-400" /> Full Name
                    </Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <User className="h-4 w-4" />
                      </span>
                      <Input id="name" defaultValue="Alex Rivera" required className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 rounded-2xl h-12 transition-all duration-300 text-sm font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-zinc-400" /> Email Address
                    </Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input id="email" type="email" defaultValue="alex@example.com" required className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 rounded-2xl h-12 transition-all duration-300 text-sm font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="location" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-zinc-400" /> Location
                    </Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input id="location" defaultValue="San Francisco, CA" required className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 rounded-2xl h-12 transition-all duration-300 text-sm font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="timezone" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-zinc-400" /> Timezone
                    </Label>
                    <Select defaultValue="pst">
                      <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 rounded-2xl h-12 transition-all duration-300 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-zinc-400 shrink-0" />
                          <SelectValue placeholder="Select timezone" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl">
                        <SelectItem value="pst" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="est" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Eastern Time (US & Canada)</SelectItem>
                        <SelectItem value="gmt" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-zinc-200/50 dark:border-zinc-800/50 p-6 px-8 bg-zinc-50/40 dark:bg-zinc-950/20 rounded-b-3xl flex items-center justify-between gap-4">
                <div className="flex-1">
                  {profileSaved && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                      <Check className="h-4 w-4 text-emerald-500 border border-emerald-500/30 rounded-full p-0.5 bg-emerald-500/10" /> Profile updated successfully!
                    </span>
                  )}
                </div>
                <Button type="submit" disabled={isSavingProfile} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 px-6 py-2.5 h-11 font-semibold flex items-center gap-2">
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Account Insights Checklist Visualizer */}
          <div>
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2.5 mb-5 pl-2"><BarChart3 className="h-5 w-5 text-emerald-500" /> Sustainability Diagnostic Dashboard</h3>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StaggerItem>
                <MotionCard glowColor="rgba(16, 185, 129, 0.12)" className="hover:border-emerald-500/20">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Sustainability Score</p>
                      <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                        <AnimatedCounter value={842} />
                      </p>
                    </div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
              
              <StaggerItem>
                <MotionCard glowColor="rgba(245, 158, 11, 0.12)" className="hover:border-amber-500/20">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Achievements</p>
                      <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                        <AnimatedCounter value={14} suffix=" Unlocked" />
                      </p>
                    </div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>

              <StaggerItem>
                <MotionCard glowColor="rgba(249, 115, 22, 0.12)" className="hover:border-orange-500/20">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0 group-hover:scale-105 transition-transform duration-300 animate-pulse">
                      <Flame className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Current Streak</p>
                      <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                        <AnimatedCounter value={12} suffix=" Days" />
                      </p>
                    </div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>

              <StaggerItem>
                <MotionCard glowColor="rgba(14, 165, 233, 0.12)" className="hover:border-sky-500/20">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total CO₂ Saved</p>
                      <p className="text-2xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight mt-0.5">
                        <AnimatedCounter value={2.4} decimals={1} suffix=" Tons" />
                      </p>
                    </div>
                  </CardContent>
                </MotionCard>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Appearance Settings</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Customize application visual displays and behavior defaults.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-2">
              {/* Dark Mode Switch Row */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Dark Mode</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Use dark themes for reduced power footprint and eye safety.</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Compact View Switch Row */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Compact View</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Increase screen layout density to render more metrics at once.</span>
                </div>
                <Switch className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Reduce Animations Switch Row */}
              <div className="flex items-center justify-between py-4 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Reduce Animations</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Deactivate transitions and page motions for speed performance.</span>
                </div>
                <Switch className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Sustainability Preferences</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Adapt environmental metrics models to align with your personal habits.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Target className="h-4 w-4 text-zinc-400" /> Preferred Goal
                  </Label>
                  <Select defaultValue="neutrality">
                    <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-12 text-sm font-medium">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <SelectItem value="reduction" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Aggressive Reduction (-50%)</SelectItem>
                      <SelectItem value="neutrality" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Carbon Neutrality</SelectItem>
                      <SelectItem value="maintenance" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Maintain Current Footprint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Car className="h-4 w-4 text-zinc-400" /> Transport Preference
                  </Label>
                  <Select defaultValue="public">
                    <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-12 text-sm font-medium">
                      <SelectValue placeholder="Select transport" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <SelectItem value="ev" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Electric Vehicle (EV)</SelectItem>
                      <SelectItem value="public" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Public Transit First</SelectItem>
                      <SelectItem value="cycling" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Cycling / Walking</SelectItem>
                      <SelectItem value="mixed" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Mixed Mobility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-zinc-400" /> Energy Preference
                  </Label>
                  <Select defaultValue="renewable">
                    <SelectTrigger className="bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-12 text-sm font-medium">
                      <SelectValue placeholder="Select energy" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                      <SelectItem value="renewable" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">100% Renewable Tariff</SelectItem>
                      <SelectItem value="solar" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Home Solar Setup</SelectItem>
                      <SelectItem value="standard" className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">Standard Grid Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-200/50 dark:border-zinc-800/50 p-6 px-8 bg-zinc-50/40 dark:bg-zinc-950/20 rounded-b-3xl flex items-center justify-between gap-4">
              <div className="flex-1">
                {prefsSaved && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                    <Check className="h-4 w-4 text-emerald-500 border border-emerald-500/30 rounded-full p-0.5 bg-emerald-500/10" /> Preferences saved!
                  </span>
                )}
              </div>
              <Button type="button" onClick={handleSavePreferences} disabled={isSavingPrefs} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all duration-200 px-6 py-2.5 h-11 font-semibold flex items-center gap-2">
                {isSavingPrefs ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Password & Authentication</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Manage details of security credentials and multi-factor apps.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Password input form */}
                <div className="flex-1 space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="current-password" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Current Password</Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <Key className="h-4 w-4" />
                      </span>
                      <Input id="current-password" type="password" className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-11 text-sm font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="new-password" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Password</Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input id="new-password" type="password" className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-11 text-sm font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="confirm-password" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Confirm Password</Label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors duration-200">
                        <Check className="h-4 w-4" />
                      </span>
                      <Input id="confirm-password" type="password" className="pl-10 bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 rounded-2xl h-11 text-sm font-medium" />
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center gap-4">
                    <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 shadow-md hover:shadow-lg transition-all duration-200 px-5 py-2.5 h-11 font-semibold flex items-center gap-2">
                      {isUpdatingPassword ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                    {passwordUpdated && (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-300">
                        <Check className="h-4 w-4 text-emerald-500 border border-emerald-500/30 rounded-full p-0.5 bg-emerald-500/10" /> Password updated!
                      </span>
                    )}
                  </div>
                </div>

                {/* 2FA Sidebar panel */}
                <div className="lg:w-80 shrink-0">
                  <div className="p-6 rounded-3xl border border-emerald-200/50 dark:border-emerald-950/40 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-4 shadow-inner relative overflow-hidden group">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                      <Smartphone className="h-5 w-5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                      Two-Factor Authentication
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Elevate security integrity by requesting verification codes via mobile authenticator application.
                    </p>
                    <div className="pt-1">
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                        Status: Enabled
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-2 text-xs font-semibold h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-200 shadow-sm">
                      Manage 2FA App
                    </Button>
                    {/* Background glow overlay */}
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Active Device Sessions</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Inspect and revoke login tokens currently active on other devices.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              {/* Session 1 */}
              <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 shadow-sm relative group overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">MacBook Pro - Chrome Browser</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      <span>San Francisco, USA</span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Active Now
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 rounded-full font-semibold px-3 py-0.5 text-xs pointer-events-none relative z-10">
                  Current Session
                </Badge>
                {/* Background flow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Session 2 */}
              <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-200/30 dark:border-zinc-800/30 bg-zinc-50/10 dark:bg-zinc-950/5 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 shadow-sm relative group transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">iPhone 14 Pro - Safari Mobile</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      <span>San Francisco, USA</span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span>Last active 2 hours ago</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl h-10 w-10 transition-all duration-200">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Notification Channels</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Control communication mediums and alerts dispatch frequencies.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-2">
              {/* Notification 1 */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Weekly Carbon Reports</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Receive an audit statement of environmental metrics updates every Monday.</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Notification 2 */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">AI Sustainability Insights</Label>
                    <Badge className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 px-2 py-0 h-4 text-[9px] font-bold uppercase tracking-wider rounded-full pointer-events-none">New</Badge>
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Personalized AI optimizations based on carbon emissions logs.</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Notification 3 */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Community Challenge Updates</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Get notified of ranking changes, team invitation alerts, and event updates.</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Notification 4 */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-900/80 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Achievement Alerts</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Immediate alert notifications when locking/unlocking milestone badges.</span>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-600 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>

              {/* Notification 5 */}
              <div className="flex items-center justify-between py-4 hover:bg-zinc-500/5 px-2 rounded-2xl transition-all duration-200 group">
                <div className="flex flex-col gap-0.5">
                  <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">Offset Marketplace News</Label>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 leading-normal">Updates on certified clean-energy and reforestation offsets schemes.</span>
                </div>
                <Switch className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500 border border-zinc-200 dark:border-zinc-800 scale-105" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DATA & PRIVACY TAB */}
        <TabsContent value="data" className="space-y-8 outline-none animate-in fade-in-50 duration-500">
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md shadow-xl shadow-zinc-100/40 dark:shadow-black/20 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">Data Management</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Audit, download, or permanently wipe personal carbon logs.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-5">
              {/* Option 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/30 dark:bg-zinc-950/20 hover:border-emerald-500/20 shadow-sm transition-all duration-200 group">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <Download className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" /> Export Personal Profile Logs
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">Request and download a spreadsheet archive format containing complete historical logs.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {exportComplete && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-300">
                      <Check className="h-3 w-3" /> Ready!
                    </span>
                  )}
                  <Button onClick={handleRequestExport} disabled={isExporting} variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-200 font-semibold h-11 px-5 shadow-sm flex items-center gap-2">
                    {isExporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Fetching...
                      </>
                    ) : (
                      "Request Export"
                    )}
                  </Button>
                </div>
              </div>

              {/* Option 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/30 dark:bg-zinc-950/20 hover:border-emerald-500/20 shadow-sm transition-all duration-200 group">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" /> Generate Exec Sustainability PDF
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">Generate a customized, investor-grade performance PDF summary report.</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {pdfComplete && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-300">
                      <Check className="h-3 w-3" /> Compiled!
                    </span>
                  )}
                  <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all duration-200 font-semibold h-11 px-5 shadow-sm flex items-center gap-2">
                    {isGeneratingPDF ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Compiling...
                      </>
                    ) : (
                      "Generate PDF"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone - Premium visual separation */}
          <Card className="border-red-500/30 bg-red-500/5 dark:bg-red-950/10 backdrop-blur-md shadow-xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription className="text-sm text-red-500/80 mt-0.5">Permanent account destruction. Actions cannot be reversed.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-red-500/20 bg-white/50 dark:bg-zinc-950/50 shadow-sm">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Permanently Delete Account</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">Wipe authentication profile, saved presets, and lifetime offset certifications files.</p>
                </div>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg hover:shadow-red-500/10 transition-all duration-200 font-semibold h-11 px-6 shrink-0 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
