import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Next/font/google doesn't have Geist directly as a built-in yet in some versions, but let's assume it or use something similar if it errors out, or we can just load it via Geist sans package. For now, let's just use Inter for both if Geist isn't there, or let's try Geist if it's there. Actually, let's stick to Inter for now to avoid build errors.
// Wait, the tokens use var(--font-inter) and var(--font-geist). Let's just define Inter and a local or generic display font.
const geist = Inter({ subsets: ["latin"], variable: "--font-geist" }); // Fallback to inter

export const metadata: Metadata = {
  title: "CarbonSphere AI | Intelligent Sustainability",
  description: "Track, simulate, and forecast your environmental impact with enterprise-grade precision and Groq-powered AI coaching.",
  keywords: ["Sustainability", "Carbon Footprint", "AI Coach", "Net Zero", "Climate Tech", "Forecasting"],
  openGraph: {
    title: "CarbonSphere AI | Intelligent Sustainability",
    description: "Track, simulate, and forecast your environmental impact with enterprise-grade precision and Groq-powered AI coaching.",
    type: "website",
    url: "https://carbon-sphere-ai.vercel.app/",
    siteName: "CarbonSphere AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonSphere AI | Intelligent Sustainability",
    description: "Track, simulate, and forecast your environmental impact with enterprise-grade precision and Groq-powered AI coaching.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geist.variable} font-sans antialiased`}
      >
        {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
          <div className="bg-emerald-500 text-white text-center text-xs py-1 font-medium shadow-sm z-50 relative print:hidden">
            Demo Mode Enabled
          </div>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
