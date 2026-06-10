"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles, Send, ChevronRight, Leaf, ShieldCheck } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  impact?: "High" | "Medium" | "Low"
  actionability?: number
}

const SUGGESTED_QUESTIONS = [
  "How can I reduce my carbon footprint?",
  "What is my biggest emission source?",
  "How can I lower transportation emissions?",
  "Give me a sustainability action plan.",
  "How can I become carbon neutral?"
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Mock AI response
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      let replyContent = ""
      let impact: "High" | "Medium" | "Low" = "Medium"
      let actionability = 70

      if (lowerText.includes("transportation") || lowerText.includes("transport")) {
        replyContent = "To lower transportation emissions, I recommend shifting to public transport, organizing carpools for your daily commute, and considering an EV for your next vehicle purchase. These changes can reduce your footprint by up to 30%."
        impact = "High"
        actionability = 85
      } else if (lowerText.includes("energy")) {
        replyContent = "For energy efficiency, start by upgrading to Energy Star appliances, switching to LED lighting, and opting into a green energy tariff with your utility provider if available."
        impact = "High"
        actionability = 90
      } else if (lowerText.includes("carbon neutral")) {
        replyContent = "Becoming carbon neutral is a two-step process: First, aggressively reduce your own emissions through lifestyle and home efficiency changes. Second, purchase verified carbon offsets for the remaining unavoidable emissions."
        impact = "High"
        actionability = 60
      } else if (lowerText.includes("biggest emission")) {
        replyContent = "Based on typical user profiles, your biggest emission source is likely daily transportation, followed closely by home heating and electricity usage. Checking your Analytics tab can confirm this."
        impact = "High"
        actionability = 75
      } else {
        replyContent = "Here are 3 practical actions you can take today:\n1) Switch to a plant-rich diet 2 days a week.\n2) Wash clothes in cold water.\n3) Unplug phantom energy drainers when not in use."
        impact = "Medium"
        actionability = 95
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: replyContent,
        impact,
        actionability
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 600)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px] gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">AI Sustainability Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask questions and receive sustainability guidance powered by CarbonSphere AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                 <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                 Suggested Questions
              </CardTitle>
              <CardDescription>Select a prompt to get started.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                   <button 
                     key={i} 
                     onClick={() => handleSend(q)}
                     className="flex items-center justify-between text-left px-4 py-3.5 rounded-xl border border-border/40 bg-muted/10 hover:bg-muted/30 transition-colors text-sm text-muted-foreground hover:text-foreground group"
                   >
                     <span className="pr-4 leading-snug">{q}</span>
                     <ChevronRight className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                   </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-full">
          <Card className="flex flex-col flex-1 relative overflow-hidden border border-emerald-500/15 bg-white/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(16,185,129,0.04)] dark:border-emerald-500/10 dark:bg-zinc-950/50">
            <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/5 blur-[60px] dark:bg-emerald-500/3" />
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-80">
                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/30">
                     <Sparkles className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-foreground">How can I help you today?</p>
                     <p className="text-xs text-muted-foreground mt-1">Select a suggestion or type your own question.</p>
                   </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "user" ? (
                       <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-4 py-3 text-sm text-white shadow-sm">
                         {msg.content}
                       </div>
                    ) : (
                       <div className="max-w-[85%] space-y-3">
                         <div className="flex items-center gap-2">
                           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                             <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                           </div>
                           <span className="text-sm font-semibold text-foreground">CarbonSphere AI</span>
                         </div>
                         <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap dark:bg-white/[0.02]">
                           {msg.content}
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
                ))
              )}
            </CardContent>
            
            {/* Input Area */}
            <div className="p-4 border-t border-border/30 bg-background/50 backdrop-blur-sm">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                 className="flex items-center gap-3 relative"
               >
                 <Input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Ask about reducing your footprint..."
                   className="h-12 bg-muted/20 border-border/50 rounded-xl pr-14 focus-visible:ring-emerald-500/30 text-sm shadow-sm"
                 />
                 <Button 
                   type="submit" 
                   disabled={!input.trim()}
                   className="absolute right-1.5 h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 p-0 text-white shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                 >
                    <Send className="h-4 w-4" />
                 </Button>
               </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
