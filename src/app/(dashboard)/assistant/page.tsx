"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, Send, Leaf, ShieldCheck, Zap, Droplets, Clock, BarChart3, TrendingUp, Target, User, CheckCircle2, AlertCircle } from "lucide-react"
import { assistantService } from "@/services/assistantService"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type Message = {
  id: string
  role: "user" | "assistant" | "error"
  content: string
  impact?: "High" | "Medium" | "Low"
  actionability?: number
}

const SUGGESTED_QUESTIONS = [
  {
    title: "Reduce my carbon footprint",
    description: "Personalized tips based on your lifestyle",
    category: "Action Plan",
    icon: Leaf,
  },
  {
    title: "Biggest emission source",
    description: "Analyze your data to find hotspots",
    category: "Analysis",
    icon: BarChart3,
  },
  {
    title: "Transportation recommendations",
    description: "Eco-friendly commuting options",
    category: "Mobility",
    icon: Zap,
  },
  {
    title: "Carbon neutrality roadmap",
    description: "Step-by-step guide to net-zero",
    category: "Strategy",
    icon: Target,
  }
]

const RECENT_CONVERSATIONS = [
  "Weekly Sustainability Review",
  "Emission Reduction Plan",
  "Carbon Offset Suggestions",
  "Home Energy Optimization"
]

const TIPS = [
  { icon: Zap, text: "Turn off unused appliances" },
  { icon: Droplets, text: "Reduce water consumption" },
  { icon: Leaf, text: "Use public transport today" }
]

const CAPABILITIES = [
  { title: "Carbon Analysis", description: "Deep dive into your emission sources", icon: BarChart3 },
  { title: "Forecasting", description: "Predict future carbon footprint trends", icon: TrendingUp },
  { title: "Goal Planning", description: "Set and track sustainability targets", icon: Target },
  { title: "Offset Recommendations", description: "Find verified carbon offset projects", icon: ShieldCheck }
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const aiResponse = await assistantService.chat(text);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse.content,
        impact: aiResponse.impact,
        actionability: aiResponse.actionability
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to communicate with AI Assistant. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] lg:h-[calc(100dvh-130px)] gap-4 lg:gap-6 w-full overflow-hidden pb-0">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">AI Sustainability Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions and receive sustainability guidance powered by CarbonSphere AI.
        </p>
      </div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-1 pb-2">
          
          {/* Suggested Questions */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Suggested Prompts
            </h3>
            <div className="flex flex-col gap-3">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(q.title)} 
                  className="group flex flex-col gap-2 p-3.5 rounded-xl border border-border/40 bg-white/40 dark:bg-zinc-950/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:border-emerald-500/30 transition-all text-left shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40">
                        <q.icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{q.title}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 pointer-events-none">
                      {q.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground pl-9">{q.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Conversations */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground mt-2">
              <Clock className="h-4 w-4 text-emerald-500" /> Recent Conversations
            </h3>
            <div className="flex flex-col gap-1">
              {RECENT_CONVERSATIONS.map((title, i) => (
                <button key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-left group">
                  <MessageSquare className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-foreground mt-2">
              <Leaf className="h-4 w-4 text-emerald-500" /> Today&apos;s Sustainability Tips
            </h3>
            <div className="flex flex-col gap-2">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-sm text-muted-foreground hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors cursor-default">
                  <tip.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-8 flex flex-col h-full relative min-h-0 overflow-hidden">
          <Card className="flex flex-col flex-1 relative overflow-hidden border border-emerald-500/15 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(16,185,129,0.05)] dark:border-emerald-500/10 dark:bg-zinc-950/60 min-h-0">
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] dark:bg-emerald-500/5" />
            <div className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px] dark:bg-teal-500/5" />
            
            <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth z-10" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700 max-w-2xl mx-auto py-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20 shadow-inner">
                    <Sparkles className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome to CarbonSphere AI</h2>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">Your personal sustainability copilot. I can help you analyze your footprint, set goals, and find actionable ways to reduce emissions.</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2.5 text-xs font-medium text-muted-foreground">
                    {["Personalized recommendations", "Emission forecasting", "Sustainability planning", "Carbon reduction insights"].map((feature, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-border/50 shadow-sm">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {feature}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4 max-w-lg">
                    {CAPABILITIES.map((cap, i) => (
                      <div key={i} className="p-4 rounded-xl border border-border/40 bg-white/50 dark:bg-zinc-900/50 text-left hover:shadow-md transition-shadow">
                        <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-900/30 mb-3">
                           <cap.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">{cap.title}</h4>
                        <p className="text-xs text-muted-foreground">{cap.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {messages.map((msg) => (
                     <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                       {msg.role === "assistant" && (
                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm mt-5">
                           <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                         </div>
                       )}
                       <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                         <div className="flex items-center gap-2 px-1">
                           <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                             {msg.role === "user" ? "You" : "CarbonSphere AI"}
                           </span>
                         </div>
                         {msg.role === "user" ? (
                           <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-emerald-600 to-teal-600 px-4 py-3 text-sm text-white shadow-md">
                             {msg.content}
                           </div>
                         ) : (
                           <div className="space-y-3">
                             <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-white/80 dark:bg-zinc-900/80 p-4 text-sm leading-relaxed text-foreground shadow-sm overflow-hidden prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:text-zinc-50 prose-a:text-emerald-500">
                               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                 {msg.content}
                               </ReactMarkdown>
                             </div>
                             <div className="flex items-center flex-wrap gap-2.5 pl-1">
                                {msg.impact && (
                                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-900/30 dark:text-emerald-300">
                                     <Leaf className="h-3 w-3" />
                                     {msg.impact} Impact
                                  </div>
                                )}
                                {msg.actionability && (
                                  <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/60 bg-sky-50/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-700 dark:border-sky-800/40 dark:bg-sky-900/30 dark:text-sky-300">
                                     <ShieldCheck className="h-3 w-3" />
                                     Actionability {msg.actionability}%
                                  </div>
                                )}
                             </div>
                           </div>
                         )}
                       </div>
                       {msg.role === "user" && (
                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/50 shadow-sm mt-5">
                           <User className="h-4 w-4 text-muted-foreground" />
                         </div>
                       )}
                     </div>
                  ))}
                  {isTyping && (
                     <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm mt-5">
                         <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                       </div>
                       <div className="flex flex-col gap-1.5 items-start">
                         <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                           CarbonSphere AI
                         </span>
                         <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-white/80 dark:bg-zinc-900/80 px-4 py-3 text-sm shadow-sm flex items-center gap-2">
                           <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                           </div>
                           <span className="text-muted-foreground text-sm ml-1">Thinking...</span>
                         </div>
                       </div>
                     </div>
                  )}
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t border-border/30 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md z-10 relative">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                className="flex flex-col gap-3 max-w-3xl mx-auto w-full"
              >
                <div className="relative flex items-center shadow-sm group">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about reducing your footprint..."
                    className="h-12 bg-white dark:bg-zinc-900 border-border/50 rounded-xl pl-4 pr-14 focus-visible:ring-emerald-500/30 text-sm shadow-sm transition-all group-hover:border-emerald-500/30"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 p-0 text-white shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                     <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                    <Sparkles className="h-3 w-3 text-emerald-500" /> Powered by CarbonSphere AI
                  </span>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

