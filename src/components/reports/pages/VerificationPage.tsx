import React from "react"
import { CheckCircle2, Shield } from "lucide-react"

export const VerificationPage: React.FC = () => {
  return (
<div 
        id="pdf-page-7"
        className="w-[794px] h-[1123px] p-12 flex flex-col justify-between border-b border-zinc-900 bg-zinc-950 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Section 06</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">Verification & Impact</h2>
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">CarbonSphere AI</span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left side details */}
            <div className="space-y-4">
              <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-900 space-y-3">
                <h3 className="text-sm font-bold text-white">Carbon Offset Contributions</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Offset purchases are certified and logged under official carbon registry systems.
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Retired Quantity</span>
                    <span className="text-zinc-200 font-semibold">5.2 tonnes</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Registry Standard</span>
                    <span className="text-emerald-400 font-semibold">Gold Standard (GS)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Project Name</span>
                    <span className="text-zinc-200 font-semibold truncate max-w-[150px]">Rimba Raya Biodiversity</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Registry ID</span>
                    <span className="text-zinc-300 font-semibold">GS-492-A9F</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-900 space-y-3">
                <h3 className="text-sm font-bold text-white">Audit Status & Standards</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Compliance and calculations are verified in real-time by the CarbonSphere Trust Engine using audited emission protocols.
                </p>
                <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-900/20 px-3 py-2 rounded-lg text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Verified ESG Audit Certificate Active</span>
                </div>
              </div>
            </div>

            {/* Right side verification badge / presentation layout */}
            <div className="bg-zinc-900/20 p-6 rounded-2xl border border-zinc-900 flex flex-col justify-between items-center text-center">
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">OFFICIAL SECURITY CERTIFICATION</span>
                <h4 className="text-base font-bold text-white">Trust Stamp</h4>
              </div>

              {/* Certificate badge visual */}
              <div className="my-6 relative flex items-center justify-center">
                {/* Visual glow circles */}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                <div className="h-32 w-32 rounded-full border-4 border-dashed border-emerald-500/30 flex items-center justify-center relative bg-zinc-950">
                  <div className="h-24 w-24 rounded-full border-2 border-emerald-500 flex flex-col items-center justify-center p-2 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Shield className="h-8 w-8 text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase mt-1">VERIFIED</span>
                    <span className="text-[6px] text-zinc-400">AUDIT TIER 3</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-300">CarbonSphere Trust Engine</p>
                <p className="text-[9px] text-zinc-500">Cryptographically signed sustainability audit record</p>
              </div>
            </div>
          </div>

          {/* Verification Audit Signatures & Digital Trace */}
          <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 grid grid-cols-2 gap-4 text-xs font-mono text-zinc-500">
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase font-sans mb-1">Audit Record Signature</p>
              <p className="truncate">CS_SIGN_BLOCK::f7b9c2837d7a18e9a2b34</p>
              <p className="mt-1">Generated: 2026-06-10 13:37:39 UTC</p>
            </div>
            <div className="border-l border-zinc-800 pl-4">
              <p className="text-[10px] text-zinc-400 font-bold uppercase font-sans mb-1">Unique Report Signature</p>
              <p>Report ID: CS-REP-2026-8F8D2B</p>
              <p className="mt-1">Standard: Protocol v1.42 (ESG-Ready)</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-zinc-500 pt-4 border-t border-zinc-900">
          <span className="italic">Report Generated by CarbonSphere AI</span>
          <span>Page 7 of 7</span>
        </div>
      </div>
  )
}
