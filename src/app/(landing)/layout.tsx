import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <Leaf className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="font-bold text-xl tracking-tight">CarbonSphere AI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign In
            </Link>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20 rounded-full px-6">
              <Link href="/login">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950 text-zinc-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-zinc-200">CarbonSphere AI</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} CarbonSphere AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="https://github.com/hetpatel1b/CarbonSphere-AI" target="_blank" rel="noreferrer" className="text-sm hover:text-emerald-400 transition-colors">
              GitHub
            </Link>
            <Link href="#" className="text-sm hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm hover:text-emerald-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
