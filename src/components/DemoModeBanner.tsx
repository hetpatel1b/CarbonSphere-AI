"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

export function DemoModeBanner() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const checkDemoMode = () => {
      setIsDemo(localStorage.getItem('demoMode') === 'true');
    };

    // Initial check
    checkDemoMode();

    // Listen for storage changes across tabs or custom events in the same tab
    window.addEventListener('storage', checkDemoMode);
    window.addEventListener('demoModeChanged', checkDemoMode);

    return () => {
      window.removeEventListener('storage', checkDemoMode);
      window.removeEventListener('demoModeChanged', checkDemoMode);
    };
  }, []);

  if (!isDemo) return null;

  return (
    <div className="bg-amber-500 text-black text-center text-xs py-1.5 font-bold shadow-md z-[100] relative flex items-center justify-center gap-2 print:hidden w-full">
      <ShieldAlert className="w-4 h-4" />
      OFFLINE DEMO MODE ACTIVE - Client-Side Mock Data Only (Backend Disconnected)
    </div>
  );
}
