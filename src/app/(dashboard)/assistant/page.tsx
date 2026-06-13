"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, Send, Leaf, ShieldCheck, Zap, Droplets, Clock, BarChart3, TrendingUp, Target, User, CheckCircle2, AlertCircle, ArrowRight, BrainCircuit, Activity } from "lucide-react"
import { assistantService } from "@/services/assistantService"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion, AnimatePresence } from "framer-motion"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"

type Message = {
  id: string
  role: "user" | "assistant" | "error"
  content: string
  impact?: "High" | "Medium" | "Low"
  actionability?: number
}

const SUGGESTED_QUESTIONS = [
  { title: "Reduce my carbon footprint", description: "Personalized lifestyle tips", category: "Action Plan", icon: Leaf },
  { title: "Biggest emission source", description: "Analyze your data hotspots", category: "Analysis", icon: BarChart3 },
  { title: "Transportation recommendations", description: "Eco-friendly commuting", category: "Mobility", icon: Zap },
  { title: "Carbon neutrality roadmap", description: "Step-by-step net-zero guide", category: "Strategy", icon: Target }
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

const mockTrendData = [
  { month: "Jan", emissions: 400 },
  { month: "Feb", emissions: 300 },
  { month: "Mar", emissions: 200 },
  { month: "Apr", emissions: 278 },
  { month: "May", emissions: 189 },
  { month: "Jun", emissions: 150 },
]

const AssistantChart = () => (
  <div className="h-48 w-full max-w-sm mt-4 border border-white/5 rounded-2xl bg-zinc-950/50 p-4 shadow-inner">
     <div className="flex items-center gap-2 mb-2">
       <TrendingUp className="w-3 h-3 text-emerald-500" />
       <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Projected Trend</span>
     </div>
     <ResponsiveContainer width="100%" height="100%">
       <AreaChart data={mockTrendData}>
         <defs>
           <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
             <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
           </linearGradient>
         </defs>
         <Tooltip 
           contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
           itemStyle={{ color: '#fff' }}
         />
         <Area type="monotone" dataKey="emissions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
       </AreaChart>
     </ResponsiveContainer>
  </div>
)

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] lg:h-[calc(100dvh-130px)] gap-4 lg:gap-6 w-full overflow-hidden pb-0 max-w-full">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Copilot <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider text-[10px]">Groq Neural Engine</Badge>
        </h1>
        <p className="text-sm text-zinc-400 font-medium">
          Your personal sustainability intelligence.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
        
        {/* Left Sidebar (Insights Panel) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 h-full overflow-y-auto pr-2 pb-2 hide-scrollbar">
          {/* Quick Stats/Capabilities */}
          <div className="p-5 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-lg flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><BrainCircuit className="w-3 h-3 text-emerald-500" /> Active Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {["Deep Analytics", "Market Forecasting", "Offset Routing", "Behavior Analysis"].map((cap, i) => (
                <div key={i} className="px-2.5 py-1 rounded-md bg-zinc-950 border border-white/5 text-xs text-zinc-400 font-medium">{cap}</div>
              ))}
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1">Recent Threads</h3>
            {RECENT_CONVERSATIONS.map((title, i) => (
              <button key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900/50 transition-colors text-left group border border-transparent hover:border-white/5">
                <MessageSquare className="h-4 w-4 text-zinc-600 group-hover:text-emerald-500 transition-colors shrink-0" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 font-medium truncate">{title}</span>
              </button>
            ))}
          </div>

          {/* Quick Tips (Daily Actions) */}
          <div className="flex flex-col gap-2 mt-auto">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1 mb-1">Daily Micro-Actions</h3>
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-zinc-900/20 text-xs text-zinc-400 font-medium">
                <tip.icon className="h-4 w-4 text-sky-400 shrink-0" />
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area (ChatGPT / Perplexity Style) */}
        <div className="lg:col-span-9 flex flex-col h-full relative min-h-0 overflow-hidden bg-zinc-950/50 rounded-3xl border border-white/5 shadow-2xl">
          
          <div className="flex-1 overflow-y-auto scroll-smooth z-10 w-full" ref={scrollRef}>
            {messages.length === 0 ? (
              // Premium Empty State
              <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto p-8 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-teal-500/5 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] mb-8 relative">
                   <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                   <Sparkles className="h-10 w-10 text-emerald-400 relative z-10" />
                </div>
                
                <h2 className="text-3xl font-black text-white mb-2">How can I assist you today?</h2>
                <p className="text-zinc-400 font-medium mb-12">Select a prompt below or type your own question to begin.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(q.title)} 
                      className="group flex flex-col items-start p-5 rounded-3xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-800 transition-all text-left hover:border-white/10 hover:-translate-y-1"
                    >
                      <div className="p-2 rounded-xl bg-zinc-950 border border-white/5 mb-4 group-hover:bg-emerald-500/10 transition-colors">
                         <q.icon className="h-5 w-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{q.title}</h4>
                      <p className="text-xs text-zinc-500">{q.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat History
              <div className="flex flex-col w-full max-w-4xl mx-auto py-8">
                {messages.map((msg) => (
                   <div key={msg.id} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-8 px-4 md:px-8 animate-in slide-in-from-bottom-4 fade-in duration-300`}>
                     
                     {/* User Bubble */}
                     {msg.role === "user" ? (
                       <div className="max-w-[85%] bg-zinc-800 text-white px-6 py-4 rounded-3xl rounded-tr-sm shadow-md text-sm md:text-base font-medium leading-relaxed">
                         {msg.content}
                       </div>
                     ) : (
                       // AI Bubble (Claude Style - clear background, logo on left)
                       <div className="flex items-start gap-4 max-w-[95%] w-full">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm">
                           <Sparkles className="h-5 w-5 text-emerald-400" />
                         </div>
                         <div className="flex flex-col flex-1 min-w-0 pt-1">
                           <div className="text-sm md:text-base leading-relaxed text-zinc-200 prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-a:text-emerald-400">
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                               {msg.content}
                             </ReactMarkdown>
                           </div>

                           {/* Mock Chart Injection based on keywords */}
                           {(msg.content.toLowerCase().includes("trend") || msg.content.toLowerCase().includes("chart")) && (
                             <AssistantChart />
                           )}

                           {/* Action / Confidence Cards */}
                           <div className="flex flex-wrap items-center gap-3 mt-4">
                              {msg.actionability && msg.actionability > 70 && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-fit cursor-pointer hover:bg-emerald-500/20 transition-colors">
                                  <div className="p-1.5 rounded-lg bg-emerald-500/20"><ShieldCheck className="w-4 h-4 text-emerald-400" /></div>
                                  <div>
                                    <p className="text-xs font-bold text-white">Recommended Action</p>
                                    <p className="text-[10px] text-zinc-400">Execute protocol based on analysis.</p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-emerald-500 ml-2" />
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                {msg.impact && (
                                  <Badge className="bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                                    <Leaf className="w-3 h-3 mr-1.5 text-emerald-500" /> {msg.impact} Impact
                                  </Badge>
                                )}
                                {msg.actionability && (
                                  <Badge className="bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                                    <Activity className="w-3 h-3 mr-1.5 text-sky-500" /> Confidence: {Math.min(99, msg.actionability + 15)}%
                                  </Badge>
                                )}
                              </div>
                           </div>

                         </div>
                       </div>
                     )}
                   </div>
                ))}
                
                {/* Typing Animation (Apple Style 3 dots) */}
                {isTyping && (
                   <div className="w-full flex justify-start mb-8 px-4 md:px-8 animate-in fade-in duration-300">
                     <div className="flex items-start gap-4 max-w-[95%] w-full">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-sm">
                         <Sparkles className="h-5 w-5 text-emerald-400" />
                       </div>
                       <div className="flex items-center gap-1.5 h-10 px-2">
                         <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.3s]" />
                         <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.15s]" />
                         <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" />
                       </div>
                     </div>
                   </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Input Area */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-20">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="max-w-4xl mx-auto w-full relative"
            >
              <div className="relative flex items-end shadow-2xl group bg-zinc-900 rounded-3xl border border-white/10 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all p-2">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Copilot..."
                  className="w-full max-h-32 min-h-[44px] bg-transparent border-none resize-none px-4 py-3 text-white text-base focus:outline-none focus:ring-0 placeholder:text-zinc-500 hide-scrollbar"
                  rows={1}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 shadow-md transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-600 shrink-0 mb-1 mr-1"
                >
                   <Send className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
              <div className="flex justify-center mt-3">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-default">
                  <Sparkles className="h-3 w-3 text-emerald-500/50" /> Copilot can make mistakes. Verify important information.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
