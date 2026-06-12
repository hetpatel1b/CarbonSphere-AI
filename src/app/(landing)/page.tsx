"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Leaf, Sparkles, LineChart, Target, Users, ShieldCheck, Zap, Globe, Github } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="overflow-hidden">
      {/* 1. HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 font-medium text-sm mb-8 border border-emerald-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Sustainability Intelligence</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              Your Complete <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Carbon Footprint Engine</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track, simulate, and forecast your environmental impact with enterprise-grade precision and Groq-powered AI coaching.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105">
                <Link href="/register">Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-zinc-700 hover:bg-zinc-800 transition-all">
                <Link href="/login">Enter Demo Mode</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="py-24 bg-zinc-950/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6">Carbon tracking shouldn't require a PhD.</motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground leading-relaxed">
              For too long, understanding your environmental impact has meant wrestling with complex spreadsheets, outdated scientific factors, and vague advice. We built CarbonSphere AI to seamlessly translate daily activities into actionable, mathematically precise insights.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">From data to decarbonization in three steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "1. Log Activity", desc: "Input your transport, energy, or diet metrics. We instantly calculate emissions using global scientific standards (EPA, IPCC)." },
              { icon: LineChart, title: "2. Analyze Trends", desc: "Our forecasting models process your historical data to predict future emissions and identify high-risk areas." },
              { icon: Target, title: "3. Reduce Impact", desc: "Receive highly personalized, actionable AI recommendations and simulate lifestyle changes before you make them." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-zinc-900/50 border border-white/10 p-8 rounded-3xl hover:bg-zinc-900 transition-colors"
              >
                <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES (BENTO GRID) */}
      <section className="py-32 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">A Complete Sustainability Ecosystem</h2>
            <p className="text-xl text-muted-foreground">Everything you need to reach Net Zero.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento 1: AI Coach */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Groq-Powered AI Coach</h3>
              <p className="text-lg text-muted-foreground max-w-md mb-8">
                Get millisecond-latency diagnostics on your carbon profile. The AI analyzes your habits, finds structural weaknesses, and prescribes step-by-step reduction plans.
              </p>
              {/* Abstract UI representation */}
              <div className="absolute right-[-10%] bottom-[-10%] w-3/4 h-3/4 bg-zinc-800 rounded-2xl border border-white/10 shadow-2xl p-6 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-emerald-400"/></div>
                  <div className="h-4 w-32 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-white/5 rounded-full" />
                  <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                  <div className="h-3 w-4/6 bg-white/5 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Bento 2: Simulator */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
            >
              <LineChart className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Scenario Simulator</h3>
              <p className="text-muted-foreground">What happens if you switch to an EV? Mathematically project ROI and emissions drops before committing.</p>
            </motion.div>

            {/* Bento 3: Forecasting */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
            >
              <Target className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Predictive Forecasting</h3>
              <p className="text-muted-foreground">Our algorithms analyze your historical log cadence to warn you of upcoming emission spikes.</p>
            </motion.div>

            {/* Bento 4: Marketplace */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden group"
            >
              <Globe className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Offset Marketplace</h3>
              <p className="text-muted-foreground">Purchase verified gold-standard carbon credits to neutralize unavoidable emissions.</p>
            </motion.div>

            {/* Bento 5: Community & Reports */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 rounded-3xl p-8 flex items-center"
            >
              <div>
                <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Compliance Reports & Community Challenges</h3>
                <p className="text-emerald-100/70 max-w-lg">Generate automated PDF reports for ESG compliance. Compete in global leaderboards and push your limits in community sustainability challenges.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 12. TRY DEMO */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Experience it instantly.</h2>
            <p className="text-xl text-muted-foreground mb-10">
              No sign-up required. Our One-Click Demo Mode injects rich, realistic historical data into your browser session so you can explore the AI Coach, Simulator, and Analytics immediately.
            </p>
            <Button asChild size="lg" className="h-16 px-10 text-lg rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:scale-105">
              <Link href="/login">Launch Demo Mode</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 13. GITHUB & CTA */}
      <section className="py-32 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-3xl p-16"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to reduce your impact?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join CarbonSphere AI today and take mathematically sound steps toward Net Zero.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto">
                <Link href="/register">Create Free Account</Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-4">CarbonSphere AI is open source.</p>
              <Button asChild variant="outline" className="rounded-full gap-2 text-muted-foreground hover:text-white">
                <Link href="https://github.com/hetpatel1b/CarbonSphere-AI" target="_blank">
                  <Github className="w-4 h-4" /> View on GitHub
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
