"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, TrendingDown, Target, Zap, Car, Home, 
  ShoppingBag, ArrowRight, CheckCircle2, Flame, 
  Lightbulb, Leaf, Send, Bot, Loader2, User, HelpCircle
} from "lucide-react"

// Types
interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
}

// Custom prompt suggestions
const suggestedPrompts = [
  "How do I reduce my commute footprint?",
  "Audit my server power hosting",
  "VegetarianDefault catering scheme"
]

const recommendations = [
  {
    id: "1",
    title: "Switch Friday commute to public transit",
    description: "Based on your travel patterns, switching your Friday drive to rail would eliminate 2.3 kg CO₂e per trip.",
    saving: "0.12 tCO2e/mo",
    confidence: 94,
    category: "Transport",
    icon: Car,
  },
  {
    id: "2",
    title: "Optimize home heating schedule",
    description: "Reducing thermostat by 2°C during sleep hours could lower your energy footprint without comfort loss.",
    saving: "0.08 tCO2e/mo",
    confidence: 87,
    category: "Energy",
    icon: Home,
  },
  {
    id: "3",
    title: "Consolidate weekly grocery trips",
    description: "Combining two mid-week shops into one reduces driving emissions and food waste simultaneously.",
    saving: "0.05 tCO2e/mo",
    confidence: 79,
    category: "Lifestyle",
    icon: ShoppingBag,
  },
]

const weeklyGoals = [
  { id: "1", label: "Log 5 activities", current: 4, target: 5 },
  { id: "2", label: "Use public transit 3×", current: 2, target: 3 },
  { id: "3", label: "Meatless meals 4×", current: 4, target: 4 },
  { id: "4", label: "Energy audit check", current: 0, target: 1 },
]

const hotspots = [
  { source: "Daily car commute", share: 38, trend: "up" as const },
  { source: "Home electricity", share: 27, trend: "down" as const },
  { source: "Air travel", share: 19, trend: "neutral" as const },
  { source: "Food & diet", share: 16, trend: "down" as const },
]

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello, Alex. I am CarbonSphere's Sustainability Copilot. Based on your recent commute logs and energy imports, you are on track to exceed your reduction goal by 12% this month. What areas should we optimize next?",
      timestamp: "12:00 PM"
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)
  
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const msgIdCounter = useRef(2)

  // Sustainability score dial settings
  const targetScore = 82
  const scoreRadius = 38
  const scoreCircumference = 2 * Math.PI * scoreRadius
  const scoreOffset = scoreCircumference - (animatedScore / 100) * scoreCircumference

  // Count up animation on mount
  useEffect(() => {
    const duration = 1200
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = 1 - Math.pow(1 - currentStep / steps, 3) // easeOutCubic
      setAnimatedScore(Math.round(progress * targetScore))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  // Auto-scroll chat window
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Contextual AI replies dictionary
  const getMockResponse = (q: string) => {
    const lower = q.toLowerCase()
    if (lower.includes("commute") || lower.includes("transport")) {
      return "Based on your commute patterns, your daily car drive represents 38% of your footprint. Shifting to rail transport on Fridays would eliminate 2.3 kg CO₂e per trip, resulting in about 0.12 tCO₂e savings monthly. Subsidizing employee E-Bikes can also yield a +15 score increase."
    }
    if (lower.includes("server") || lower.includes("energy") || lower.includes("host")) {
      return "Cloud servers account for 55% of your energy footprint (1.92 tCO₂e). Migrating intensive compute jobs to Sweden or Iceland (operated on green renewable grids) will reduce emissions by approximately 0.42 tCO₂e per quarter."
    }
    if (lower.includes("catering") || lower.includes("vegetarian") || lower.includes("diet")) {
      return "Meatless meal defaults on catered office catering events can drop diet-related footprint by up to 35% overall. This represents about 0.35 tCO₂e potential savings over the year."
    }
    return "I've analyzed your latest sustainability reports. Operational footprints show that switching servers to carbon-free hosting grids and implementing cycling commute rewards offer the highest impact mitigations."
  }

  // Simulated AI response streamer
  const handleSend = (text: string) => {
    if (!text.trim()) return

    // 1. Add user message
    msgIdCounter.current += 1
    const userMessage: Message = {
      id: String(msgIdCounter.current),
      sender: "user",
      text,
      timestamp: "Just now"
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // 2. Trigger typing indicator
    setIsTyping(true)

    // 3. Trigger streaming response after a delay
    setTimeout(() => {
      setIsTyping(false)
      const fullResponse = getMockResponse(text)
      const responseWords = fullResponse.split(" ")
      let wordIndex = 0
      let currentText = ""
      
      msgIdCounter.current += 1
      const aiMessageId = String(msgIdCounter.current)

      // Add placeholder message
      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          sender: "ai",
          text: "",
          timestamp: "Just now"
        }
      ])

      const streamTimer = setInterval(() => {
        if (wordIndex < responseWords.length) {
          currentText += (wordIndex === 0 ? "" : " ") + responseWords[wordIndex]
          setMessages((prev) => 
            prev.map((msg) => msg.id === aiMessageId ? { ...msg, text: currentText } : msg)
          )
          wordIndex++
        } else {
          clearInterval(streamTimer)
        }
      }, 50) // 50ms word intervals represents fast, responsive streaming
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-8 animate-scale-up">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 w-fit">
          <Bot className="h-3.5 w-3.5" />
          <span>CarbonSphere Copilot Model v2.4</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">AI Coach Workspace</h1>
        <p className="text-sm text-muted-foreground">
          Futuristic conversational intelligence and real-time operational ESG diagnostics.
        </p>
      </div>

      {/* Grid Layout: Left Chat (7/12) & Right Dashboard (5/12) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Chat Console (7/12 cols) */}
        <div className="xl:col-span-7 flex flex-col h-[680px] border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 rounded-3xl overflow-hidden shadow-xl relative">
          
          {/* Neural network grid background mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_24px] pointer-events-none" />

          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-850 p-5 bg-zinc-100/40 dark:bg-zinc-950/20 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              
              {/* Pulse Glowing AI Avatar */}
              <div className="relative h-10 w-10 shrink-0 flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-full shadow-inner">
                {/* Rotating accent border */}
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/35 animate-spin" style={{ animationDuration: "12s" }} />
                {/* Pulsing light */}
                <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-pulse-glow" />
                <Bot className="h-5 w-5 text-emerald-400 z-10" />
              </div>

              <div>
                <h3 className="text-xs font-black uppercase text-foreground leading-none">CarbonSphere AI</h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  COACH LOGGED ONLINE
                </span>
              </div>
            </div>

            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
              Context Depth: 12k
            </Badge>
          </div>

          {/* Messages Log Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 z-10">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai"
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Bubble Avatar */}
                  <div className={`h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isAi 
                      ? "bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 shadow-sm" 
                      : "bg-zinc-100 dark:bg-zinc-900 text-foreground border border-zinc-200/50 dark:border-zinc-800"
                  }`}>
                    {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  {/* Message bubble content */}
                  <div className="space-y-1">
                    <div className={`rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                      isAi 
                        ? "bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/40 text-foreground" 
                        : "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 font-semibold"
                    }`}>
                      {msg.text ? (
                        msg.text
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] italic text-muted-foreground animate-pulse">
                          Streaming response...
                        </span>
                      )}
                    </div>
                    <div className={`text-[9px] text-muted-foreground/60 font-bold ${isAi ? "text-left" : "text-right"}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="h-7 w-7 rounded-lg shrink-0 flex items-center justify-center bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/40 rounded-2xl px-4 py-2.5 flex items-center justify-center shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* suggested Prompt pills */}
          <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-850 space-y-2.5 bg-zinc-100/20 dark:bg-zinc-950/10 z-10">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 px-3 py-1.5 text-[10px] font-bold text-muted-foreground hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-[1.01] transition-all"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputText)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask coach about carbon optimization tasks..."
                className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-emerald-500/50 dark:focus:border-emerald-500/30 font-medium placeholder-muted-foreground/60 shadow-inner"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 transition-all duration-300 shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel: Diagnostics Board (5/12 cols) */}
        <div className="xl:col-span-5 space-y-5">
          
          {/* AI Sustainability Score dial */}
          <Card className="relative overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
            <div className="absolute top-0 right-0 w-[60px] h-[60px] bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sustainability Score</CardTitle>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-1.5">
                <div className="relative flex h-32 w-32 items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={scoreRadius} className="fill-none stroke-zinc-200 dark:stroke-zinc-800/40" strokeWidth="6.5" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r={scoreRadius} 
                      className="fill-none stroke-emerald-500 dark:stroke-emerald-400" 
                      strokeWidth="6.5" 
                      strokeLinecap="round" 
                      strokeDasharray={scoreCircumference} 
                      strokeDashoffset={scoreOffset}
                      style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
                    />
                  </svg>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl font-black tracking-tight text-foreground tabular-nums">{animatedScore}</span>
                    <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/10">
                      Great
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Score summary indices */}
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4 text-center">
                <div className="space-y-0.5">
                  <div className="text-base font-black tracking-tight text-foreground">3</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/85">Actions</div>
                </div>
                <div className="space-y-0.5 border-x border-zinc-200/30 dark:border-zinc-800/30">
                  <div className="text-base font-black tracking-tight text-foreground">12</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/85">Streak</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-base font-black tracking-tight text-foreground">0.25t</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/85">CO₂ Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category hotspots */}
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
            <CardHeader className="pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Hotspots</CardTitle>
                  <CardDescription className="text-[10px] text-muted-foreground mt-0.5">Primary sectors contributing to carbon footprint.</CardDescription>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/30 dark:border-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Flame className="h-3.5 w-3.5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {hotspots.map((h, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-500">{h.source}</span>
                    <span className="text-foreground">{h.share}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${h.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Goals Progress list */}
          <Card className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-200/50 dark:border-zinc-800/50">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Weekly Targets</CardTitle>
                <CardDescription className="text-[10px] text-muted-foreground mt-0.5">Active goal compliance logs.</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                {weeklyGoals.filter((g) => g.current >= g.target).length}/{weeklyGoals.length} Completed
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              {weeklyGoals.map((goal) => {
                const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
                const complete = goal.current >= goal.target
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        {complete ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-zinc-350 dark:border-zinc-800 shrink-0" />
                        )}
                        <span className={complete ? "text-foreground" : "text-muted-foreground/85"}>{goal.label}</span>
                      </div>
                      <span className="text-muted-foreground tabular-nums">{goal.current}/{goal.target}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${complete ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-zinc-300 dark:bg-zinc-750"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suggested actionable recommendations board */}
      <div className="space-y-4 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Top Recommendations</h2>
          <span className="text-xs font-bold text-muted-foreground/75 uppercase tracking-wider">{recommendations.length} items verified</span>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/30 shadow-md group relative overflow-hidden hover:border-emerald-500/20 transition-all duration-350 hover:-translate-y-0.5">
              <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 text-muted-foreground/80 group-hover:scale-105 group-hover:text-emerald-500 transition-all duration-300">
                    <rec.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider bg-zinc-200/50 dark:bg-zinc-900/50 border-zinc-300/30 dark:border-zinc-800/50">
                    {rec.category}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-sm font-bold leading-snug">{rec.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-xs leading-relaxed text-muted-foreground font-medium line-clamp-2">{rec.description}</p>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-zinc-200/60 bg-zinc-100/20 px-3 py-2 dark:border-zinc-850 dark:bg-zinc-950/20">
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Saving</span>
                    </div>
                    <div className="mt-1 text-xs font-black text-foreground truncate">{rec.saving}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200/60 bg-zinc-100/20 px-3 py-2 dark:border-zinc-850 dark:bg-zinc-950/20">
                    <div className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Confidence</span>
                    </div>
                    <div className="mt-1 text-xs font-black text-foreground">{rec.confidence}%</div>
                  </div>
                </div>

                <button className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white dark:text-zinc-950 font-bold px-3 py-2 text-xs transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:scale-[1.01] active:scale-[0.99]">
                  Apply Action
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
